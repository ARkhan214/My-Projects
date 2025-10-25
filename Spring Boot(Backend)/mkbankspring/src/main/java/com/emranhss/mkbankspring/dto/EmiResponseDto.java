package com.emranhss.mkbankspring.dto;

public class EmiResponseDto {
    private double emi;
    private double totalPayable;
    private double interestRate; // yearly %

    public EmiResponseDto() {
    }

    public EmiResponseDto(double emi, double totalPayable, double interestRate) {
        this.emi = emi;
        this.totalPayable = totalPayable;
        this.interestRate = interestRate;
    }

    public double getEmi() {
        return emi;
    }

    public void setEmi(double emi) {
        this.emi = emi;
    }

    public double getTotalPayable() {
        return totalPayable;
    }

    public void setTotalPayable(double totalPayable) {
        this.totalPayable = totalPayable;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }
}
