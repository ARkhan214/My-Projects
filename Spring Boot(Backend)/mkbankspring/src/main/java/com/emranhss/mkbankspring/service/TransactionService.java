package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.dto.AccountsDTO;
import com.emranhss.mkbankspring.dto.TransactionDTO;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.repository.AccountRepository;
import com.emranhss.mkbankspring.repository.GLTransactionRepository;
import com.emranhss.mkbankspring.repository.TransactionRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private GLTransactionRepository gLTransactionRepository;

    //last update for tranST
    public List<Transaction> getTransactionsByAccount(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionTime(accountId);
    }


    // Method for Deposit & withdraw Taka (connected with TransactionResCon Method Number -1)
    public Transaction addTransaction(Transaction transaction, Long id, String token) {

        Accounts sender = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        System.out.println(sender);

        if (!sender.isAccountActiveStatus()) {
            throw new RuntimeException("Sender account is closed!");
        }

        double newBalance = sender.getBalance();
        System.out.println("Sender current balance: " + newBalance);


        if (transaction.getType() == TransactionType.INITIALBALANCE) {
            newBalance = transaction.getAmount();
            System.out.println("Sender current balance: " + newBalance);
        } else if (transaction.getType() == TransactionType.DEPOSIT) {
            newBalance += transaction.getAmount();

        } else if (transaction.getType() == TransactionType.WITHDRAW) {
            if (transaction.getAmount() > newBalance) {
                throw new RuntimeException("Insufficient balance!");
            }
            newBalance -= transaction.getAmount();
        }

        sender.setBalance(newBalance);    //save balance after Deposit or Withdraw

        accountRepository.save(sender);

        transaction.setAccount(sender);
        transaction.setTransactionTime(new Date());
        System.out.println(token + "111111111111111111111111111111111111");

        transaction.setToken(token);

        System.out.println(token + "2222222222222222222222222");

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Send transaction email
        this.sendTransactionEmail(savedTransaction);
        System.out.println("Sender current balance: " + newBalance);
        return transactionRepository.save(transaction);
//        return savedTransaction;
    }


    //For Transfer
//    public Transaction onlyTransfer(Transaction transaction, Long senderId, Long receiverId, String token) {
//
//        Accounts sender = accountRepository.findById(senderId)
//                .orElseThrow(() -> new RuntimeException("Sender account not found!"));
//        System.out.println("Sender current balance: " + sender);
//
//        Accounts receiver = accountRepository.findById(receiverId)
//                .orElseThrow(() -> new RuntimeException("Receiver account not found!"));
//        System.out.println("Receiver current balance: " + receiver);
//
//        double newBalance = sender.getBalance();
//
//        if (transaction.getType() == TransactionType.TRANSFER) {
//
//            if (!receiver.isAccountActiveStatus()) {
//                throw new RuntimeException("Receiver account is closed!");
//            }
//            if (!sender.isAccountActiveStatus()) {
//                throw new RuntimeException("Sender account is closed!");
//            }
//
//            if (transaction.getAmount() > newBalance) {
//                throw new RuntimeException("Insufficient balance!");
//            }
//
//            newBalance -= transaction.getAmount();              //minus amount from sender account
//            sender.setBalance(newBalance);                      //sender er balance save korlam
//            accountRepository.save(sender);
//
//            //update reciver balance
//            double receiverBalance = receiver.getBalance();     //receiver balance find
//            receiverBalance += transaction.getAmount();          //receiver balance update
//            receiver.setBalance(receiverBalance);               //save receiver new balance
//            accountRepository.save(receiver);
//
//            transaction.setAccount(sender);
//            transaction.setReceiverAccount(receiver);
//            transaction.setTransactionTime(new Date());
//            transaction.setToken(token);
//
//            this.cashIN(receiverId, transaction.getAmount());     // Send receiver email
//        }
//        return transactionRepository.save(transaction);
//
//    }


    @Transactional
    public Transaction onlyTransfer(Transaction requestTx, Long senderId, Long receiverId, String token) {

        Accounts sender = accountRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender account not found!"));

        Accounts receiver = accountRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver account not found!"));

        if (senderId.equals(receiverId)) {
            throw new RuntimeException("You cannot transfer to your own account!");
        }

        if (!receiver.isAccountActiveStatus()) {
            throw new RuntimeException("Receiver account is closed!");
        }
        if (!sender.isAccountActiveStatus()) {
            throw new RuntimeException("Sender account is closed!");
        }
        if (requestTx.getAmount() > sender.getBalance()) {
            throw new RuntimeException("Insufficient balance!");
        }

        // 🔹 Update balances
        sender.setBalance(sender.getBalance() - requestTx.getAmount());
        receiver.setBalance(receiver.getBalance() + requestTx.getAmount());
        accountRepository.save(sender);
        accountRepository.save(receiver);

        Date now = new Date();

        // 1️⃣ Sender Transaction (TRANSFER = debit)
        Transaction senderTx = new Transaction();
        senderTx.setType(TransactionType.TRANSFER);
        senderTx.setAmount(requestTx.getAmount());
        senderTx.setTransactionTime(now);
        senderTx.setDescription("Transfer to " + receiver.getName());
        senderTx.setAccount(sender);
        senderTx.setReceiverAccount(receiver);
        senderTx.setToken(token);
        transactionRepository.save(senderTx);


        GLTransaction glTxn = new GLTransaction();
        glTxn.setAmount(requestTx.getAmount());
        glTxn.setType(GLType.TRANSFER);
        glTxn.setDescription(requestTx.getAmount()+" Taka "+TransactionType.TRANSFER.name()+" Successfull and The reaceiver id is: "+receiver.getId());
        glTxn.setReferenceId(sender.getId());
        glTxn.setReferenceType("Transfer Money");
        gLTransactionRepository.save(glTxn);
        //  Send notification to Sender
        this.sendTransactionEmail(senderTx);

        // 2️⃣ Receiver Transaction (RECEIVE = credit)
        Transaction receiverTx = new Transaction();
        receiverTx.setType(TransactionType.RECEIVE);
        receiverTx.setAmount(requestTx.getAmount());
        receiverTx.setTransactionTime(now);
        receiverTx.setDescription("Received from " + sender.getName());
        receiverTx.setAccount(receiver);
        receiverTx.setReceiverAccount(receiver);
        receiverTx.setToken(token);
        transactionRepository.save(receiverTx);

        GLTransaction glTxn1 = new GLTransaction();
        glTxn1.setAmount(requestTx.getAmount());
        glTxn1.setType(GLType.RECEIVE);
        glTxn1.setDescription(requestTx.getAmount()+" Received by "+receiver.getName()+". Sender ID is: "+sender.getId());
        glTxn1.setReferenceId(receiver.getId());
        glTxn1.setReferenceType("Receive Money");
        gLTransactionRepository.save(glTxn1);

        // Send notification to receiver
        this.cashIN(receiverId, requestTx.getAmount());

        // return sender transaction as main response
        return senderTx;
    }


    //For Admin dashbord
    public List<Transaction> getPositiveTransactions() {
        return transactionRepository.findByAmountGreaterThan(0.0);
    }

    //For Admin dashbord
    public List<Transaction> getNegativeTransactions() {
        return transactionRepository.findByAmountLessThan(0.0);
    }


    // Email method inside TransactionService
    //method for receiver cashIn notification
    private void cashIN(Long receiverId, double amount) {
        Accounts receiver = accountRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver account not found!"));

        User user = receiver.getUser();   //find receiver from user

        String subject = "Cash In Notification";
        String mailText = "<html><body>"
                + "<p>Dear " + user.getName() + ",</p>"
                + "<p>You have received a cash-in of amount: TK " + amount
                + " successfully.</p>"
                + "<p>Your new balance is: " + receiver.getBalance() + " TK</p>"
                + "<p>Thanks for staying with us.</p>"
                + "</body></html>";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, mailText);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send cash-in email", e);
        }
    }


    // Save or update transaction
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }


    // Get all transactions(connected with TransactionResCon Method Number -2)
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }


    // Get transactions by Account ID
    public Transaction getTransactionByAccountId(Long accountId) {
        return transactionRepository.findById(accountId).get();
    }


    //for delete transaction by id (connected with TransactionResCon Method Number -4)
    public void deleteTransactionByAccountId(Long accountId) {
        transactionRepository.deleteByAccountId(accountId);
    }


    // Get transactions by Accounts object (connected with TransactionResCon Method Number -3)
    public List<Transaction> getTransactionsByAccount(Accounts account) {
        return transactionRepository.findByAccount(account);
    }


    //Table Relation Use kore filter kora(Transaction table er sathe Account Table er Relation k kaje lagano)
    //Transaction Type baboher kore filter kora(connected with TransactionResCon Method Number -5)
    //Method for Search Transaction by deposit
    public List<Transaction> getDepositsByAccount(Long accountId) {
        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        return account.getTransactions().stream()
                .filter(t -> t.getType() == TransactionType.DEPOSIT)
                .toList();
    }


    //Table Relation Use kore filter kora(Transaction table er sathe Account Table er Relation k kaje lagano)
    //Transaction Type baboher kore filter kora(connected with TransactionResCon Method Number -6)
    //Method for Search Transaction by withdraw
    public List<Transaction> getWithdrawsByAccount(Long accountId) {
        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        return account.getTransactions().stream()
                .filter(t -> t.getType() == TransactionType.WITHDRAW)
                .toList();
    }


    public void sendTransactionEmail(Transaction transaction) {
        Accounts accounts = transaction.getAccount();
        User user = accounts.getUser();  // account holder

        String subject = "Transaction Confirmation";
        String mailText = "<!DOCTYPE html>"
                + "<html>"
//                + "<head>"
//                + "<style>"
//                + "  body { font-family: Arial, sans-serif; line-height: 1.6; }"
//                + "  .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }"
//                + "  .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }"
//                + "  .content { padding: 20px; }"
//                + "  .footer { font-size: 0.9em; color: #777; margin-top: 20px; text-align: center; }"
//                + "</style>"
//                + "</head>"
                + "<body>"
//                + "  <div class='container'>"
//                + "    <div class='header'>"
//                + "      <h2>Congratulations!!</h2>"
//                + "    </div>"
//                + "    <div class='content'>"
                + "<p>Dear " + user.getName() + ",</p>"
                + "<p>TK " + transaction.getAmount() + " " + transaction.getType() + " successful on " + transaction.getTransactionTime() + " Your Current balance is " + accounts.getBalance() +" Taka"+ "</p>"
                + "<p>Thanks for staying with us.</p>"
                + "    <div class='footer'>"
                + "      <p> Sincerely,</p>"
                + "      <p>MK Bank Ltd.</p>"
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, mailText);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send transaction email", e);
        }
    }


    //Transcation Statement
//    public List<TransactionDTO> getTransactionsByAccountID(Long accountId) {
//        List<Transaction> transactions =
//                transactionRepository.findByAccountIdOrderByTransactionTimeDesc(accountId);
//
//        return transactions.stream().map(tx -> {
//            String nature = getTransactionNature(tx); // DEBIT / CREDIT নির্ধারণ
//
//            return new TransactionDTO(
//                    tx.getId(),
//                    tx.getAccount().getName(),   // Account holder name
//                    tx.getReceiverAccount() != null ? tx.getReceiverAccount().getId() : null,   // Receiver ID
//                    tx.getReceiverAccount() != null ? tx.getReceiverAccount().getName() : null, // Receiver Name
//                    nature,
//                    tx.getType().name(),
//                    tx.getAmount(),
//                    tx.getTransactionTime(),
//                    tx.getDescription(),
//                    tx.getCompanyName(),
//                    tx.getAccountHolderBillingId()
//
//            );
//        }).toList();
//    }


    public List<TransactionDTO> getTransactionsByAccountID(Long accountId) {
        List<Transaction> transactions =
                transactionRepository.findByAccountIdOrderByTransactionTime(accountId);

        return transactions.stream().map(tx -> {
            String nature = getTransactionNature(tx); // DEBIT / CREDIT নির্ধারণ

            // Convert sender account → AccountsDTO
            Accounts sender = tx.getAccount();
            AccountsDTO senderDTO = new AccountsDTO(
                    sender.getId(),
                    sender.getName(),
                    sender.isAccountActiveStatus(),
                    sender.getAccountType(),
                    sender.getBalance(),
                    sender.getNid(),
                    sender.getPhoneNumber(),
                    sender.getAddress(),
                    sender.getPhoto(),
                    sender.getDateOfBirth(),
                    sender.getAccountOpeningDate(),
                    sender.getAccountClosingDate(),
                    sender.getRole() != null ? sender.getRole().name() : null
            );

            // Convert receiver account → AccountsDTO (if exists)
            AccountsDTO receiverDTO = null;
            if (tx.getReceiverAccount() != null) {
                Accounts receiver = tx.getReceiverAccount();
                receiverDTO = new AccountsDTO(
                        receiver.getId(),
                        receiver.getName(),
                        receiver.isAccountActiveStatus(),
                        receiver.getAccountType(),
                        receiver.getBalance(),
                        receiver.getNid(),
                        receiver.getPhoneNumber(),
                        receiver.getAddress(),
                        receiver.getPhoto(),
                        receiver.getDateOfBirth(),
                        receiver.getAccountOpeningDate(),
                        receiver.getAccountClosingDate(),
                        receiver.getRole() != null ? receiver.getRole().name() : null
                );
            }

            // Build full TransactionDTO
            return new TransactionDTO(
                    tx.getId(),
                    senderDTO,
                    receiverDTO,
                    nature,
                    tx.getType().name(),
                    tx.getAmount(),
                    tx.getTransactionTime(),
                    tx.getDescription(),
                    tx.getCompanyName(),
                    tx.getAccountHolderBillingId()
            );
        }).toList();
    }


    // Debit / Credit Logic
    private String getTransactionNature(Transaction tx) {
        if (tx.getType() == TransactionType.INITIALBALANCE
                || tx.getType() == TransactionType.DEPOSIT
                || tx.getType() == TransactionType.RECEIVE
                || tx.getType() == TransactionType.FIXED_DEPOSIT_CLOSED
        ) {
            return "CREDIT";
        } else if (tx.getType() == TransactionType.WITHDRAW
                || tx.getType() == TransactionType.FIXED_DEPOSIT
                || tx.getType() == TransactionType.FD_CLOSED_PENALTY
                || tx.getType() == TransactionType.TRANSFER
                || tx.getType() == TransactionType.MOBILE_RECHARGE
                || tx.getType() == TransactionType.WATER_BILL
                || tx.getType() == TransactionType.INTERNET_BILL
                || tx.getType() == TransactionType.GAS_BILL
                || tx.getType() == TransactionType.ELECTRICITY_BILL
                || tx.getType() == TransactionType.CREDIT_CARD_BILL
                || tx.getType() == TransactionType.DPS_DEPOSIT) {
            return "DEBIT";
        } else {
            return "UNKNOWN";
        }
    }



    public Map<String, BigDecimal> getTotalDebitAndCredit() {
        List<Transaction> transactions = transactionRepository.findAll();

        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (Transaction tx : transactions) {
            String nature = getTransactionNature(tx);
            if ("DEBIT".equals(nature)) {
                totalDebit = totalDebit.add(BigDecimal.valueOf(tx.getAmount()));
            } else if ("CREDIT".equals(nature)) {
                totalCredit = totalCredit.add(BigDecimal.valueOf(tx.getAmount()));
            }
        }

        Map<String, BigDecimal> result = new HashMap<>();
        result.put("totalDebit", totalDebit);
        result.put("totalCredit", totalCredit);

        return result;
    }



    //TransactionStatement Filter for Employee with giving Id
//    public List<TransactionDTO> getTransactionsByAccountIDWithFilter(
//            Long accountId,
//            String startDateStr,
//            String endDateStr,
//            String type,
//            String transactionType
//    ) {
//        final Date startDate;
//        final Date endDate;
//
//        try {
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//            startDate = (startDateStr != null) ? sdf.parse(startDateStr) : null;
//            endDate = (endDateStr != null) ? sdf.parse(endDateStr) : null;
//        } catch (Exception e) {
//            throw new RuntimeException("Invalid date format. Use yyyy-MM-dd", e);
//        }
//
//        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTransactionTimeDesc(accountId);
//
//        return transactions.stream()
//                .filter(tx -> (startDate == null || !tx.getTransactionTime().before(startDate)))
//                .filter(tx -> (endDate == null || !tx.getTransactionTime().after(endDate)))
//                .filter(tx -> (type == null || getTransactionNature(tx).equalsIgnoreCase(type)))
//                .filter(tx -> (transactionType == null || tx.getType().name().equalsIgnoreCase(transactionType)))
//                .map(tx -> new TransactionDTO(
//                        tx.getId(),
//                        tx.getAccount().getName(),
//                        tx.getReceiverAccount() != null ? tx.getReceiverAccount().getId() : null,
//                        tx.getReceiverAccount() != null ? tx.getReceiverAccount().getName() : null,
//                        getTransactionNature(tx),
//                        tx.getType().name(),
//                        tx.getAmount(),
//                        tx.getTransactionTime(),
//                        tx.getDescription(),
//                        tx.getCompanyName(),
//                        tx.getAccountHolderBillingId()
//                ))
//                .collect(Collectors.toList());
//    }


    public List<TransactionDTO> getTransactionsByAccountIDWithFilter(
            Long accountId,
            String startDateStr,
            String endDateStr,
            String type,
            String transactionType
    ) {
        final Date startDate;
        final Date endDate;

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            startDate = (startDateStr != null) ? sdf.parse(startDateStr) : null;
            endDate = (endDateStr != null) ? sdf.parse(endDateStr) : null;
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Use yyyy-MM-dd", e);
        }

        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTransactionTime(accountId);

        return transactions.stream()
                .filter(tx -> (startDate == null || !tx.getTransactionTime().before(startDate)))
                .filter(tx -> (endDate == null || !tx.getTransactionTime().after(endDate)))
                .filter(tx -> (type == null || getTransactionNature(tx).equalsIgnoreCase(type)))
                .filter(tx -> (transactionType == null || tx.getType().name().equalsIgnoreCase(transactionType)))
                .map(tx -> {
                    // sender account → DTO
                    Accounts sender = tx.getAccount();
                    AccountsDTO senderDTO = new AccountsDTO(
                            sender.getId(),
                            sender.getName(),
                            sender.isAccountActiveStatus(),
                            sender.getAccountType(),
                            sender.getBalance(),
                            sender.getNid(),
                            sender.getPhoneNumber(),
                            sender.getAddress(),
                            sender.getPhoto(),
                            sender.getDateOfBirth(),
                            sender.getAccountOpeningDate(),
                            sender.getAccountClosingDate(),
                            sender.getRole() != null ? sender.getRole().name() : null
                    );

                    // receiver account → DTO
                    AccountsDTO receiverDTO = null;
                    if (tx.getReceiverAccount() != null) {
                        Accounts receiver = tx.getReceiverAccount();
                        receiverDTO = new AccountsDTO(
                                receiver.getId(),
                                receiver.getName(),
                                receiver.isAccountActiveStatus(),
                                receiver.getAccountType(),
                                receiver.getBalance(),
                                receiver.getNid(),
                                receiver.getPhoneNumber(),
                                receiver.getAddress(),
                                receiver.getPhoto(),
                                receiver.getDateOfBirth(),
                                receiver.getAccountOpeningDate(),
                                receiver.getAccountClosingDate(),
                                receiver.getRole() != null ? receiver.getRole().name() : null
                        );
                    }

                    return new TransactionDTO(
                            tx.getId(),
                            senderDTO,
                            receiverDTO,
                            getTransactionNature(tx),   // DEBIT / CREDIT
                            tx.getType().name(),
                            tx.getAmount(),
                            tx.getTransactionTime(),
                            tx.getDescription(),
                            tx.getCompanyName(),
                            tx.getAccountHolderBillingId()
                    );
                })
                .collect(Collectors.toList());
    }



    //TransactionStatement Filter for Account Holder without giving Id

    public List<TransactionDTO> getFilteredTransactions(
            Long accountId,
            Date startDate,
            Date endDate,
            String type,
            String transactionType
    ) {
        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTransactionTime(accountId);

        return transactions.stream()
                .filter(tx -> (startDate == null || !tx.getTransactionTime().before(startDate)))
                .filter(tx -> (endDate == null || !tx.getTransactionTime().after(endDate)))
                .filter(tx -> (type == null || type.isEmpty() || getTransactionNature(tx).equalsIgnoreCase(type)))
                .filter(tx -> (transactionType == null || transactionType.isEmpty() || tx.getType().name().equalsIgnoreCase(transactionType)))
                .map(tx -> {
                    // sender account → DTO
                    Accounts sender = tx.getAccount();
                    AccountsDTO senderDTO = new AccountsDTO(
                            sender.getId(),
                            sender.getName(),
                            sender.isAccountActiveStatus(),
                            sender.getAccountType(),
                            sender.getBalance(),
                            sender.getNid(),
                            sender.getPhoneNumber(),
                            sender.getAddress(),
                            sender.getPhoto(),
                            sender.getDateOfBirth(),
                            sender.getAccountOpeningDate(),
                            sender.getAccountClosingDate(),
                            sender.getRole() != null ? sender.getRole().name() : null
                    );

                    // receiver account → DTO (nullable)
                    AccountsDTO receiverDTO = null;
                    if (tx.getReceiverAccount() != null) {
                        Accounts receiver = tx.getReceiverAccount();
                        receiverDTO = new AccountsDTO(
                                receiver.getId(),
                                receiver.getName(),
                                receiver.isAccountActiveStatus(),
                                receiver.getAccountType(),
                                receiver.getBalance(),
                                receiver.getNid(),
                                receiver.getPhoneNumber(),
                                receiver.getAddress(),
                                receiver.getPhoto(),
                                receiver.getDateOfBirth(),
                                receiver.getAccountOpeningDate(),
                                receiver.getAccountClosingDate(),
                                receiver.getRole() != null ? receiver.getRole().name() : null
                        );
                    }

                    return new TransactionDTO(
                            tx.getId(),
                            senderDTO,
                            receiverDTO,
                            getTransactionNature(tx),   // DEBIT / CREDIT
                            tx.getType().name(),
                            tx.getAmount(),
                            tx.getTransactionTime(),
                            tx.getDescription(),
                            tx.getCompanyName(),
                            tx.getAccountHolderBillingId()
                    );
                })
                .toList();
    }










//    public List<TransactionDTO> getFilteredTransactions(Long accountId, Date startDate, Date endDate, String type, String transactionType) {
//        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTransactionTimeDesc(accountId);
//
//        // Java Stream  filter apply
//        return transactions.stream()
//                .filter(tx -> (startDate == null || !tx.getTransactionTime().before(startDate)))
//                .filter(tx -> (endDate == null || !tx.getTransactionTime().after(endDate)))
//                .filter(tx -> (type == null || type.isEmpty() || getTransactionNature(tx).equalsIgnoreCase(type)))
//                .filter(tx -> (transactionType == null || transactionType.isEmpty() || tx.getType().name().equalsIgnoreCase(transactionType)))
//                .map(tx -> new TransactionDTO(
//                        tx.getId(),
//                        tx.getAccount().getName(),
//                        tx.getReceiverAccount() != null ? tx.getReceiverAccount().getId() : null,
//                        tx.getReceiverAccount() != null ? tx.getReceiverAccount().getName() : null,
//                        getTransactionNature(tx),
//                        tx.getType().name(),
//                        tx.getAmount(),
//                        tx.getTransactionTime(),
//                        tx.getDescription(),
//                        tx.getCompanyName(),
//                        tx.getAccountHolderBillingId()
//                ))
//                .toList();
//    }


    //payment er jonno
    //Common method for all bill payments

    @Transactional
    protected Transaction processBillPayment(Long accountId,
                                             double amount,
                                             String companyName,
                                             String customerBillingId,
                                             TransactionType type,
                                             String token) {

        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Check balance
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance to pay bill");
        }

        // Deduct balance
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);


        // ================= GL Transaction Mapping Start=================
        Map<TransactionType, GLType> glMapping = Map.of(
                TransactionType.ELECTRICITY_BILL, GLType.ELECTRICITY_BILL,
                TransactionType.GAS_BILL, GLType.GAS_BILL,
                TransactionType.WATER_BILL, GLType.WATER_BILL,
                TransactionType.INTERNET_BILL, GLType.INTERNET_BILL,
                TransactionType.MOBILE_RECHARGE, GLType.MOBILE_RECHARGE,
                TransactionType.CREDIT_CARD_BILL, GLType.CREDIT_CARD_BILL
        );

        GLType glType = glMapping.get(type);

        if(glType != null) {
            GLTransaction glTxn = new GLTransaction();
            glTxn.setAmount(amount);
            glTxn.setType(glType);
            glTxn.setDescription("Bill payment GL for " + type.name());
            glTxn.setReferenceId(account.getId());
            glTxn.setReferenceType("Utility Bill Payment");
            gLTransactionRepository.save(glTxn);
        }
        //---------------------End

        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(type);
        transaction.setCompanyName(companyName);
        transaction.setAccountHolderBillingId(customerBillingId);
        transaction.setAmount(amount);
        transaction.setTransactionTime(new Date());
        transaction.setDescription(type.name()+" Payment Successfull Company Name: " + companyName +" and Account Holder Billing id is: " + customerBillingId);

        transaction.setToken(token);

        return transactionRepository.save(transaction);
    }

    // =================== Specific Bill Payment Methods ===================

    public Transaction payElectricityBill(Long accountId, double amount, String companyName, String customerBillingId, String token) {
        return processBillPayment(accountId, amount, companyName, customerBillingId, TransactionType.ELECTRICITY_BILL, token);
    }

    public Transaction payGasBill(Long accountId, double amount, String companyName, String customerBillingId, String token) {
        return processBillPayment(accountId, amount, companyName, customerBillingId, TransactionType.GAS_BILL, token);
    }

    public Transaction payWaterBill(Long accountId, double amount, String companyName, String customerBillingId, String token) {
        return processBillPayment(
                accountId,
                amount,
                companyName,
                customerBillingId,
                TransactionType.WATER_BILL,
                token);
    }

    public Transaction payInternetBill(Long accountId, double amount, String companyName, String customerBillingId, String token) {
        return processBillPayment(accountId, amount, companyName, customerBillingId, TransactionType.INTERNET_BILL, token);
    }

    public Transaction payMobileBill(Long accountId, double amount, String companyName, String customerBillingId, String token) {
        return processBillPayment(accountId, amount, companyName, customerBillingId, TransactionType.MOBILE_RECHARGE, token);
    }

    public Transaction payCreditCardBill(Long accountId, double amount, String companyName, String customerBillingId, String token) {
        return processBillPayment(accountId, amount, companyName, customerBillingId, TransactionType.CREDIT_CARD_BILL, token);
    }
}
