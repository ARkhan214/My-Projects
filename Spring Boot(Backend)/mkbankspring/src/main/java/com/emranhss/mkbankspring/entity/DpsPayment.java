package com.emranhss.mkbankspring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "dps_payments")
public class DpsPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Dps dps;

    private double amount;

    @Temporal(TemporalType.DATE)
    private Date paymentDate;

    private double penalty = 0.0;

    private String note;

    public DpsPayment() {
    }

    public DpsPayment(Long id, Dps dps, double amount, Date paymentDate, double penalty, String note) {
        this.id = id;
        this.dps = dps;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.penalty = penalty;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Dps getDps() {
        return dps;
    }

    public void setDps(Dps dps) {
        this.dps = dps;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public double getPenalty() {
        return penalty;
    }

    public void setPenalty(double penalty) {
        this.penalty = penalty;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
