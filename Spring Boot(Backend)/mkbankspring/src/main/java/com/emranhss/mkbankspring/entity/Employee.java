package com.emranhss.mkbankspring.entity;


import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Enumerated(value = EnumType.STRING)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Column(unique = true, length = 17, nullable = false)
    private String nid;

    @Column(length = 15, unique = true, nullable = false)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    @Enumerated(value = EnumType.STRING)
    private Position position;

    private double salary;
    private Date dateOfJoining;
    private Date dateOfBirth;
    private Date retirementDate;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String photo;

    @Enumerated(value = EnumType.STRING)
    private  Role role;

    public Employee() {
    }

    public Employee(Long id, String name, EmployeeStatus status, String nid, String phoneNumber, String address, Position position, double salary, Date dateOfJoining, Date dateOfBirth, Date retirementDate, User user, String photo, Role role) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.nid = nid;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.position = position;
        this.salary = salary;
        this.dateOfJoining = dateOfJoining;
        this.dateOfBirth = dateOfBirth;
        this.retirementDate = retirementDate;
        this.user = user;
        this.photo = photo;
        this.role = role;
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

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
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

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public Date getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(Date dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Date getRetirementDate() {
        return retirementDate;
    }

    public void setRetirementDate(Date retirementDate) {
        this.retirementDate = retirementDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
