package com.emranhss.mkbankspring.entity;

public enum DpsStatus {
    ACTIVE,       // DPS is currently running
    CLOSED,       // DPS matured and closed
    DEFAULTED     // DPS failed due to missed installments
}
