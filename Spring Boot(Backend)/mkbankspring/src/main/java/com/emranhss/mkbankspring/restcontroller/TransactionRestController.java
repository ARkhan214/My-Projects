package com.emranhss.mkbankspring.restcontroller;

import com.emranhss.mkbankspring.dto.TransactionDTO;
import com.emranhss.mkbankspring.entity.Accounts;
import com.emranhss.mkbankspring.entity.Transaction;
import com.emranhss.mkbankspring.entity.User;
import com.emranhss.mkbankspring.repository.AccountRepository;
import com.emranhss.mkbankspring.repository.UserRepository;
import com.emranhss.mkbankspring.service.AccountService;
import com.emranhss.mkbankspring.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions/")
public class TransactionRestController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService  accountService;


    @Autowired
    private UserRepository userRepository;

    // Deposit / Withdraw / InitialBalance(Using for open account + depo+with)
    @PostMapping("add")
    public Transaction addTransaction(
            @RequestBody Transaction transaction,
            Authentication authentication) {

        System.out.println(authentication+"44444444444444444444444444444");
        String token = (String) authentication.getCredentials(); // raw JWT token
        System.out.println(token+"3333333333333333333333");

        String username = authentication.getName();
        Optional<User> user = userRepository.findByEmail(username);
        User u = user.orElseThrow(() -> new RuntimeException("User not found with email: " + username));

        Accounts sender = accountRepository.findAccountByUser(u)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));

        return transactionService.addTransaction(transaction, sender.getId(), token);
    }


    //method transfer(Using for Transfer money From Account)
    @PostMapping("tr/transfer/{receiverId}")
    public Transaction transfer(
            @RequestBody Transaction transaction,
            @PathVariable Long receiverId,
            Authentication authentication) {

        String token = (String) authentication.getCredentials();  // raw JWT token
        String username = authentication.getName();
        Optional<User> user = userRepository.findByEmail(username);
        User u = user.orElseThrow(() -> new RuntimeException("User not found with email: " + username));
        Accounts sender = accountRepository.findAccountByUser(u)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));


        return transactionService.onlyTransfer(transaction, sender.getId(), receiverId, token);
    }



//---------Debit & Credit---Start--For Admin Dashbord-
    @GetMapping("totals")
    public ResponseEntity<Map<String, BigDecimal>> getTotals() {
        Map<String, BigDecimal> totals = transactionService.getTotalDebitAndCredit();
        return ResponseEntity.ok(totals);
    }
//---------Debit & Credit---End



    //for transaction after add sequrity(Initial,deposit,withdraw)
    @PostMapping("tr/{id}")
    public Transaction deposit(
            @RequestBody Transaction transaction,
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");  // token add
        return transactionService.addTransaction(transaction, id, token);
    }


    // method transfer(Employee login kore Transfer korte parbe j kono account er moddhe)
    @PostMapping("tr/{senderId}/{receiverId}")
    public Transaction transfer(
            @RequestBody Transaction transaction,
            @PathVariable Long senderId,
            @PathVariable Long receiverId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        return transactionService.onlyTransfer(transaction, senderId, receiverId, token);
    }

    //  Get all transactions(Method Number -2)
    @GetMapping("all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    //For Admin dashbord
    @GetMapping("positive")
    public ResponseEntity<List<Transaction>> getPositiveTransactions() {
        return ResponseEntity.ok(transactionService.getPositiveTransactions());
    }
    //For Admin dashbord
    @GetMapping("negative")
    public ResponseEntity<List<Transaction>> getNegativeTransactions() {
        return ResponseEntity.ok(transactionService.getNegativeTransactions());
    }

    //(Method Number -5)
    //Table Relation Use kore filter kora(Transaction table er sathe Account Table er Relation k kaje lagano)
    //Method for Search Transaction by deposit
    @GetMapping("{accountId}/deposits")
    public ResponseEntity<List<Transaction>> getDeposits(@PathVariable Long accountId) {
        List<Transaction> deposits = transactionService.getDepositsByAccount(accountId);
        return ResponseEntity.ok(deposits);
    }

    //(Method Number -6)
    //Method for Search Transaction by withdraw
    @GetMapping("{accountId}/withdraws")
    public ResponseEntity<List<Transaction>> getWithdraws(@PathVariable Long accountId) {
        List<Transaction> withdraws = transactionService.getWithdrawsByAccount(accountId);
        return ResponseEntity.ok(withdraws);
    }


    //for delete transaction by id(Method Number -4)
    @DeleteMapping("{id}")
    public void deleteTransactionByAccountId(@PathVariable Long accountId) {

        transactionService.deleteTransactionByAccountId(accountId);
    }

    @GetMapping("statement/{accountId}")
    public ResponseEntity<List<Transaction>> getStatement(@PathVariable Long accountId) {
        List<Transaction> transactions = transactionService.getTransactionsByAccount(accountId);
        return ResponseEntity.ok(transactions);
    }

//    @GetMapping("{accountId}")
//    public List<TransactionDTO> getTransactionStatement(@PathVariable Long accountId) {
//        return transactionService.getTransactionsByAccountID(accountId);
//    }



    //Account holder tar bank statement dekhar jonno eta baboher kortese
    @GetMapping("statement")
    public List<TransactionDTO> getTransactionStatement(Authentication authentication) {
        //email/username from Authentication
        String email = authentication.getName();

        // find Account
        Long accountId = accountService.findAccountByEmail(email).getId();

        // Statement
        return transactionService.getTransactionsByAccountID(accountId);
    }

    // Filter endpoint for employee(employee eta diea filter kortese)
    @GetMapping("filter")
    public List<TransactionDTO> getTransactionsWithFilter(
            @RequestParam Long accountId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String transactionType
    ) {
        return transactionService.getTransactionsByAccountIDWithFilter(
                accountId,
                startDate,
                endDate,
                type,
                transactionType
        );
    }



    //Filter For Account Holder Without giving account
    @GetMapping("statement/filter")
    public List<TransactionDTO>getFilteredTransactions(
            Authentication authentication,
            @RequestParam(required = false)@DateTimeFormat(pattern = "yyyy-MM-dd")Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String transactionType
    ) {
        // 1. Get logged in user's email
        String email = authentication.getName();

        // 2. Get accountId from email
        Long accountId = accountService.findAccountByEmail(email).getId();

        // 3. Service call (filter logic implement service layer)
        return transactionService.getFilteredTransactions(accountId, startDate, endDate, type, transactionType);
    }



    //payment er jonno

    // ====================== BILL PAYMENT ENDPOINTS ======================

    @PostMapping("pay/electricity")
    public ResponseEntity<Transaction> payElectricity(@RequestBody TransactionDTO dto,
                                                      Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        String token = (String)authentication.getCredentials(); // JWT token set korlam
        Transaction tx = transactionService.payElectricityBill(
                accountId,
                dto.getAmount(),
                dto.getCompanyName(),
                dto.getAccountHolderBillingId(),
                token
        );
        return ResponseEntity.ok(tx);
    }

    @PostMapping("pay/gas")
    public ResponseEntity<Transaction> payGas(@RequestBody TransactionDTO dto,
                                              Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        String token=(String)authentication.getCredentials();
        Transaction tx = transactionService.payGasBill(
                accountId,
                dto.getAmount(),
                dto.getCompanyName(),
                dto.getAccountHolderBillingId(),
                token
        );
        return ResponseEntity.ok(tx);
    }

    @PostMapping("pay/water")
    public ResponseEntity<Transaction> payWater(@RequestBody TransactionDTO dto,
                                                Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        String token = (String)authentication.getCredentials();
        Transaction tx = transactionService.payWaterBill(
                accountId,
                dto.getAmount(),
                dto.getCompanyName(),
                dto.getAccountHolderBillingId(),
                token
        );
        return ResponseEntity.ok(tx);
    }

    @PostMapping("pay/internet")
    public ResponseEntity<Transaction> payInternet(@RequestBody TransactionDTO dto,
                                                   Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        String token = (String)authentication.getCredentials();
        Transaction tx = transactionService.payInternetBill(
                accountId,
                dto.getAmount(),
                dto.getCompanyName(),
                dto.getAccountHolderBillingId(),
                token
        );
        return ResponseEntity.ok(tx);
    }

    @PostMapping("pay/mobile")
    public ResponseEntity<Transaction> payMobile(@RequestBody TransactionDTO dto,
                                                 Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        String token = (String)authentication.getCredentials();
        Transaction tx = transactionService.payMobileBill(
                accountId,
                dto.getAmount(),
                dto.getCompanyName(),
                dto.getAccountHolderBillingId(),
                token
        );
        return ResponseEntity.ok(tx);
    }

    @PostMapping("pay/credit-card")
    public ResponseEntity<Transaction> payCreditCard(@RequestBody TransactionDTO dto,
                                                     Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        String token = (String)authentication.getCredentials();
        Transaction tx = transactionService.payCreditCardBill(
                accountId,
                dto.getAmount(),
                dto.getCompanyName(),
                dto.getAccountHolderBillingId(),
                token
        );
        return ResponseEntity.ok(tx);
    }
}
