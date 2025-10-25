package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.entity.Dps;
import com.emranhss.mkbankspring.entity.DpsStatus;
import com.emranhss.mkbankspring.repository.DpsAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PaymentSchedulerService {

    @Autowired
    private DpsAccountRepository dpsAccountRepository;

    @Autowired
    private DpsService dpsService;


   // @Scheduled(fixedRate = 5000)     // প্রতি ১ মিনিটে চলবে
      @Scheduled(cron = "0 0 0 * * ?")   //Runs every day at 12:00 AM
    public void autoProcessDpsPayments() {
        System.out.println(" Running DPS Auto Payment Scheduler at " + new Date());

        Date now = new Date();

        // আজকের বা আগের তারিখের সব active DPS বের করো
        List<Dps> dueDpsList = dpsAccountRepository.findByNextDebitDateBefore(now);

        for (Dps dps : dueDpsList) {
            if (dps.getStatus() == DpsStatus.ACTIVE) {
                try {
                    // এখানে token null দিলেও চলবে — তুমি চাইলে System Token দিতে পারো
                    dpsService.processMonthlyPayment(dps.getId(), "SYSTEM_AUTO");
                    System.out.println("Auto processed DPS ID: " + dps.getId());
                } catch (Exception e) {
                    System.err.println("Failed to process DPS ID " + dps.getId() + ": " + e.getMessage());
                }
            }
        }
    }


}
