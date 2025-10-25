package com.emranhss.mkbankspring.dto;

import java.util.Date;

public class FixedDepositDTO {


    private Long id;
    private Double depositAmount;
    private Integer durationInMonths;
    private Double interestRate;
    private Double prematureInterestRate;
    private Date startDate;
    private Date maturityDate;
    private Double maturityAmount;
    private Date prematureWithdrawalDate;
    private String status;
    private Date lastUpdatedAt;
    private AccountsDTO account; // Nested DTO for account info

    public FixedDepositDTO() {
    }

    public FixedDepositDTO(Long id, Double depositAmount, Integer durationInMonths, Double interestRate, Double prematureInterestRate, Date startDate, Date maturityDate, Double maturityAmount, Date prematureWithdrawalDate, String status, Date lastUpdatedAt, AccountsDTO account) {
        this.id = id;
        this.depositAmount = depositAmount;
        this.durationInMonths = durationInMonths;
        this.interestRate = interestRate;
        this.prematureInterestRate = prematureInterestRate;
        this.startDate = startDate;
        this.maturityDate = maturityDate;
        this.maturityAmount = maturityAmount;
        this.prematureWithdrawalDate = prematureWithdrawalDate;
        this.status = status;
        this.lastUpdatedAt = lastUpdatedAt;
        this.account = account;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(Date lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }

    public AccountsDTO getAccount() {
        return account;
    }

    public void setAccount(AccountsDTO account) {
        this.account = account;
    }
}
