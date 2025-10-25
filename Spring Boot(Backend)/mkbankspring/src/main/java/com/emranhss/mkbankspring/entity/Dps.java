package com.emranhss.mkbankspring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Dps {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Accounts account;

    private double monthlyAmount;

    private int termMonths;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date nextDebitDate;

    @Enumerated(EnumType.STRING)
    private DpsStatus status;

    private double totalDeposited = 0.0;

    private int missedCount = 0;

    private int monthsPaid = 0;

    private double annualInterestRate;

    private double maturityAmount;

    public Dps() {
    }

    public Dps(Long id, Accounts account, double monthlyAmount, int termMonths, Date startDate, Date nextDebitDate, DpsStatus status, double totalDeposited, int missedCount, int monthsPaid, double annualInterestRate, double maturityAmount) {
        this.id = id;
        this.account = account;
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

    public Accounts getAccount() {
        return account;
    }

    public void setAccount(Accounts account) {
        this.account = account;
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

    @Override
    public String toString() {
        return "Dps{" +
                "id=" + id +
                ", account=" + account +
                ", monthlyAmount=" + monthlyAmount +
                ", termMonths=" + termMonths +
                ", startDate=" + startDate +
                ", nextDebitDate=" + nextDebitDate +
                ", status=" + status +
                ", totalDeposited=" + totalDeposited +
                ", missedCount=" + missedCount +
                ", monthsPaid=" + monthsPaid +
                ", annualInterestRate=" + annualInterestRate +
                ", maturityAmount=" + maturityAmount +
                '}';
    }
}
