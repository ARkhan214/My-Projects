package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.dto.*;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.repository.AccountRepository;
import com.emranhss.mkbankspring.repository.LoanRepository;
import com.emranhss.mkbankspring.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LoanService{
    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AccountService accountService;
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;



    //loan interest rate calculate korar jonno
    private double getFixedInterestRate(LoanType loanType) {
        if (loanType == null) return 10.0; // default
        switch (loanType) {
            case PERSONAL: return 12.0;
            case HOME: return 8.0;
            case CAR: return 9.0;
            case EDUCATION: return 6.0;
            case BUSINESS: return 14.0;
            default: return 10.0;
        }
    }

    //loan calculate korar jonno
    public EmiResponseDto calculateEmi(double loanAmount, int durationInMonths, String loanTypeStr) {
        if (durationInMonths <= 0) throw new IllegalArgumentException("Duration must be > 0");
        if (durationInMonths > 60) throw new IllegalArgumentException("Duration cannot exceed 60 months");

        LoanType loanType = LoanType.valueOf(loanTypeStr);
        double interestRate = getFixedInterestRate(loanType);

        // Simple interest yearly on principal as user requested
        double totalInterest = loanAmount * (interestRate / 100.0);
        double totalPayable = loanAmount + totalInterest;
        double emi = totalPayable / durationInMonths;

        return new EmiResponseDto(emi, totalPayable, interestRate);
    }

    //Loan with approval   start---------------------------failed code
//    @Override
//    @Transactional
//    public Loan applyLoan(Long accountId, LoanRequestDto dto) {
//        // validation
//                if (dto.getDurationInMonths() <= 0 || dto.getDurationInMonths() > 60)
//            throw new IllegalArgumentException("Duration must be between 1 and 60 months");
//        if (dto.getLoanAmount() <= 0 || dto.getLoanAmount() > 99999999) {
//            throw new IllegalArgumentException("Loan amount must be > 0 and <= 99,999,999");
//        }
//
//        Accounts account = accountRepository.findById(accountId)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//                LoanType loanType = dto.getLoanType();
//        double interestRate = getFixedInterestRate(loanType);
//
//        double totalInterest = dto.getLoanAmount() * (interestRate / 100.0);
//        double totalPayable = dto.getLoanAmount() + totalInterest;
//        double emi = totalPayable / dto.getDurationInMonths();
//
//
//        // Create Loan
//        Loan loan = new Loan();
//        loan.setAccount(account);
//        loan.setLoanAmount(dto.getLoanAmount());
//        loan.setInterestRate(interestRate);
//        loan.setDurationInMonths(dto.getDurationInMonths());
//        loan.setEmiAmount(emi);
//        loan.setLoanType(loanType);
//        loan.setStatus(LoanStatus.PENDING);
//        Date start = new Date();
//        loan.setLoanStartDate(start);
//        loan.setLoanMaturityDate(addMonths(start, dto.getDurationInMonths()));
//        loan.setTotalAlreadyPaidAmount(0.0);
//        loan.setRemainingAmount(totalPayable);
//        loan.setUpdatedAt(new Date());
//
//        return loanRepository.save(loan);
//
//    }
//
//
//
//    public List<LoanDto> getPendingLoanDTOs() {
//        List<Loan> loans = loanRepository.findByStatus(LoanStatus.PENDING);
//
//        return loans.stream().map(loan -> {
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
//            AccountsDTO accountDTO = new AccountsDTO();
//            accountDTO.setId(loan.getAccount().getId());
//            accountDTO.setName(loan.getAccount().getName());
//            accountDTO.setBalance(loan.getAccount().getBalance());
//            dto.setAccount(accountDTO);
//
//            return dto;
//        }).collect(Collectors.toList());
//    }
//
//
//
//
//
//    @Transactional
//    public Loan approveLoan(Long loanId) {
//        Loan loan = loanRepository.findById(loanId)
//                .orElseThrow(() -> new RuntimeException("Loan not found"));
//
//        if (loan.getStatus() != LoanStatus.PENDING) {
//            throw new IllegalStateException("Loan is not in pending state");
//        }
//
//        Accounts account = loan.getAccount();
//
//        // ✅ Loan Active
//        loan.setStatus(LoanStatus.ACTIVE);
//
//        // ✅ Account balance update
//        account.setBalance(account.getBalance() + loan.getLoanAmount());
//
//        // ✅ Transaction add
//        Transaction txn = new Transaction();
//        txn.setAccount(account);
//        txn.setAmount(loan.getLoanAmount());
//        txn.setType(TransactionType.DEPOSIT);
//        txn.setDescription("Loan Disbursed");
//        txn.setTransactionTime(new Date());
//
//        transactionRepository.save(txn);
//
//        return loanRepository.save(loan);
//    }
//
//
//
//    @Transactional
//    public Loan rejectLoan(Long loanId) {
//        Loan loan = loanRepository.findById(loanId)
//                .orElseThrow(() -> new RuntimeException("Loan not found"));
//
//        if (loan.getStatus() != LoanStatus.PENDING) {
//            throw new IllegalStateException("Loan is not in pending state");
//        }
//
//        loan.setStatus(LoanStatus.REJECTED);
//        return loanRepository.save(loan);
//    }
    //Loan with approval   end---------------------------failed code



//loan apply korar jonno(main code and its working)
//    public Loan applyLoan(Long accountId, LoanRequestDto dto,String token) {
//        if (dto.getDurationInMonths() <= 0 || dto.getDurationInMonths() > 60)
//            throw new IllegalArgumentException("Duration must be between 1 and 60 months");
//        if (dto.getLoanAmount() <= 0 || dto.getLoanAmount() > 99999999)
//            throw new IllegalArgumentException("Loan amount must be > 0 and <= 99,999,999");
//
//        Accounts account = accountRepository.findById(accountId)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//        LoanType loanType = dto.getLoanType();
//        double interestRate = getFixedInterestRate(loanType);
//
//        double totalInterest = dto.getLoanAmount() * (interestRate / 100.0);
//        double totalPayable = dto.getLoanAmount() + totalInterest;
//        double emi = totalPayable / dto.getDurationInMonths();
//
//        // Update account balance
//        account.setBalance(account.getBalance() + dto.getLoanAmount());
//        accountRepository.save(account);
//
//        // Create Loan
//        Loan loan = new Loan();
//        loan.setAccount(account);
//        loan.setLoanAmount(dto.getLoanAmount());
//        loan.setInterestRate(interestRate);
//        loan.setDurationInMonths(dto.getDurationInMonths());
//        loan.setEmiAmount(emi);
//        loan.setLoanType(loanType);
//        loan.setStatus(LoanStatus.ACTIVE);
//        Date start = new Date();
//        loan.setLoanStartDate(start);
//        loan.setLoanMaturityDate(addMonths(start, dto.getDurationInMonths()));
//        loan.setTotalAlreadyPaidAmount(0.0);
//        loan.setRemainingAmount(totalPayable);
//        loan.setUpdatedAt(new Date());
//
//        Loan savedLoan = loanRepository.save(loan);
//
//        // Create Transaction for Loan Credit
//        Transaction txn = new Transaction();
//        txn.setAccount(account);
//        txn.setType(TransactionType.DEPOSIT); // Account receives money
//        txn.setTransactionTime(new Date());
//        txn.setAmount(dto.getLoanAmount());
//        txn.setDescription("Loan disbursed: Loan ID " + savedLoan.getId());
//        txn.setReceiverAccount(null); // Receiver not needed for loan credit
//        txn.setToken(token);
//        transactionRepository.save(txn);
//
//        return savedLoan;
//    }








    @Transactional
    public Loan applyLoan(Long accountId, LoanRequestDto dto,String token) {
        if (dto.getDurationInMonths() <= 0) throw new IllegalArgumentException("Duration must be > 0");
        if (dto.getDurationInMonths() > 60) throw new IllegalArgumentException("Duration cannot exceed 60 months");
        if (dto.getLoanAmount() <= 0 || dto.getLoanAmount() > 99999999) {
            throw new IllegalArgumentException("Loan amount must be > 0 and <= 99,999,999");
        }


        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        LoanType loanType = dto.getLoanType();
        double interestRate = getFixedInterestRate(loanType);

        double totalInterest = dto.getLoanAmount() * (interestRate / 100.0);
        double totalPayable = dto.getLoanAmount() + totalInterest;
        double emi = totalPayable / dto.getDurationInMonths();

        Loan loan = new Loan();
        loan.setAccount(account);
        loan.setLoanAmount(dto.getLoanAmount());
        loan.setInterestRate(interestRate);
        loan.setDurationInMonths(dto.getDurationInMonths());
        loan.setEmiAmount(emi);
        loan.setLoanType(loanType);
        loan.setStatus(LoanStatus.PENDING);
        Date start = new Date();
        loan.setLoanStartDate(start);
        loan.setLoanMaturityDate(addMonths(start, dto.getDurationInMonths()));
        loan.setTotalAlreadyPaidAmount(0.0);
        loan.setRemainingAmount(totalPayable);
        loan.setUpdatedAt(new Date());

        return loanRepository.save(loan);
    }




//----------------------------

    //loan pay korar jonno
    public Loan payLoan(Long accountId, LoanPaymentDto paymentDto,String token) {
        if (paymentDto.getAmount() <= 0) throw new IllegalArgumentException("Payment amount must be > 0");

        Loan loan = loanRepository.findById(paymentDto.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == LoanStatus.PENDING) {
            throw new RuntimeException("This loan is Pending. No payment allowed");
        }

        if (loan.getStatus() == LoanStatus.CLOSED) {
            throw new RuntimeException("This loan is already closed. No further payments allowed.");
        }

        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!loan.getAccount().getId().equals(accountId)) {
            throw new RuntimeException("Loan does not belong to this account");
        }

        double payAmount = paymentDto.getAmount();

        if (payAmount > loan.getRemainingAmount()) {
            throw new RuntimeException("Payment amount must be less than loan remaining amount");
        }

        // Check sufficient balance
        if (account.getBalance() < payAmount) {
            throw new RuntimeException("Insufficient account balance");
        }

        // Deduct from account
        account.setBalance(account.getBalance() - payAmount);
        accountRepository.save(account); // persist

        // Update loan
        double newPaid = loan.getTotalAlreadyPaidAmount() + payAmount;
        double newRemaining = loan.getRemainingAmount() - payAmount;
        loan.setTotalAlreadyPaidAmount(newPaid);
        loan.setRemainingAmount(Math.max(0.0, newRemaining));
        loan.setLastPaymentDate(new Date());
        loan.setUpdatedAt(new Date());

        if (loan.getRemainingAmount() <= 0.0) {
            loan.setStatus(LoanStatus.CLOSED);
        } else {
            // if it was PENDING and first payment done, set ACTIVE
            if (loan.getStatus() == LoanStatus.PENDING) {
                loan.setStatus(LoanStatus.ACTIVE);
            }
        }

        // Create Transaction for Loan Credit
        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType(TransactionType.TRANSFER); // Account receives money
        txn.setTransactionTime(new Date());
        txn.setAmount(paymentDto.getAmount());
        txn.setDescription("Loan Installment payment "+ loan.getId());
        txn.setToken(token);
        txn.setReceiverAccount(null); // Receiver not needed for loan credit
        transactionRepository.save(txn);

        return loanRepository.save(loan);
    }

//-------------start---------------------

    // Fetch all loans for a given account
    public List<LoanDto> getLoansByAccountId(Long accountId) {
        List<Loan> loans = loanRepository.findByAccountId(accountId);

        return loans.stream().map(loan -> {
            Accounts account = loan.getAccount();
            AccountsDTO accountDTO = null;
            if (account != null) {
                accountDTO = new AccountsDTO(
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

            return new LoanDto(
                    loan.getId(),
                    loan.getLoanAmount(),
                    loan.getEmiAmount(),
                    loan.getInterestRate(),
                    loan.getStatus().toString(),
                    loan.getLoanType().toString(),
                    loan.getLoanStartDate(),
                    loan.getLoanMaturityDate(),
                    loan.getTotalAlreadyPaidAmount(),
                    loan.getRemainingAmount(),
                    loan.getPenaltyRate(),
                    loan.getLastPaymentDate(),
                    loan.getUpdatedAt(),
                    accountDTO
            );
        }).collect(Collectors.toList());
    }


    public LoanDto getLoanDtoById(Long loanId,Long accountId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // Ownership check
        if (!loan.getAccount().getId().equals(accountId)) {
            throw new RuntimeException("You are not authorized to view this loan");
        }

        // Account entity থেকে AccountsDTO বানানো
        Accounts account = loan.getAccount();
        AccountsDTO accountDTO = null;

        if (account != null) {
            accountDTO = new AccountsDTO(
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

        // LoanDto বানানো
        return new LoanDto(
                loan.getId(),
                loan.getLoanAmount(),
                loan.getEmiAmount(),
                loan.getInterestRate(),
                loan.getStatus().toString(),
                loan.getLoanType().toString(),
                loan.getLoanStartDate(),
                loan.getLoanMaturityDate(),
                loan.getTotalAlreadyPaidAmount(),
                loan.getRemainingAmount(),
                loan.getPenaltyRate(),
                loan.getLastPaymentDate(),
                loan.getUpdatedAt(),
                accountDTO
        );
    }


//    public LoanDto getLoanById(Long loanId) {
//        Loan loan = loanRepository.findById(loanId)
//                .orElseThrow(() -> new RuntimeException("Loan not found with ID: " + loanId));
//
//        // 👉 Convert Loan → LoanDto
//        return mapToDto(loan);
//    }
//
//    private LoanDto mapToDto(Loan loan) {
//        Accounts account = loan.getAccount();
//
//        // Account → AccountsDTO
//        AccountsDTO accountDto = new AccountsDTO(
//                account.getId(),
//                account.getName(),
//                account.getBalance(),
//                account.getAccountType(),
//                account.getNid(),
//                account.getPhoneNumber(),
//                account.getAddress(),
//                account.getPhoto()
//        );
//
//        // Loan → LoanDto
//        LoanDto dto = new LoanDto(
//                loan.getId(),
//                loan.getLoanAmount(),
//                loan.getEmiAmount(),
//                loan.getInterestRate(),
//                loan.getStatus().toString(),  // Enum to → String
//                loan.getLoanType().toString(),
//                loan.getLoanStartDate(),
//                loan.getLoanMaturityDate(),
//                loan.getTotalAlreadyPaidAmount(),
//                loan.getRemainingAmount(),
//                loan.getPenaltyRate(),
//                loan.getLastPaymentDate(),
//                loan.getUpdatedAt(),
//                accountDto
//        );
//
//        return dto;
//    }



    //----------------------------end----------------




    //login kore account holder eta diea tar sob loan view kortese
    public List<Loan> getLoansByAccount(Long accountId) {
        return loanRepository.findByAccountId(accountId);
    }


    // helper to add months
    private Date addMonths(Date date, int months) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, months);
        return cal.getTime();
    }



    // Account holder apply loan
//    public Loan applyLoan(Long accountId, Loan loan) {
//        Accounts account = accountService.findById(accountId)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//        loan.setAccount(account);
//        loan.setStatus(LoanStatus.PENDING);
//        loan.setLoanStartDate(new Date());
//
//        // EMI Calculation
//        double principal = loan.getLoanAmount();
//        double monthlyRate = loan.getInterestRate() / 12 / 100;
//        int months = loan.getDurationInMonths();
//        double emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
//                (Math.pow(1 + monthlyRate, months) - 1);
//        loan.setEmiAmount(Math.round(emi * 100.0) / 100.0);
//
//        // Total and remaining amount
//        loan.setTotalAlreadyPaidAmount(0);
//        loan.setRemainingAmount(loan.getEmiAmount() * months);
//
//        // Maturity Date
//        Calendar cal = Calendar.getInstance();
//        cal.setTime(new Date());
//        cal.add(Calendar.MONTH, months);
//        loan.setLoanMaturityDate(cal.getTime());
//
//        loan.setUpdatedAt(new Date());
//        return loanRepository.save(loan);
//    }
//
//    // Account holder view own loans


//
//    // Admin view pending loans
//    public List<Loan> getPendingLoans() {
//        return loanRepository.findByStatus(LoanStatus.PENDING);
//    }
//
//    // Admin approve loan
//    public Loan approveLoan(Long loanId) {
//        Loan loan = loanRepository.findById(loanId)
//                .orElseThrow(() -> new RuntimeException("Loan not found"));
//        loan.setStatus(LoanStatus.ACTIVE);
//        loan.setUpdatedAt(new Date());
//        return loanRepository.save(loan);
//    }
//
//    // Admin reject loan
//    public Loan rejectLoan(Long loanId) {
//        Loan loan = loanRepository.findById(loanId)
//                .orElseThrow(() -> new RuntimeException("Loan not found"));
//        loan.setStatus(LoanStatus.CLOSED);
//        loan.setUpdatedAt(new Date());
//        return loanRepository.save(loan);
//    }
//
//    // Payment (Account holder pays EMI)
//    public Loan payEMI(Long loanId, double amount) {
//        Loan loan = loanRepository.findById(loanId)
//                .orElseThrow(() -> new RuntimeException("Loan not found"));
//
//        // Update paid amount
//        double totalPaid = loan.getTotalAlreadyPaidAmount() + amount;
//        loan.setTotalAlreadyPaidAmount(totalPaid);
//
//        // Update remaining amount
//        double remaining = (loan.getEmiAmount() * loan.getDurationInMonths()) - totalPaid;
//        loan.setRemainingAmount(Math.max(0, remaining));
//
//        // Update last payment date
//        loan.setLastPaymentDate(new Date());
//        loan.setUpdatedAt(new Date());
//
//        // If fully paid, close loan
//        if (remaining <= 0) {
//            loan.setStatus(LoanStatus.CLOSED);
//        }
//
//        return loanRepository.save(loan);
//    }


    public Map<String, BigDecimal> getTotalLoanForAdminDashboard() {
        List<Loan> loans = loanRepository.findAll();

        BigDecimal totalLoan = BigDecimal.ZERO;

        for (Loan loan : loans) {
            // loanAmount is double → convert to BigDecimal
            totalLoan = totalLoan.add(BigDecimal.valueOf(loan.getLoanAmount()));
        }

        Map<String, BigDecimal> response = new HashMap<>();
        response.put("totalLoan", totalLoan);

        return response;
    }



}
