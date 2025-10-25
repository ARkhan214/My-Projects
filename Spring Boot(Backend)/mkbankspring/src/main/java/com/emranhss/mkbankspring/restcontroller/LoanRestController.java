package com.emranhss.mkbankspring.restcontroller;

import com.emranhss.mkbankspring.dto.*;
import com.emranhss.mkbankspring.entity.Accounts;
import com.emranhss.mkbankspring.entity.Loan;
import com.emranhss.mkbankspring.service.AccountService;
import com.emranhss.mkbankspring.service.ILoanService;
import com.emranhss.mkbankspring.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanRestController {
//    @Autowired
//    private ILoanService loanService;

    @Autowired
    private LoanService loanService1;

    @Autowired
    private AccountService accountService;

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateEmi(@RequestBody LoanRequestDto dto) {
        try {
            EmiResponseDto res = loanService1.calculateEmi(dto.getLoanAmount(), dto.getDurationInMonths(), dto.getLoanType().name());
            return ResponseEntity.ok(res);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }



    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(
            @RequestBody LoanRequestDto dto,
            @RequestHeader("Authorization") String authHeader,
            Authentication authentication
    ) {


        try {

            // Token extract করা
            String token = authHeader.replace("Bearer ", "");

            Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
            Loan loan = loanService1.applyLoan(accountId, dto,token);

            LoanDto response = new LoanDto();
            response.setId(loan.getId());
            response.setLoanAmount(loan.getLoanAmount());
            response.setEmiAmount(loan.getEmiAmount());
            response.setStatus(loan.getStatus().name());
            response.setLoanType(loan.getLoanType().name());

            // AccountDto
            AccountsDTO accountDto = new AccountsDTO();
            accountDto.setId(loan.getAccount().getId());
            accountDto.setName(loan.getAccount().getName());
            accountDto.setBalance(loan.getAccount().getBalance());
            accountDto.setNid(loan.getAccount().getNid());
            accountDto.setPhoneNumber(loan.getAccount().getPhoneNumber());
            accountDto.setAddress(loan.getAccount().getAddress());
            accountDto.setAccountType(loan.getAccount().getAccountType());
            response.setAccount(accountDto);

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


// This endpoint only fetches pre-fill data for the Loan Apply form.
    @GetMapping("/apply/init")
    public ResponseEntity<LoanDto> getLoanInitData(Authentication authentication) {
        try {
            // 1️⃣ accountId ber kora
            Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
            Accounts account = accountService.findAccountById(accountId);

            // 2️⃣ LoanDto(pre-filled default values)
            LoanDto response = new LoanDto();

            response.setId(null); // এখনো loan create হয়নি, তাই null
            response.setLoanAmount(0); // user input
            response.setEmiAmount(0); // backend calculate করবে
            response.setInterestRate(0); // backend calculate করবে
            response.setStatus("PENDING"); // default
            response.setLoanType(""); // user input

            // 3️⃣ AccountDTO set
            AccountsDTO accountDto = new AccountsDTO();
            accountDto.setId(account.getId());
            accountDto.setName(account.getName());
            accountDto.setBalance(account.getBalance());
            accountDto.setNid(account.getNid());
            accountDto.setPhoneNumber(account.getPhoneNumber());
            accountDto.setAddress(account.getAddress());
            accountDto.setAccountType(account.getAccountType());

            response.setAccount(accountDto);

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }



    /**
     * Apply for loan.
     * Uses authenticated user's accountId (via accountService)
     * POST /api/loans/apply
     */
//    @PostMapping("/apply")
//    public ResponseEntity<?> applyLoan(@RequestBody LoanRequestDto dto, Authentication authentication) {
//        try {
//            // get accountId from authentication (implement accountService.findAccountByEmail)
//            Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
//            Loan loan = loanService.applyLoan(accountId, dto);
//            return ResponseEntity.ok(loan);
//        } catch (Exception ex) {
//            return ResponseEntity.badRequest().body(ex.getMessage());
//        }
//    }


 //Make payment towards a loan
    // Make payment
    @PostMapping("/pay")
    public ResponseEntity<?> payLoan(
            @RequestBody LoanPaymentDto paymentDto,
            @RequestHeader("Authorization") String authHeader,
            Authentication authentication
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
            Loan updated = loanService1.payLoan(accountId, paymentDto, token);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


//    @PostMapping("/pay")
//    public ResponseEntity<?> payLoan(
//            @RequestBody LoanPaymentDto paymentDto,
//            @RequestHeader("Authorization") String authHeader,
//            Authentication authentication) {
//        try {
//            String token = authHeader.replace("Bearer ", "");
//            Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
//            Loan updated = loanService1.payLoan(accountId, paymentDto,token);
//            return ResponseEntity.ok(updated);
//        } catch (Exception ex) {
//            return ResponseEntity.badRequest().body(ex.getMessage());
//        }
//    }


    //----------------------srart Get loan details-----------

    // Fetch a single loan
    @GetMapping("/{id}")
    public ResponseEntity<LoanDto> getLoanById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        LoanDto loanDto = loanService1.getLoanDtoById(id, accountId);
        return ResponseEntity.ok(loanDto);
    }


    //  Total Loan for Admin Dashboard
    @GetMapping("/total")
    public Map<String, BigDecimal> getTotalLoanForAdminDashboard() {
        return loanService1.getTotalLoanForAdminDashboard();
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<LoanDto> getLoanById(
//            @PathVariable Long id,
//            Authentication authentication
//            ) {
//        // logged-in user এর accountId বের করা
//        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
//
//        // service call with ownership check
//        LoanDto loanDto = loanService1.getLoanDtoById(id, accountId);
//
//        return ResponseEntity.ok(loanDto);
//    }

//
//    @GetMapping("/{loanId}")
//    public ResponseEntity<?> getLoan(@PathVariable Long loanId, Authentication authentication) {
//        try {
//            LoanDto loan = loanService1.getLoanById(loanId);
//            // optional: check ownership
//            return ResponseEntity.ok(loan);
//        } catch (Exception ex) {
//            return ResponseEntity.badRequest().body(ex.getMessage());
//        }
//    }
    //-------------end Get loan details-------------



    @GetMapping("/myloans")
    public ResponseEntity<List<LoanDto>> getMyLoans(Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        List<Loan> loans = loanService1.getLoansByAccount(accountId);

        List<LoanDto> loanDtos = loans.stream().map(loan -> {
            //data from loanDTO
            LoanDto dto = new LoanDto();
            dto.setId(loan.getId());
            dto.setLoanAmount(loan.getLoanAmount());
            dto.setInterestRate(loan.getInterestRate());
            dto.setEmiAmount(loan.getEmiAmount());
            dto.setRemainingAmount(loan.getRemainingAmount());
            dto.setTotalAlreadyPaidAmount(loan.getTotalAlreadyPaidAmount());
            dto.setStatus(loan.getStatus().name());
            dto.setLoanType(loan.getLoanType().name());
            dto.setLoanStartDate(loan.getLoanStartDate());
            dto.setLoanMaturityDate(loan.getLoanMaturityDate());



            //from accDTO
            AccountsDTO accDto = new AccountsDTO();
            accDto.setId(loan.getAccount().getId());
            accDto.setName(loan.getAccount().getName());
            accDto.setNid(loan.getAccount().getNid());
            accDto.setBalance(loan.getAccount().getBalance());
            accDto.setAccountType(loan.getAccount().getAccountType());
            accDto.setPhoneNumber(loan.getAccount().getPhoneNumber());
            accDto.setAddress(loan.getAccount().getAddress());
            dto.setAccount(accDto);

            return dto;
        }).toList();

        return ResponseEntity.ok(loanDtos);
    }






    // Account holder pay EMI
//    @PostMapping("pay/{loanId}")
//    public ResponseEntity<Loan> payEMI(@PathVariable Long loanId,
//                                       @RequestParam double amount) {
//        Loan loan = loanService1.payEMI(loanId, amount);
//        return ResponseEntity.ok(loan);
//    }

//
//    // Admin view all pending loans
//    @GetMapping("pending")
//    public ResponseEntity<List<Loan>> getPendingLoans() {
//        List<Loan> loans = loanService.getPendingLoans();
//        return ResponseEntity.ok(loans);
//    }
//
//    // Admin approve a loan
//    @PostMapping("approve/{loanId}")
//    public ResponseEntity<Loan> approveLoan(@PathVariable Long loanId) {
//        Loan loan = loanService.approveLoan(loanId);
//        return ResponseEntity.ok(loan);
//    }
//
//    // Admin reject a loan
//    @PostMapping("reject/{loanId}")
//    public ResponseEntity<Loan> rejectLoan(@PathVariable Long loanId) {
//        Loan loan = loanService.rejectLoan(loanId);
//        return ResponseEntity.ok(loan);
//    }
}
