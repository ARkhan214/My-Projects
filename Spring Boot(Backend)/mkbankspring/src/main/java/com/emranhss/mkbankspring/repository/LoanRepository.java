package com.emranhss.mkbankspring.repository;

import com.emranhss.mkbankspring.entity.Loan;
import com.emranhss.mkbankspring.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository  extends JpaRepository<Loan, Long> {

    List<Loan> findByAccountId(Long accountId);
    List<Loan> findByStatus(LoanStatus status);


}
