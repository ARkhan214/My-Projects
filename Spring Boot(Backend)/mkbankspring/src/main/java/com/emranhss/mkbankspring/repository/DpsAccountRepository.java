package com.emranhss.mkbankspring.repository;


import com.emranhss.mkbankspring.entity.Dps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DpsAccountRepository extends JpaRepository<Dps, Long> {

    // একটি account এর সব DPS খুঁজে পেতে
//    List<Dps> findByAccountId(Long accountId);

    // Optional: Active DPS খুঁজে পেতে
    List<Dps> findByAccountIdAndStatus(Long accountId, String status);

    @Query("SELECT d FROM Dps d JOIN FETCH d.account WHERE d.account.id = :accountId")
    List<Dps> findByAccountId(@Param("accountId") Long accountId);

    // আজকের date এর আগে nextDebitDate থাকা সব DPS বের করবে
    List<Dps> findByNextDebitDateBefore(Date date);
}
