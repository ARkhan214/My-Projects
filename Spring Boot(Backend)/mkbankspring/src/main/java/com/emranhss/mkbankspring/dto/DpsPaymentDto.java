package com.emranhss.mkbankspring.dto;

public class DpsPaymentDto {
    private Long dpsId;
    private double penaltyPercent;

    public DpsPaymentDto() {
    }

    public DpsPaymentDto(double penaltyPercent, Long dpsId) {
        this.penaltyPercent = penaltyPercent;
        this.dpsId = dpsId;
    }

    public Long getDpsId() {
        return dpsId;
    }

    public void setDpsId(Long dpsId) {
        this.dpsId = dpsId;
    }

    public double getPenaltyPercent() {
        return penaltyPercent;
    }

    public void setPenaltyPercent(double penaltyPercent) {
        this.penaltyPercent = penaltyPercent;
    }
}
