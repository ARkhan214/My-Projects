package com.emranhss.mkbankspring.entity;

public enum TransactionType {

    INITIALBALANCE,
    DEPOSIT,
    FD_DEPOSIT,
    WITHDRAW,
    FIXED_DEPOSIT,
    FIXED_DEPOSIT_CLOSED,
    FD_CLOSED_PENALTY,
    TRANSFER,
    RECEIVE,
    DPS_DEPOSIT,

    // Bill Payments
    BILL_PAYMENT,              // Generic bill payment
    ELECTRICITY_BILL,  // Electricity bill payment
    GAS_BILL,          // Gas bill payment
    WATER_BILL,        // Water bill payment
    INTERNET_BILL,     // Internet / broadband bill payment
    MOBILE_RECHARGE,       // Mobile recharge / postpaid bill payment
    CREDIT_CARD_BILL   // Credit card bill payment

}
