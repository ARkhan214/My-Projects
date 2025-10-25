package com.emranhss.mkbankspring.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    // Bill company name(Dhaka wasa,Titash Gas,DMP Electricity .etc)
    private String companyName;

    // account holder er Billing ID/(Electricity bill -meter id-12321,Water bill id-mj322 .etc)
    private String accountHolderBillingId;

    @Column(nullable = false)
    private double amount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "transaction_time", nullable = false)
    private Date transactionTime;

    @Column(length = 255)
    private String description;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "account_id", nullable = false)
    private Accounts account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_account_id")
    private Accounts receiverAccount;


    @Column(length = 255)
    private String token;

    public Transaction() {
    }

    public Transaction(Long id, TransactionType type, String companyName, String accountHolderBillingId, double amount, Date transactionTime, String description, Accounts account, Accounts receiverAccount, String token) {
        this.id = id;
        this.type = type;
        this.companyName = companyName;
        this.accountHolderBillingId = accountHolderBillingId;
        this.amount = amount;
        this.transactionTime = transactionTime;
        this.description = description;
        this.account = account;
        this.receiverAccount = receiverAccount;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
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

    public Accounts getAccount() {
        return account;
    }

    public void setAccount(Accounts account) {
        this.account = account;
    }

    public Accounts getReceiverAccount() {
        return receiverAccount;
    }

    public void setReceiverAccount(Accounts receiverAccount) {
        this.receiverAccount = receiverAccount;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
