package com.emranhss.mkbankspring.dto;

import java.util.Date;

public class LoanDto {

    private Long id;
    private double loanAmount;
    private double emiAmount;
    private double interestRate;
    private String status;
    private String loanType;
    private Date loanStartDate;
    private Date loanMaturityDate;
    private double totalAlreadyPaidAmount;
    private double remainingAmount;
    private double penaltyRate;
    private Date lastPaymentDate;
    private Date updatedAt;
    private AccountsDTO account; // এখানে DTO use করলাম

    public LoanDto() {
    }

    public LoanDto(Long id, double loanAmount, double emiAmount, double interestRate, String status, String loanType, Date loanStartDate, Date loanMaturityDate, double totalAlreadyPaidAmount, double remainingAmount, double penaltyRate, Date lastPaymentDate, Date updatedAt, AccountsDTO account) {
        this.id = id;
        this.loanAmount = loanAmount;
        this.emiAmount = emiAmount;
        this.interestRate = interestRate;
        this.status = status;
        this.loanType = loanType;
        this.loanStartDate = loanStartDate;
        this.loanMaturityDate = loanMaturityDate;
        this.totalAlreadyPaidAmount = totalAlreadyPaidAmount;
        this.remainingAmount = remainingAmount;
        this.penaltyRate = penaltyRate;
        this.lastPaymentDate = lastPaymentDate;
        this.updatedAt = updatedAt;
        this.account = account;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public double getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(double emiAmount) {
        this.emiAmount = emiAmount;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Date getLoanStartDate() {
        return loanStartDate;
    }

    public void setLoanStartDate(Date loanStartDate) {
        this.loanStartDate = loanStartDate;
    }

    public Date getLoanMaturityDate() {
        return loanMaturityDate;
    }

    public void setLoanMaturityDate(Date loanMaturityDate) {
        this.loanMaturityDate = loanMaturityDate;
    }

    public double getTotalAlreadyPaidAmount() {
        return totalAlreadyPaidAmount;
    }

    public void setTotalAlreadyPaidAmount(double totalAlreadyPaidAmount) {
        this.totalAlreadyPaidAmount = totalAlreadyPaidAmount;
    }

    public double getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(double remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getPenaltyRate() {
        return penaltyRate;
    }

    public void setPenaltyRate(double penaltyRate) {
        this.penaltyRate = penaltyRate;
    }

    public Date getLastPaymentDate() {
        return lastPaymentDate;
    }

    public void setLastPaymentDate(Date lastPaymentDate) {
        this.lastPaymentDate = lastPaymentDate;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public AccountsDTO getAccount() {
        return account;
    }

    public void setAccount(AccountsDTO account) {
        this.account = account;
    }
}
