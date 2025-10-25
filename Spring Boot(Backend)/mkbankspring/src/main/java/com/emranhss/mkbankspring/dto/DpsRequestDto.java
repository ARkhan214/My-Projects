package com.emranhss.mkbankspring.dto;

public class DpsRequestDto {
    private double monthlyInstallment; // মাসিক জমা
    private int durationInMonths; // DPS এর মেয়াদ (মাসে)

    public DpsRequestDto() {
    }

    public DpsRequestDto(double monthlyInstallment, int durationInMonths) {
        this.monthlyInstallment = monthlyInstallment;
        this.durationInMonths = durationInMonths;
    }

    public double getMonthlyInstallment() {
        return monthlyInstallment;
    }

    public void setMonthlyInstallment(double monthlyInstallment) {
        this.monthlyInstallment = monthlyInstallment;
    }

    public int getDurationInMonths() {
        return durationInMonths;
    }

    public void setDurationInMonths(int durationInMonths) {
        this.durationInMonths = durationInMonths;
    }
}
