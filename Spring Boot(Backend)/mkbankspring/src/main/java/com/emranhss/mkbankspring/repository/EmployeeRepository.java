package com.emranhss.mkbankspring.repository;

import com.emranhss.mkbankspring.dto.EmployeeDTO;
import com.emranhss.mkbankspring.entity.Accounts;
import com.emranhss.mkbankspring.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findById(Long id);

    Optional<Employee> findByUserId(Long userId);

    @Query("SELECT emp FROM Employee emp WHERE emp.user.email = :email")
    Optional<Employee> findByUserEmail(@Param("email") String email);


    //total Salary Calculate.
    @Query("SELECT SUM(e.salary) FROM Employee e")
    Double getTotalSalary();

//    Optional<Object> findByUserId(Long userId);
}
