package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.dto.AccountsDTO;
import com.emranhss.mkbankspring.dto.DpsDTO;
import com.emranhss.mkbankspring.dto.DpsRequestDto;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DpsService {

    @Autowired
    private DpsAccountRepository dpsAccountRepository;

    @Autowired
    private DpsPaymentRepository dpsPaymentRepository;

    @Autowired
    private GLTransactionRepository glTransactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;


//creat dps------------------
    @Transactional
    public Dps createDps(Dps dps, Long accountId) {

        // ✅ DPS term limit (maximum 120 months)
        if (dps.getTermMonths() > 120) {
            throw new RuntimeException("DPS term cannot exceed 120 months.");
        }

        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        System.out.println(account + "111111111111111111111111111");

        double interestRate = getInterestRateByTerm(dps.getTermMonths());
        double maturityAmount = dps.getMonthlyAmount() * dps.getTermMonths() * (1 + interestRate / 100);

        Dps newDps = new Dps();
        newDps.setAccount(account);
        newDps.setMonthlyAmount(dps.getMonthlyAmount());
        newDps.setMonthsPaid(dps.getMonthsPaid());
        newDps.setTermMonths(dps.getTermMonths());
        newDps.setAnnualInterestRate(interestRate);


        Date startDate = new Date();
        newDps.setStartDate(startDate);

        // nextDebitDate = startDate + 1 month
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.MONTH, 1);


        newDps.setNextDebitDate(cal.getTime());

        newDps.setStatus(DpsStatus.ACTIVE);

        newDps.setMonthsPaid(0);
        newDps.setMissedCount(0);
        newDps.setTotalDeposited(0.0);
        newDps.setMaturityAmount(maturityAmount);

        System.out.println(newDps + "2222222222222222222222222");

        return dpsAccountRepository.save(newDps);
    }


    //  এখন Email দিয়ে খুঁজবে (username আসলে email হবে authentication থেকে)
    public AccountsDTO getAccountByUsername(String username) {
        Accounts account = accountRepository.findByUserEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));

        return new AccountsDTO(
                account.getId(),
                account.getName(),
                account.getBalance(),
                account.getAccountType(),
                account.getNid(),
                account.getPhoneNumber(),
                account.getAddress(),
                account.getPhoto()
        );
    }


    //--------------

    //interest rate
    private double getInterestRateByTerm(int durationInMonths) {
        if (durationInMonths <= 6) return 5.0;
        else if (durationInMonths <= 12) return 8.5;
        else return 10.0;
    }



//=======================================================
    //monthly payments methode  Starts =================
    // ======================================================


    //Methode One======>
//    public void processMonthlyPayment(Long dpsId, String token) {
//        Dps dpsAccount = dpsAccountRepository.findById(dpsId)
//                .orElseThrow(() -> new RuntimeException("DPS not found"));
//
//        if (dpsAccount.getStatus() == DpsStatus.CLOSED) {
//            throw new RuntimeException("DPS is closed. No further payments allowed.");
//        }
//
//        Accounts account = dpsAccount.getAccount();
//        double amount = dpsAccount.getMonthlyAmount();
//
//
//        if (account.getBalance() < amount)
//            throw new RuntimeException("Insufficient balance for monthly DPS payment.");
//
//        account.setBalance(account.getBalance() - amount);
//        dpsAccount.setMonthsPaid(dpsAccount.getMonthsPaid() + 1);
//        dpsAccount.setTotalDeposited(dpsAccount.getTotalDeposited() + amount);
//
//
//
//        DpsPayment payment = new DpsPayment();
//        payment.setDps(dpsAccount);
//        payment.setPaymentDate(new Date());
//        payment.setPenalty(0.0);
//        payment.setAmount(amount);
//        payment.setNote("DPS Payment For DPS ID "+ dpsId);
//
//        Transaction txn = new Transaction();
//        txn.setAccount(account);
//        System.out.println("Account number " + account);
//        txn.setAmount(amount);
//        txn.setTransactionTime(new Date());
//        txn.setType(TransactionType.DPS_DEPOSIT);
//        txn.setDescription("DPS Payment For DPS ID "+ dpsId);
//        txn.setToken(token);
//        System.out.println("token----------" + token);
//        transactionRepository.save(txn);
//
//        dpsPaymentRepository.save(payment);
//
//        // Create GL transaction for DPS Payment
//        GLTransaction glTxn = new GLTransaction();
//        glTxn.setAmount(amount);
//        glTxn.setType(GLType.DPS_PAYMENT);
//        glTxn.setDescription("DPS Payment.DPS ID Is :"+dpsAccount.getId());
//        glTxn.setReferenceId(dpsAccount.getId());
//        glTxn.setReferenceType("DPS");
//        glTransactionRepository.save(glTxn);
//
//
//        if (dpsAccount.getMonthsPaid() >= dpsAccount.getTermMonths()) {
//            dpsAccount.setStatus(DpsStatus.CLOSED);
//            //account close hole maturity ammount soho taka balance a add hobe.
//            account.setBalance(account.getBalance() + dpsAccount.getMaturityAmount());
//            Transaction transaction = new Transaction();
//            transaction.setAccount(account);
//            transaction.setAmount(dpsAccount.getMaturityAmount());
//            transaction.setTransactionTime(new Date());
//            transaction.setType(TransactionType.DEPOSIT);
//            transaction.setDescription("Deposit maturity Ammount from DPS ID "+dpsId);
//            transaction.setToken(token);
//            transactionRepository.save(transaction);
//
//            GLTransaction glTxn1 = new GLTransaction();
//            glTxn1.setAmount(-dpsAccount.getMaturityAmount());    // minus because money going out
//            glTxn1.setType(GLType.DPS_CLOSED);
//            glTxn1.setDescription("Maturity amount credited for DPS ID " + dpsId);
//            glTxn1.setReferenceId(dpsAccount.getId());
//            glTxn1.setReferenceType("DPS");
//            glTransactionRepository.save(glTxn1);
//
//        }
//
//
//        accountRepository.save(account);
//        dpsAccountRepository.save(dpsAccount);
//    }


    //methode two======>

    public void processMonthlyPayment(Long dpsId, String token) {
        Dps dpsAccount = dpsAccountRepository.findById(dpsId)
                .orElseThrow(() -> new RuntimeException("DPS not found"));

        if (dpsAccount.getStatus() == DpsStatus.CLOSED) {
            throw new RuntimeException("DPS is closed. No further payments allowed.");
        }

        Accounts account = dpsAccount.getAccount();
        double amount = dpsAccount.getMonthlyAmount();

        // পর্যাপ্ত ব্যালেন্স আছে কিনা চেক করা
        if (account.getBalance() < amount)
            throw new RuntimeException("Insufficient balance for monthly DPS payment.");

        // ব্যালেন্স ও ডিপিএস আপডেট
        account.setBalance(account.getBalance() - amount);
        dpsAccount.setMonthsPaid(dpsAccount.getMonthsPaid() + 1);
        dpsAccount.setTotalDeposited(dpsAccount.getTotalDeposited() + amount);

        //===================================================next Debit Date=======Start============
        // নতুন nextDebitDate সেট করা
        //30 দিন পরের জন্য
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date()); // বর্তমান সময়
        cal.add(Calendar.DAY_OF_MONTH, 30); // 30 দিন পরের জন্য
        dpsAccount.setNextDebitDate(cal.getTime());

        //        cal.add(Calendar.DAY_OF_MONTH, 30);    // ৩০ দিন  পরের জন্য

        //        cal.add(Calendar.DAY_OF_MONTH, 1); // 1 দিন পরের জন্য

       //        cal.add(Calendar.HOUR_OF_DAY, 1); // 1 ঘণ্টা পরে

        //        cal.add(Calendar.MINUTE, 1); // 1 মিনিট পরের জন্য

        //        cal.add(Calendar.SECOND, 20); // 10 সেকেন্ড পরের জন্য




        //=============================================================End=============

        // DpsPayment entity তৈরি ও সংরক্ষণ
        DpsPayment payment = new DpsPayment();
        payment.setDps(dpsAccount);
        payment.setPaymentDate(new Date());
        payment.setPenalty(0.0);
        payment.setAmount(amount);
        payment.setNote("DPS Payment for DPS ID " + dpsId);
        dpsPaymentRepository.save(payment);

        // Transaction তৈরি
        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setAmount(amount);
        txn.setTransactionTime(new Date());
        txn.setType(TransactionType.DPS_DEPOSIT);
        txn.setDescription("DPS Payment for DPS ID " + dpsId);
//        txn.setToken(token);
        txn.setToken(token != null ? token : "SYSTEM");

        transactionRepository.save(txn);

        // GL Transaction তৈরি
        GLTransaction glTxn = new GLTransaction();
        glTxn.setAmount(amount);
        glTxn.setType(GLType.DPS_PAYMENT);
        glTxn.setDescription("DPS Payment. DPS ID: " + dpsId);
        glTxn.setReferenceId(dpsAccount.getId());
        glTxn.setReferenceType("DPS");
        glTransactionRepository.save(glTxn);

        // যদি মেয়াদ পূর্ণ হয় → DPS বন্ধ করা + maturity টাকা ফেরত দেওয়া
        if (dpsAccount.getMonthsPaid() >= dpsAccount.getTermMonths()) {
            dpsAccount.setStatus(DpsStatus.CLOSED);

            account.setBalance(account.getBalance() + dpsAccount.getMaturityAmount());

            Transaction maturityTxn = new Transaction();
            maturityTxn.setAccount(account);
            maturityTxn.setAmount(dpsAccount.getMaturityAmount());
            maturityTxn.setTransactionTime(new Date());
            maturityTxn.setType(TransactionType.DEPOSIT);
            maturityTxn.setDescription("Deposit maturity amount from DPS ID " + dpsId);
            maturityTxn.setToken(token);
            transactionRepository.save(maturityTxn);

            GLTransaction glTxnClose = new GLTransaction();
            glTxnClose.setAmount(-dpsAccount.getMaturityAmount());
            glTxnClose.setType(GLType.DPS_CLOSED);
            glTxnClose.setDescription("Maturity credited for DPS ID " + dpsId);
            glTxnClose.setReferenceId(dpsAccount.getId());
            glTxnClose.setReferenceType("DPS");
            glTransactionRepository.save(glTxnClose);
        }

        accountRepository.save(account);
        dpsAccountRepository.save(dpsAccount);
    }


//======================================================
    //monthly payments methode  End =================
//======================================================



    //apply penalty
    public void applyPenalty(Long dpsId, double penaltyPercent) {
        Dps dpsAccount = dpsAccountRepository.findById(dpsId)
                .orElseThrow(() -> new RuntimeException("DPS not found"));

        double penalty = dpsAccount.getMonthlyAmount() * penaltyPercent / 100;
        Accounts account = dpsAccount.getAccount();

        if (account.getBalance() < (dpsAccount.getMonthlyAmount() + penalty))
            throw new RuntimeException("Insufficient balance for penalty payment.");

        account.setBalance(account.getBalance() - (dpsAccount.getMonthlyAmount() + penalty));
        dpsAccount.setMonthsPaid(dpsAccount.getMonthsPaid() + 1);

        DpsPayment payment = new DpsPayment();
        payment.setDps(dpsAccount);
        payment.setPaymentDate(new Date());
        payment.setAmount(dpsAccount.getMonthlyAmount());
        payment.setPenalty(penalty);
        dpsPaymentRepository.save(payment);

        GLTransaction glTransaction = new GLTransaction();
        glTransaction.setAmount(penalty);
        glTransaction.setTransactionDate(new Date());
        glTransaction.setDescription("DPS Penalty");
        glTransactionRepository.save(glTransaction);

        accountRepository.save(account);
        dpsAccountRepository.save(dpsAccount);
    }

    //Dps close
    public void closeDps(Long dpsId) {
        Dps dpsAccount = dpsAccountRepository.findById(dpsId)
                .orElseThrow(() -> new RuntimeException("DPS not found"));

        if (dpsAccount.getStatus() == DpsStatus.CLOSED)
            throw new RuntimeException("DPS already closed.");

        double totalDeposited = dpsPaymentRepository.findByDpsAccount(dpsAccount)
                .stream()
                .mapToDouble(DpsPayment::getAmount)
                .sum();

        double interest = totalDeposited * dpsAccount.getAnnualInterestRate() / 100;
        double finalAmount = totalDeposited + interest;

        Accounts account = dpsAccount.getAccount();
        account.setBalance(account.getBalance() + finalAmount);

        dpsAccount.setStatus(DpsStatus.CLOSED);
        dpsAccount.setNextDebitDate(new Date());

        accountRepository.save(account);
        dpsAccountRepository.save(dpsAccount);
    }

    //force closed
    public void forceCloseIfMissed(Long dpsId) {
        Dps dpsAccount = dpsAccountRepository.findById(dpsId)
                .orElseThrow(() -> new RuntimeException("DPS not found"));

        int paidMonths = dpsAccount.getMonthsPaid();
        int duration = dpsAccount.getTermMonths();

        if ((duration - paidMonths) >= 3) {
            double totalDeposited = dpsPaymentRepository.findByDpsAccount(dpsAccount)
                    .stream()
                    .mapToDouble(DpsPayment::getAmount)
                    .sum();

            double interest = totalDeposited * 1.5 / 100;
            double finalAmount = totalDeposited + interest;

            Accounts account = dpsAccount.getAccount();
            account.setBalance(account.getBalance() + finalAmount);

            dpsAccount.setStatus(DpsStatus.CLOSED);
            dpsAccount.setNextDebitDate(new Date());

            accountRepository.save(account);
            dpsAccountRepository.save(dpsAccount);
        }
    }


    //===========================View Part
    // ✅ Login account এর সব DPS দেখার জন্য
//    public List<Dps> getDpsByAccountId(Long accountId) {
//        return dpsAccountRepository.findByAccountId(accountId);
//    }

    public List<DpsDTO> getDpsByAccountId(Long accountId) {
        List<Dps> dpsList = dpsAccountRepository.findByAccountId(accountId);

        return dpsList.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Entity → DTO mapping method according to your DpsDTO
    private DpsDTO mapToDto(Dps dps) {
        if (dps == null) return null;

        Long accId = null;
        String accName = null;
        Accounts acc = dps.getAccount();
        if (acc != null) {
            accId = acc.getId();
            accName = acc.getName();
        }

        return new DpsDTO(
                dps.getId(),
                accId,
                accName,
                dps.getMonthlyAmount(),
                dps.getTermMonths(),
                dps.getStartDate(),
                dps.getNextDebitDate(),
                dps.getStatus(),
                dps.getTotalDeposited(),
                dps.getMissedCount(),
                dps.getMonthsPaid(),
                dps.getAnnualInterestRate(),
                dps.getMaturityAmount()
        );
    }


    // এক DPS এর বিস্তারিত view
    public Dps getDpsById(Long dpsId, Long accountId) {
        Dps dps = dpsAccountRepository.findById(dpsId)
                .orElseThrow(() -> new RuntimeException("DPS not found"));

        if (!dps.getAccount().getId().equals(accountId)) {
            throw new RuntimeException("You are not authorized to view this DPS");
        }

        return dps;
    }


    //---------------------st---
    public DpsDTO getSingleDpsById(Long dpsId, Long accountId) {
        Dps dps = dpsAccountRepository.findById(dpsId)
                .orElseThrow(() -> new RuntimeException("DPS not found"));

        if (!dps.getAccount().getId().equals(accountId)) {
            throw new RuntimeException("You are not authorized to view this DPS");
        }

        return mapToDto(dps); // entity → dto
    }

}
