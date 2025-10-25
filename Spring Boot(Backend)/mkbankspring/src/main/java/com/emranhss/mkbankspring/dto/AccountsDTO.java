package com.emranhss.mkbankspring.dto;

import java.util.Date;

public class AccountsDTO {
    private Long id;
    private String name;
    private boolean accountActiveStatus;
    private String accountType;
    private double balance;
//    private Long userId;
    private String nid;
    private String phoneNumber;
    private String address;
    private String photo;
    private Date dateOfBirth;
    private Date accountOpeningDate;
    private Date accountClosingDate;
    private String role;

    public AccountsDTO() {


    }

    public AccountsDTO(Long id, String name, boolean accountActiveStatus, String accountType, double balance, String nid, String phoneNumber, String address, String photo, Date dateOfBirth, Date accountOpeningDate, Date accountClosingDate, String role) {
        this.id = id;
        this.name = name;
        this.accountActiveStatus = accountActiveStatus;
        this.accountType = accountType;
        this.balance = balance;
        this.nid = nid;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.photo = photo;
        this.dateOfBirth = dateOfBirth;
        this.accountOpeningDate = accountOpeningDate;
        this.accountClosingDate = accountClosingDate;
        this.role = role;
    }

    public AccountsDTO(Long id, String name, double balance, String accountType) {

    }


    // 7 parameter constructor
    public AccountsDTO(Long id, String name, double balance, String accountType,
                       String nid, String phoneNumber, String address,String photo) {
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.accountType = accountType;
        this.nid = nid;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.photo = photo;

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
        this.accountType = accountType;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
