package com.emranhss.mkbankspring.dto;

import com.emranhss.mkbankspring.entity.EmployeeStatus;
import com.emranhss.mkbankspring.entity.Position;
import com.emranhss.mkbankspring.entity.Role;

import java.util.Date;

public class EmployeeDTO {
    private Long id;
    private String name;
    private EmployeeStatus status;
    private String nid;
    private String phoneNumber;
    private String address;
    private Position position;
    private double salary;
    private Date dateOfJoining;
    private Date dateOfBirth;
    private Date retirementDate;
    private Long userId;
    private String photo;
    private Role role;

    public EmployeeDTO() {
    }

    public EmployeeDTO(Long id, String name, EmployeeStatus status, String nid, String phoneNumber, String address, Position position, double salary, Date dateOfJoining, Date dateOfBirth, Date retirementDate, String photo, Role role) {
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
        this.photo = photo;
        this.role = role;
    }

    public EmployeeDTO(Long id, String name, EmployeeStatus status, String nid, String phoneNumber, String address, Position position, double salary, Date dateOfJoining, Date dateOfBirth, Date retirementDate, Long userId, String photo, Role role) {
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
        this.userId = userId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
