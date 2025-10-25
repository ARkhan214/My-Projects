package com.emranhss.mkbankspring.restcontroller;

import com.emranhss.mkbankspring.dto.AccountsDTO;
import com.emranhss.mkbankspring.dto.FixedDepositDTO;
import com.emranhss.mkbankspring.dto.LoanDto;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.repository.AccountRepository;
import com.emranhss.mkbankspring.repository.UserRepository;
import com.emranhss.mkbankspring.service.AccountService;
import com.emranhss.mkbankspring.service.FixedDepositService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fd")
public class FixedDepositController {
    @Autowired
    private FixedDepositService fdService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/create")
    public FixedDepositDTO createFD(
            @RequestBody FixedDepositDTO fdDTO,
            Authentication authentication) {

        String token = (String) authentication.getCredentials(); // raw JWT
        String username = authentication.getName();

        User u = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + username));

        Accounts sender = accountRepository.findAccountByUser(u)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));

        return fdService.createFD(fdDTO, sender.getId(), token);
    }

    //--------------
    @GetMapping("/{fdId}/transactions")
    public List<GLTransaction> getFdTransactions(@PathVariable Long fdId) {
        return fdService.getFdTransactions(fdId);
    }
    //-------------


//    @PostMapping("/create")
//    public FixedDepositDTO createFD(@RequestParam double amount,
//                                    @RequestParam int durationMonths,
//                                    HttpServletRequest request) {
//        Long accountId = (Long) request.getAttribute("accountId");
//        return fdService.createFD(accountId, amount, durationMonths);
//    }

//    @GetMapping("/my-fds")
//    public List<FixedDepositDTO> getMyFDs(HttpServletRequest request) {
//        Long accountId = (Long) request.getAttribute("accountId");
//        return fdService.getFDsByAccount(accountId);
//    }

    @GetMapping("/my-fds")
    public ResponseEntity<List<FixedDepositDTO>> getMyFd(Authentication authentication) {
        Long accountId = accountService.findAccountByEmail(authentication.getName()).getId();
        List<FixedDeposit> fds = fdService.getFdByAccount(accountId);

        List<FixedDepositDTO> fdDtos  = fds.stream().map(fd -> {
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
            dto.setStatus(fd.getStatus() != null ? fd.getStatus().name() : null);
            dto.setLastUpdatedAt(fd.getfDLustUpdatedAt());

            // account DTO mapping
            AccountsDTO accDto = new AccountsDTO();
            accDto.setId(fd.getAccount().getId());
            accDto.setName(fd.getAccount().getName());
            accDto.setNid(fd.getAccount().getNid());
            accDto.setBalance(fd.getAccount().getBalance());
            accDto.setAccountType(fd.getAccount().getAccountType());
            accDto.setPhoneNumber(fd.getAccount().getPhoneNumber());
            accDto.setAddress(fd.getAccount().getAddress());

            dto.setAccount(accDto);

            return dto;
        }).toList();

        return ResponseEntity.ok(fdDtos);
    }







    @PostMapping("/close/{fdId}/{accountId}")
    public FixedDepositDTO closeFD(
            @PathVariable Long fdId,
            @PathVariable Long accountId,
            Authentication authentication
    ) {
        String token = (String) authentication.getCredentials(); // raw JWT
        System.out.println("FD ID: " + fdId + ", Account ID: " + accountId);
        return fdService.closeFD(fdId, accountId,token);
    }


}
