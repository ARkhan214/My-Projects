package com.emranhss.mkbankspring.dto;

import com.emranhss.mkbankspring.entity.LoanType;

public class LoanRequestDto {

    private double loanAmount;
    private int durationInMonths;
    private LoanType loanType;


    public LoanRequestDto() {}

    public LoanRequestDto(double loanAmount, int durationInMonths, LoanType loanType) {
        this.loanAmount = loanAmount;
        this.durationInMonths = durationInMonths;
        this.loanType = loanType;
    }

    public double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(double loanAmount) { this.loanAmount = loanAmount; }

    public int getDurationInMonths() { return durationInMonths; }
    public void setDurationInMonths(int durationInMonths) { this.durationInMonths = durationInMonths; }

    public LoanType getLoanType() { return loanType; }
    public void setLoanType(LoanType loanType) { this.loanType = loanType; }

}
