package com.emranhss.mkbankspring.dto;

public class LoanPaymentDto {

    private Long loanId;
    private double amount; // amount user pays (monthly payment or partial)

    public LoanPaymentDto() {}

    public LoanPaymentDto(Long loanId, double amount) {
        this.loanId = loanId;
        this.amount = amount;
    }

    public Long getLoanId() { return loanId; }
    public void setLoanId(Long loanId) { this.loanId = loanId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}
