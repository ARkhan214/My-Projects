package com.emranhss.mkbankspring.dto;

import java.util.Date;

public class TransactionDTO {
    private Long id;

    // Embed full account details
    private AccountsDTO account;          // sender account
    private AccountsDTO receiverAccount;  // receiver account

    private String type; // DEBIT or CREDIT
    private String transactionType;
    private double amount;
    private Date transactionTime;
    private String description;

    // Bill payment info
    private String companyName;
    private String accountHolderBillingId;

    public TransactionDTO() {}

    public TransactionDTO(Long id, AccountsDTO account, AccountsDTO receiverAccount, String type,
                          String transactionType, double amount, Date transactionTime, String description,
                          String companyName, String accountHolderBillingId) {
        this.id = id;
        this.account = account;
        this.receiverAccount = receiverAccount;
        this.type = type;
        this.transactionType = transactionType;
        this.amount = amount;
        this.transactionTime = transactionTime;
        this.description = description;
        this.companyName = companyName;
        this.accountHolderBillingId = accountHolderBillingId;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccountsDTO getAccount() {
        return account;
    }

    public void setAccount(AccountsDTO account) {
        this.account = account;
    }

    public AccountsDTO getReceiverAccount() {
        return receiverAccount;
    }

    public void setReceiverAccount(AccountsDTO receiverAccount) {
        this.receiverAccount = receiverAccount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(Date transactionTime) {
        this.transactionTime = transactionTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getAccountHolderBillingId() {
        return accountHolderBillingId;
    }

    public void setAccountHolderBillingId(String accountHolderBillingId) {
        this.accountHolderBillingId = accountHolderBillingId;
    }
}
