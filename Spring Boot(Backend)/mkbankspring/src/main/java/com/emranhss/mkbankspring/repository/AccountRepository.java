package com.emranhss.mkbankspring.repository;

import com.emranhss.mkbankspring.entity.Accounts;
import com.emranhss.mkbankspring.entity.Dps;
import com.emranhss.mkbankspring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Accounts,Long> {

    //(connected with TransactionResCon Method Number -3) and
    //(connected with AccountResCon Method Number -2)
    Optional<Accounts> findById(Long id);


    Optional<Accounts> findByUserId(Long userId);

    @Query("SELECT ac FROM Accounts ac WHERE ac.user.email = :email")
    Optional<Accounts> findByUserEmail(@Param("email") String email);

    // Option 2: Directly return account id
    @Query("SELECT a FROM Accounts a WHERE a.user = :user")
    Optional<Accounts> findAccountByUser(User user);

    // Option 3: If you want to search by userId instead of object
    @Query("SELECT a.id FROM Accounts a WHERE a.user.id = :userId")
    Long findAccountIdByUserId(Long userId);


    @Query("SELECT d FROM Dps d JOIN FETCH d.account WHERE d.account.id = :accountId")
    List<Dps> findByAccountId(@Param("accountId") Long accountId);

}
