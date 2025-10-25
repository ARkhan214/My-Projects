package com.emranhss.mkbankspring.repository;

import com.emranhss.mkbankspring.dto.FixedDepositDTO;
import com.emranhss.mkbankspring.entity.FdStatus;
import com.emranhss.mkbankspring.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByAccountId(Long accountId);

    List<FixedDeposit> findByStatus(FdStatus status);
    // Single FD by id and account
    Optional<FixedDeposit> findByIdAndAccountId(Long fdId, Long accountId);


    //For get ALl FD
//    List<FixedDepositDTO> findByAccountId1(Long accountId);
}
