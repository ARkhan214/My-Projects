package com.emranhss.mkbankspring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class FixedDeposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Linked bank account for this FD
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Accounts account;

    private Double depositAmount;

    // Duration of FD in months
    private Integer durationInMonths;

    private Double interestRate;

    // Lower interest rate applied for premature withdrawal
    private Double prematureInterestRate;

    // FD start date
    @Temporal(TemporalType.DATE)
    private Date startDate;

    // FD maturity date
    @Temporal(TemporalType.DATE)
    private Date maturityDate;

    // Final maturity amount (principal + interest, calculated)
    private Double maturityAmount;

    // If FD is withdrawn before maturity, store withdrawal date
    @Temporal(TemporalType.DATE)
    private Date prematureWithdrawalDate;

    @Enumerated(EnumType.STRING)
    private FdStatus status;

    //chack last update
    @Temporal(TemporalType.TIMESTAMP)
    private Date fDLustUpdatedAt;

    public FixedDeposit() {
    }

    public FixedDeposit(Long id, Accounts account, Double depositAmount, Integer durationInMonths, Double interestRate, Double prematureInterestRate, Date startDate, Date maturityDate, Double maturityAmount, Date prematureWithdrawalDate, FdStatus status, Date fDLustUpdatedAt) {
        this.id = id;
        this.account = account;
        this.depositAmount = depositAmount;
        this.durationInMonths = durationInMonths;
        this.interestRate = interestRate;
        this.prematureInterestRate = prematureInterestRate;
        this.startDate = startDate;
        this.maturityDate = maturityDate;
        this.maturityAmount = maturityAmount;
        this.prematureWithdrawalDate = prematureWithdrawalDate;
        this.status = status;
        this.fDLustUpdatedAt = fDLustUpdatedAt;
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

    public Double getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(Double depositAmount) {
        this.depositAmount = depositAmount;
    }

    public Integer getDurationInMonths() {
        return durationInMonths;
    }

    public void setDurationInMonths(Integer durationInMonths) {
        this.durationInMonths = durationInMonths;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public Double getPrematureInterestRate() {
        return prematureInterestRate;
    }

    public void setPrematureInterestRate(Double prematureInterestRate) {
        this.prematureInterestRate = prematureInterestRate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(Date maturityDate) {
        this.maturityDate = maturityDate;
    }

    public Double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(Double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public Date getPrematureWithdrawalDate() {
        return prematureWithdrawalDate;
    }

    public void setPrematureWithdrawalDate(Date prematureWithdrawalDate) {
        this.prematureWithdrawalDate = prematureWithdrawalDate;
    }

    public FdStatus getStatus() {
        return status;
    }

    public void setStatus(FdStatus status) {
        this.status = status;
    }

    public Date getfDLustUpdatedAt() {
        return fDLustUpdatedAt;
    }

    public void setfDLustUpdatedAt(Date fDLustUpdatedAt) {
        this.fDLustUpdatedAt = fDLustUpdatedAt;
    }
}
