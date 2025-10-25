package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.dto.EmiResponseDto;
import com.emranhss.mkbankspring.dto.LoanPaymentDto;
import com.emranhss.mkbankspring.dto.LoanRequestDto;
import com.emranhss.mkbankspring.entity.Loan;

public interface ILoanService {

    EmiResponseDto calculateEmi(double loanAmount, int durationInMonths, String loanType);
    Loan applyLoan(Long accountId, LoanRequestDto dto);
    Loan payLoan(Long accountId, LoanPaymentDto paymentDto);
    Loan getLoanById(Long loanId);
}
