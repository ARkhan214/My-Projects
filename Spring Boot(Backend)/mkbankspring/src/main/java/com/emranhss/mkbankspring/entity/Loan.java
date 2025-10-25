package com.emranhss.mkbankspring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Account holder of this loan
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Accounts account;

    private double loanAmount;

    private double interestRate;

    // Duration of loan in months
    private int durationInMonths;

    // Monthly installment (EMI)
    private double emiAmount;

    @Enumerated(EnumType.STRING)
    private LoanType loanType;

    @Enumerated(EnumType.STRING)
    private LoanStatus status = LoanStatus.ACTIVE;

    @Temporal(TemporalType.DATE)
    private Date loanStartDate;

    // Loan maturity date
    @Temporal(TemporalType.DATE)
    private Date loanMaturityDate;

    private double totalAlreadyPaidAmount;
    // Remaining amount to be paid
    private double remainingAmount;

    // Penalty rate for late payment or default (optional)
    private double penaltyRate;

    // Date when last payment was made
    @Temporal(TemporalType.DATE)
    private Date lastPaymentDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Constructors, getters, setters
    public Loan() {
    }

    public Loan(Long id, Accounts account, double loanAmount, double interestRate, int durationInMonths, double emiAmount, LoanType loanType, LoanStatus status, Date loanStartDate, Date loanMaturityDate, double totalAlreadyPaidAmount, double remainingAmount, double penaltyRate, Date lastPaymentDate, Date updatedAt) {
        this.id = id;
        this.account = account;
        this.loanAmount = loanAmount;
        this.interestRate = interestRate;
        this.durationInMonths = durationInMonths;
        this.emiAmount = emiAmount;
        this.loanType = loanType;
        this.status = status;
        this.loanStartDate = loanStartDate;
        this.loanMaturityDate = loanMaturityDate;
        this.totalAlreadyPaidAmount = totalAlreadyPaidAmount;
        this.remainingAmount = remainingAmount;
        this.penaltyRate = penaltyRate;
        this.lastPaymentDate = lastPaymentDate;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Accounts getAccount() {
        return account;
    }

    public void setAccount(Accounts account) {
        this.account = account;
    }

    public double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public int getDurationInMonths() {
        return durationInMonths;
    }

    public void setDurationInMonths(int durationInMonths) {
        this.durationInMonths = durationInMonths;
    }

    public double getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(double emiAmount) {
        this.emiAmount = emiAmount;
    }

    public LoanType getLoanType() {
        return loanType;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
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
}
