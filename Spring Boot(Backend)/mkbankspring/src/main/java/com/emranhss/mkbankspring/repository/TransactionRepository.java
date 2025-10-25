package com.emranhss.mkbankspring.repository;

import com.emranhss.mkbankspring.entity.Accounts;
import com.emranhss.mkbankspring.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {


    @Query("select a from  Transaction a where a.account.id= :accountId")
    List<Transaction> findAccountByAccountID(@Param("accountId") Long accountId);

    List<Transaction> findByAccount(Accounts account);

    // Get transactions by account ID (for tr statement)
    List<Transaction> findByAccountId(Long accountId);

    // find transaction by accountId + date (for tr statement)
    List<Transaction> findByAccount_IdAndTransactionTimeBetween(
            Long accountId, Date startDate, Date endDate);

    // Get transactions by account ID (newest first)
    List<Transaction> findByAccountIdOrderByTransactionTime(Long accountId);

    // Get transactions by type (Deposit, Withdraw, etc.)
    List<Transaction> findByType(String type);

    // Fetch all transactions for a given accountId, sorted by transactionTime ascending
    List<Transaction> findByAccountIdOrderByTransactionTimeAsc(Long accountId);

    // Fetch all transactions for a given accountId that occurred between start and end date, sorted by transactionTime ascending
    List<Transaction> findByAccountIdAndTransactionTimeBetweenOrderByTransactionTimeAsc(
            Long accountId, Date start, Date end
    );

    void deleteByAccountId(Long accountId);

    //For Admin dashbord
    List<Transaction> findByAmountGreaterThan(double amount);

    //For Admin dashbord
    List<Transaction> findByAmountLessThan(double amount);



}
