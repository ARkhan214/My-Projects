package com.emranhss.mkbankspring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "gl_transactions")
public class GLTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private GLType type;

    private String description;

    // Polymorphic linking fields
    private Long referenceId;      // কোন entity এর ID (FD/DPS/Loan ইত্যাদি)
    private String referenceType;  // "FD", "DPS", "LOAN"

    @Temporal(TemporalType.TIMESTAMP)
    private Date transactionDate = new Date();

    public GLTransaction() {
    }

    public GLTransaction(Long id, double amount, GLType type, String description, Long referenceId, String referenceType, Date transactionDate) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
        this.transactionDate = transactionDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public GLType getType() {
        return type;
    }

    public void setType(GLType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public String getReferenceType() {
        return referenceType;
    }

    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }
}
