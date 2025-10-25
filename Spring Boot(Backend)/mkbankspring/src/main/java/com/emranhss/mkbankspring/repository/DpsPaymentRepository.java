package com.emranhss.mkbankspring.repository;

import com.emranhss.mkbankspring.entity.Dps;
import com.emranhss.mkbankspring.entity.DpsPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DpsPaymentRepository extends JpaRepository<DpsPayment, Long> {
    List<DpsPayment> findByDpsAccount(Dps dpsAccount);
}
