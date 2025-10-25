package com.emranhss.mkbankspring.restcontroller;

import com.emranhss.mkbankspring.dto.AccountsDTO;
import com.emranhss.mkbankspring.dto.LoanDto;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.repository.AccountRepository;
import com.emranhss.mkbankspring.repository.GLTransactionRepository;
import com.emranhss.mkbankspring.repository.LoanRepository;
import com.emranhss.mkbankspring.repository.TransactionRepository;
import com.emranhss.mkbankspring.service.LoanService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/loans")
public class AdminLoanRestController {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private LoanService loanService;
    @Autowired
    private GLTransactionRepository gLTransactionRepository;

//    @GetMapping("/pending")
//    public ResponseEntity<List<LoanDto>> getPendingLoans() {
//        List<LoanDto> loanDTOs = loanService.getPendingLoanDTOs();
//        return ResponseEntity.ok(loanDTOs);
//    }


    // View all pending loans as DTO
//    @GetMapping("/pendings")
//    public ResponseEntity<List<LoanDto>> getPendingLoan() {
//        List<Loan> loans = loanRepository.findByStatus(LoanStatus.PENDING);
//
//        List<LoanDto> loanDTOs = loans.stream().map(loan -> {
//            LoanDto dto = new LoanDto();
//            dto.setId(loan.getId());
//            dto.setLoanAmount(loan.getLoanAmount());
//            dto.setEmiAmount(loan.getEmiAmount());
//            dto.setInterestRate(loan.getInterestRate());
//            dto.setStatus(loan.getStatus().name());
//            dto.setLoanType(loan.getLoanType().name());
//            dto.setLoanStartDate(loan.getLoanStartDate());
//            dto.setLoanMaturityDate(loan.getLoanMaturityDate());
//            dto.setTotalAlreadyPaidAmount(loan.getTotalAlreadyPaidAmount());
//            dto.setRemainingAmount(loan.getRemainingAmount());
//            dto.setPenaltyRate(loan.getPenaltyRate());
//            dto.setLastPaymentDate(loan.getLastPaymentDate());
//            dto.setUpdatedAt(loan.getUpdatedAt());
//
//            // Account DTO mapping
//            AccountsDTO accountDTO = new AccountsDTO();
//            accountDTO.setId(loan.getAccount().getId());
//            accountDTO.setName(loan.getAccount().getName());
//            accountDTO.setBalance(loan.getAccount().getBalance());
//            // প্রয়োজন অনুযায়ী অন্যান্য ফিল্ডও এখানে set করতে পারো
//
//            dto.setAccount(accountDTO);
//
//            return dto;
//        }).collect(Collectors.toList());
//
//        return ResponseEntity.ok(loanDTOs);
//    }

    @GetMapping("/all")
    public ResponseEntity<List<LoanDto>> getAllLoan() {
        List<Loan> loans = loanRepository.findAll();

        List<LoanDto> loanDTOs = loans.stream().map(loan -> {
            LoanDto dto = new LoanDto();
            dto.setId(loan.getId());
            dto.setLoanAmount(loan.getLoanAmount());
            dto.setEmiAmount(loan.getEmiAmount());
            dto.setInterestRate(loan.getInterestRate());
            dto.setStatus(loan.getStatus().name());
            dto.setLoanType(loan.getLoanType().name());
            dto.setLoanStartDate(loan.getLoanStartDate());
            dto.setLoanMaturityDate(loan.getLoanMaturityDate());
            dto.setTotalAlreadyPaidAmount(loan.getTotalAlreadyPaidAmount());
            dto.setRemainingAmount(loan.getRemainingAmount());
            dto.setPenaltyRate(loan.getPenaltyRate());
            dto.setLastPaymentDate(loan.getLastPaymentDate());
            dto.setUpdatedAt(loan.getUpdatedAt());

            // Account DTO mapping
            AccountsDTO accountDTO = new AccountsDTO();
            accountDTO.setId(loan.getAccount().getId());
            accountDTO.setName(loan.getAccount().getName());
            accountDTO.setBalance(loan.getAccount().getBalance());

            dto.setAccount(accountDTO);

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(loanDTOs);
    }


    //---------------------------------end

    // Approve Loan
    @PostMapping("/{loanId}/approve")
    @Transactional
    public ResponseEntity<String> approveLoan(
            @PathVariable Long loanId,
            Authentication authentication
    ) {
        String token = (String) authentication.getCredentials();  // raw JWT token
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            return ResponseEntity.badRequest().body("Loan is not in pending state");
        }

        // Loan approve
        loan.setStatus(LoanStatus.ACTIVE);
        loanRepository.save(loan);

        // Update account balance
        var account = loan.getAccount();
        account.setBalance(account.getBalance() + loan.getLoanAmount());
        accountRepository.save(account);

        // Transaction entry
        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setAmount(loan.getLoanAmount());
        txn.setType(TransactionType.DEPOSIT);
        txn.setDescription("Loan Approved and Credited to Account");
        txn.setTransactionTime(new Date());
        txn.setToken(token);
        transactionRepository.save(txn);

        GLTransaction glTxn = new GLTransaction();
        glTxn.setAmount(account.getBalance());
        glTxn.setType(GLType.LOAN_OPEN);
        glTxn.setDescription("Loan Approved Successfull."+loan.getLoanAmount()+" Taka add with your balance.");
        glTxn.setReferenceId(account.getId());
        glTxn.setReferenceType("Loan Amount");
        gLTransactionRepository.save(glTxn);

        return ResponseEntity.ok("Loan approved successfully!");
    }

    // Reject Loan
    @PostMapping("/{loanId}/reject")
    @Transactional
    public ResponseEntity<String> rejectLoan(
            @PathVariable Long loanId
    ) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            return ResponseEntity.badRequest().body("Loan is not in pending state");
        }

        loan.setStatus(LoanStatus.REJECTED);
        loanRepository.save(loan);

        return ResponseEntity.ok("Loan rejected successfully!");
    }


}
