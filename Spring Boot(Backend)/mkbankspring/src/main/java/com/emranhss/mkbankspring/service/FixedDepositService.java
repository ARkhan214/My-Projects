package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.dto.AccountsDTO;
import com.emranhss.mkbankspring.dto.FixedDepositDTO;
import com.emranhss.mkbankspring.dto.TransactionDTO;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.repository.AccountRepository;
import com.emranhss.mkbankspring.repository.FixedDepositRepository;
import com.emranhss.mkbankspring.repository.GLTransactionRepository;
import com.emranhss.mkbankspring.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FixedDepositService {
    @Autowired
    private FixedDepositRepository fdRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
private GLTransactionRepository glTransactionRepository;



    @Transactional
    public FixedDepositDTO createFD(FixedDepositDTO fdDTO, Long accountId, String token) {
        double amount = fdDTO.getDepositAmount();
        int durationMonths = fdDTO.getDurationInMonths();

        if (amount < 50000 || durationMonths < 12 || durationMonths > 120) {
            throw new RuntimeException("Invalid amount or duration");
        }


        Accounts account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        FixedDeposit fd = new FixedDeposit();
        fd.setAccount(account);
        fd.setDepositAmount(amount);
        fd.setDurationInMonths(durationMonths);
        fd.setStartDate(new Date());
        fd.setStatus(FdStatus.ACTIVE);

        // Interest rate
        double interestRate = calculateInterestRate(amount, durationMonths);
        fd.setInterestRate(interestRate);
        fd.setPrematureInterestRate(3.0);

        // Maturity
        Date maturityDate = new Date(fd.getStartDate().getTime() + (long) durationMonths * 30L * 24 * 60 * 60 * 1000);
        fd.setMaturityDate(maturityDate);
        fd.setMaturityAmount(amount + (amount * interestRate / 100 * durationMonths / 12));

        // Update account balance
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        // Save FD
        fd = fdRepository.save(fd);

        // Transaction
        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setAmount(amount);
        txn.setTransactionTime(new Date());
        txn.setType(TransactionType.FIXED_DEPOSIT);
        txn.setDescription("FD created");
        txn.setToken(token);
        transactionRepository.save(txn);

        // Create GL transaction for Open FD
        GLTransaction glTxn = new GLTransaction();
        glTxn.setAmount(amount);
        glTxn.setType(GLType.FD_OPEN);
        glTxn.setDescription("FD Open Abd FD ID is: "+fd.getId());
        glTxn.setReferenceId(fd.getId());
        glTxn.setReferenceType("FD");
        glTransactionRepository.save(glTxn);


        return mapToDTO(fd);
    }


//------------ST sob GL View By reference Type
public List<GLTransaction> getFdTransactions(Long fdId) {
    return glTransactionRepository.findByReferenceTypeAndReferenceId("FD", fdId);
}
    //-----------End



    // FD create
//    @Transactional
//    public FixedDepositDTO createFD(Long accountId, double amount, int durationMonths) {
//        if(amount < 50000 || durationMonths > 120) {
//            throw new RuntimeException("Invalid amount or duration");
//        }
//
//        Accounts account = accountRepository.findById(accountId)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//        if(account.getBalance() < amount) {
//            throw new RuntimeException("Insufficient balance");
//        }
//
//        FixedDeposit fd = new FixedDeposit();
//        fd.setAccount(account);
//        fd.setDepositAmount(amount);
//        fd.setDurationInMonths(durationMonths);
//        fd.setStartDate(new Date());
//        fd.setStatus(FdStatus.ACTIVE);
//
//        // Interest rate
//        double interestRate = calculateInterestRate(amount, durationMonths);
//        fd.setInterestRate(interestRate);
//        fd.setPrematureInterestRate(3.0);
//
//        // Maturity
//        Date maturityDate = new Date(fd.getStartDate().getTime() + (long)durationMonths * 30L * 24 * 60 * 60 * 1000);
//        fd.setMaturityDate(maturityDate);
//        fd.setMaturityAmount(amount + (amount * interestRate / 100 * durationMonths / 12));
//
//        // Update account balance
//        account.setBalance(account.getBalance() - amount);
//        accountRepository.save(account);
//
//        // Save FD
//        fd = fdRepository.save(fd);
//
//        // Transaction
//        Transaction txn = new Transaction();
//        txn.setAccount(account);
//        txn.setAmount(amount);
//        txn.setTransactionTime(new Date());
//        txn.setType(TransactionType.FIXED_DEPOSIT);
//        txn.setDescription("FD created");
//        transactionRepository.save(txn);
//
//        return mapToDTO(fd);
//    }

    private double calculateInterestRate(double amount, int durationMonths) {
        if(amount >= 100000) {
            if(durationMonths >= 60) return 12.0;
            if(durationMonths >= 36) return 11.0;
            if(durationMonths >= 12) return 10.0;
        } else {
            if(durationMonths >= 12) return 7.0;
        }
        return 5.0;
    }

    public List<FixedDepositDTO> getFDsByAccount(Long accountId) {
        return fdRepository.findByAccountId(accountId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

//    @Transactional
//    public FixedDepositDTO closeFD(Long fdId, Long accountId) {
//        FixedDeposit fd = fdRepository.findByIdAndAccountId(fdId, accountId)
//                .orElseThrow(() -> new RuntimeException("FD not found"));
//
//        Accounts account = fd.getAccount();
//        double finalAmount = fd.getMaturityAmount();
//
//        if(fd.getMaturityDate().after(new Date())) {
//            finalAmount = fd.getDepositAmount() + (fd.getDepositAmount() * fd.getPrematureInterestRate() / 100 * fd.getDurationInMonths() / 12);
//        }
//
//        account.setBalance(account.getBalance() + finalAmount);
//        accountRepository.save(account);
//
//        fd.setStatus(FdStatus.CLOSED);
//        fd.setPrematureWithdrawalDate(new Date());
//        fd.setfDLustUpdatedAt(new Date());
//        fdRepository.save(fd);
//
//        Transaction txn = new Transaction();
//        txn.setAccount(account);
//        txn.setAmount(fd.getDepositAmount());
//        txn.setTransactionTime(new Date());
//        txn.setType(TransactionType.FIXED_DEPOSIT);
//        txn.setDescription("FD closed");
//        transactionRepository.save(txn);
//
//        return mapToDTO(fd);
//    }

//-----------------------
@Transactional
public FixedDepositDTO closeFD(Long fdId, Long accountId,String token) {
    // Find FD by ID and Account ID
    FixedDeposit fd = fdRepository.findByIdAndAccountId(fdId, accountId)
            .orElseThrow(() -> new RuntimeException("FD not found"));

    Accounts account = fd.getAccount();
    double finalAmount = fd.getDepositAmount(); // Default: principal only
    double penaltyAmount = 0.0;

    Date today = new Date();
    long diffInMillis = today.getTime() - fd.getStartDate().getTime();
    long diffInDays = diffInMillis / (1000 * 60 * 60 * 24);




    // Update FD status
    fd.setStatus(FdStatus.CLOSED);
    fd.setPrematureWithdrawalDate(today);
    fd.setfDLustUpdatedAt(today);
    fdRepository.save(fd);

    // Record transaction
    Transaction txn = new Transaction();
    txn.setAccount(account);
    txn.setAmount(fd.getDepositAmount());
    txn.setTransactionTime(today);
    txn.setType(TransactionType.FIXED_DEPOSIT_CLOSED);
    txn.setDescription("FD closed");
    txn.setToken(token);
    transactionRepository.save(txn);
    //--------
    if (diffInDays < 30) {
        // FD closed within 30 days → 0% interest + 100 penalty
        penaltyAmount = 100.0;

        // Create GL transaction for penalty
        GLTransaction glTxn = new GLTransaction();
        glTxn.setAmount(penaltyAmount);
        glTxn.setType(GLType.FD_CLOSED_PENALTY);
        glTxn.setDescription("FD closed within 30 days, penalty applied and The penalty FD ID is: "+fd.getId());
        glTxn.setReferenceId(fd.getId());
        glTxn.setReferenceType("FD");
        glTransactionRepository.save(glTxn);

        GLTransaction glTxn2 = new GLTransaction();
        glTxn2.setAmount(-fd.getDepositAmount());  // minus because money going out
        glTxn2.setType(GLType.FD_CLOSED);
        glTxn2.setDescription("FD Closed and FD ID is: " + fd.getId());
        glTxn2.setReferenceId(fd.getId());
        glTxn2.setReferenceType("FD");
        glTransactionRepository.save(glTxn2);

        Transaction txn1 = new Transaction();
        txn1.setAccount(account);
        txn1.setAmount(penaltyAmount);
        txn1.setTransactionTime(today);
        txn1.setType(TransactionType.FD_CLOSED_PENALTY);
        txn1.setDescription("FD closed With Panalty.Panalty Fee is "+penaltyAmount+" taka");
        txn1.setToken(token);
        transactionRepository.save(txn1);


    } else if (fd.getMaturityDate().after(today)) {
        // Premature withdrawal after 30 days but before maturity
        finalAmount = fd.getDepositAmount() +
                (fd.getDepositAmount() * fd.getPrematureInterestRate() / 100 * fd.getDurationInMonths() / 12);
    } else {
        // FD matured normally
        finalAmount = fd.getMaturityAmount();
    }

    // Update account balance (subtract penalty if any)
    account.setBalance(account.getBalance() + finalAmount - penaltyAmount);
    //--------
    accountRepository.save(account);


    // Return DTO
    return mapToDTO(fd);
}




    //-------------------
    private FixedDepositDTO mapToDTO(FixedDeposit fd) {
        FixedDepositDTO dto = new FixedDepositDTO();
        dto.setId(fd.getId());
        dto.setDepositAmount(fd.getDepositAmount());
        dto.setDurationInMonths(fd.getDurationInMonths());
        dto.setInterestRate(fd.getInterestRate());
        dto.setPrematureInterestRate(fd.getPrematureInterestRate());
        dto.setStartDate(fd.getStartDate());
        dto.setMaturityDate(fd.getMaturityDate());
        dto.setMaturityAmount(fd.getMaturityAmount());
        dto.setPrematureWithdrawalDate(fd.getPrematureWithdrawalDate());
        dto.setStatus(fd.getStatus().name());
        dto.setLastUpdatedAt(fd.getfDLustUpdatedAt());

        Accounts account = fd.getAccount();
        AccountsDTO accountDTO = new AccountsDTO();
        accountDTO.setId(account.getId());
        accountDTO.setName(account.getName());
        accountDTO.setAccountActiveStatus(account.isAccountActiveStatus());
        accountDTO.setAccountType(account.getAccountType());
        accountDTO.setBalance(account.getBalance());
        accountDTO.setNid(account.getNid());
        accountDTO.setPhoneNumber(account.getPhoneNumber());
        accountDTO.setAddress(account.getAddress());
        accountDTO.setPhoto(account.getPhoto());
        accountDTO.setDateOfBirth(account.getDateOfBirth());
        accountDTO.setAccountOpeningDate(account.getAccountOpeningDate());
        accountDTO.setAccountClosingDate(account.getAccountClosingDate());
        dto.setAccount(accountDTO);
        return dto;
    }

//For get ALl FD
    public List<FixedDeposit> getFdByAccount(Long accountId) {
        return fdRepository.findByAccountId(accountId);
    }
}
