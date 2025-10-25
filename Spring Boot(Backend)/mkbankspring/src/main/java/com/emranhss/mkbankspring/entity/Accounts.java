package com.emranhss.mkbankspring.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Accounts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id ;

    private String name;
    private boolean accountActiveStatus = true;
    private String accountType ;
    private double balance ;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(unique = true, length = 17, nullable = false)
    private String nid;

    @Column(length = 15, unique = true, nullable = false)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    private String photo;


    private Date dateOfBirth;


    private Date accountOpeningDate;


    private Date accountClosingDate;


    @Enumerated(value = EnumType.STRING)
    private  Role role;


    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JsonIgnore
//    @JsonBackReference
    private List<Transaction> transactions;

    public Accounts() {
    }

    public Accounts(Long id, String name, boolean accountActiveStatus, String accountType, double balance, User user, String nid, String phoneNumber, String address, String photo, Date dateOfBirth, Date accountOpeningDate, Date accountClosingDate, Role role, List<Transaction> transactions) {
        this.id = id;
        this.name = name;
        this.accountActiveStatus = accountActiveStatus;
        this.accountType = accountType;
        this.balance = balance;
        this.user = user;
        this.nid = nid;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.photo = photo;
        this.dateOfBirth = dateOfBirth;
        this.accountOpeningDate = accountOpeningDate;
        this.accountClosingDate = accountClosingDate;
        this.role = role;
        this.transactions = transactions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAccountActiveStatus() {
        return accountActiveStatus;
    }

    public void setAccountActiveStatus(boolean accountActiveStatus) {
        this.accountActiveStatus = accountActiveStatus;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType != null ? accountType.toUpperCase() : null;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getNid() {
        return nid;
    }

    public void setNid(String nid) {
        this.nid = nid;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Date getAccountOpeningDate() {
        return accountOpeningDate;
    }

    public void setAccountOpeningDate(Date accountOpeningDate) {
        this.accountOpeningDate = accountOpeningDate;
    }

    public Date getAccountClosingDate() {
        return accountClosingDate;
    }

    public void setAccountClosingDate(Date accountClosingDate) {
        this.accountClosingDate = accountClosingDate;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    @Override
    public String toString() {
        return "Accounts{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", accountActiveStatus=" + accountActiveStatus +
                ", accountType='" + accountType + '\'' +
                ", balance=" + balance +
                ", user=" + user +
                ", nid='" + nid + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", photo='" + photo + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", accountOpeningDate=" + accountOpeningDate +
                ", accountClosingDate=" + accountClosingDate +
                ", role=" + role +
                ", transactions=" + transactions +
                '}';
    }
}
