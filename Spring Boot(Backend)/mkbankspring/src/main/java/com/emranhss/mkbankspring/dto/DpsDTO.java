package com.emranhss.mkbankspring.dto;

import com.emranhss.mkbankspring.entity.DpsStatus;

import java.util.Date;

public class DpsDTO {
    private Long id;
    private  Long accountId;
    private String accountName;
    private double monthlyAmount;
    private int termMonths;
    private Date startDate;
    private Date nextDebitDate;
    private DpsStatus status;
    private double totalDeposited;
    private int missedCount;
    private int monthsPaid;
    private double annualInterestRate;
    private double maturityAmount;

    public DpsDTO() {
    }

    public DpsDTO(Long id, Long accountId, String accountName, double monthlyAmount, int termMonths, Date startDate, Date nextDebitDate, DpsStatus status, double totalDeposited, int missedCount, int monthsPaid, double annualInterestRate, double maturityAmount) {
        this.id = id;
        this.accountId = accountId;
        this.accountName = accountName;
        this.monthlyAmount = monthlyAmount;
        this.termMonths = termMonths;
        this.startDate = startDate;
        this.nextDebitDate = nextDebitDate;
        this.status = status;
        this.totalDeposited = totalDeposited;
        this.missedCount = missedCount;
        this.monthsPaid = monthsPaid;
        this.annualInterestRate = annualInterestRate;
        this.maturityAmount = maturityAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public double getMonthlyAmount() {
        return monthlyAmount;
    }

    public void setMonthlyAmount(double monthlyAmount) {
        this.monthlyAmount = monthlyAmount;
    }

    public int getTermMonths() {
        return termMonths;
    }

    public void setTermMonths(int termMonths) {
        this.termMonths = termMonths;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getNextDebitDate() {
        return nextDebitDate;
    }

    public void setNextDebitDate(Date nextDebitDate) {
        this.nextDebitDate = nextDebitDate;
    }

    public DpsStatus getStatus() {
        return status;
    }

    public void setStatus(DpsStatus status) {
        this.status = status;
    }

    public double getTotalDeposited() {
        return totalDeposited;
    }

    public void setTotalDeposited(double totalDeposited) {
        this.totalDeposited = totalDeposited;
    }

    public int getMissedCount() {
        return missedCount;
    }

    public void setMissedCount(int missedCount) {
        this.missedCount = missedCount;
    }

    public int getMonthsPaid() {
        return monthsPaid;
    }

    public void setMonthsPaid(int monthsPaid) {
        this.monthsPaid = monthsPaid;
    }

    public double getAnnualInterestRate() {
        return annualInterestRate;
    }

    public void setAnnualInterestRate(double annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }
}
