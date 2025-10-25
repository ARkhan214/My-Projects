package com.emranhss.mkbankspring.entity;

public enum GLType {
    ACCOUNT_OPEN,
    ACCOUNT_CLOSED,

    FD_OPEN,
    FD_CLOSED,
    FD_CLOSED_PENALTY,

    DPS_OPEN,
    DPS_PAYMENT,
    DPS_DEPOSIT,
    DPS_INTEREST_PAYABLE,
    DPS_CLOSED,

    LOAN_OPEN,
    LOAN_PAYMENT,
    LOAN_CLOSED,

    PENALTY,

    TRANSFER,
    RECEIVE,

    ELECTRICITY_BILL,  // Electricity bill payment
    GAS_BILL,          // Gas bill payment
    WATER_BILL,        // Water bill payment
    INTERNET_BILL,     // Internet / broadband bill payment
    MOBILE_RECHARGE,       // Mobile recharge / postpaid bill payment
    CREDIT_CARD_BILL   // Credit card bill payment

}
