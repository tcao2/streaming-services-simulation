package com.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.model.checkOut.CheckOutEvent;
import com.model.event.Event;
import com.model.event.PayPerViewEvent;
import com.model.price.Price;
import com.model.service.StreamingService;
import com.model.util.DateUtil;

import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DemographicGroup {
    public String shortName;
    public String longName;
    public Date dateCreated;
    public int initAccountSize;

    @JsonIgnore
    public List<Account> accountList = new ArrayList<>();

    public Price getPriceByMonth(YearMonth yearMonth) {
        double price = 0;
        for (Account account : accountList) {
            price += account.getPriceByMonth(yearMonth).getPrice();
        }
        return new Price(price);
    }

    public Price getTotalHistoryPrice(YearMonth yearMonth) {
        double price = 0;
        for (Account account : accountList) {
            price += account.getTotalPriceExceptMonth(yearMonth).getPrice();
        }
        return new Price(price);
    }

    public DemographicGroup(String shortName, String longName, Date dateCreated) {
        this.shortName = shortName;
        this.longName = longName;
        this.dateCreated = dateCreated;
    }

    public void display(YearMonth yearMonth) {
        System.out.println("demo," + shortName + "," + longName);
        System.out.println("size," + accountList.size());
        System.out.println("current_period," + getPriceByMonth(yearMonth).getPrice());
        System.out.println("previous_period," + getPriceByMonth(yearMonth.minus(1, ChronoUnit.MONTHS)).getPrice());
        System.out.println("total," + getTotalHistoryPrice(yearMonth).getPrice());
    }

    public void watchEvent(double percentage, StreamingService streamingService, Event event, Date date) throws Exception {
        int totalAccounts = this.accountList.size();
        double accounts = percentage / 100 * totalAccounts;
        for (int i = 0; i < accounts; i++) {
            Account account = this.accountList.get(i);
            CheckOutEvent checkOutEvent = null;
            if (event instanceof PayPerViewEvent) {
                checkOutEvent = new CheckOutEvent(streamingService, event, date,
                        ((PayPerViewEvent) event).price);
            } else {
                checkOutEvent = new CheckOutEvent(streamingService, event, date,
                        streamingService.monthlySubscriptionRate);
            }
            account.checkOut(checkOutEvent);
        }
    }

    public boolean updateDemographicGroup(DemographicGroup demographicGroup, YearMonth yearMonth, Date currentDate) throws Exception {
        this.longName = demographicGroup.longName;
        if (this.getPriceByMonth(yearMonth).getPrice() == 0) {
            if (this.getInitAccountSize() < demographicGroup.getInitAccountSize()) {
                for (int i = this.initAccountSize;
                     i < demographicGroup.initAccountSize; i++) {
                    Account account = new Account("suman", "suman", "ssss", i, currentDate);
                    this.accountList.add(account);
                }
            } else if (this.getInitAccountSize() > demographicGroup.getInitAccountSize()) {
                for (int i = this.getInitAccountSize() - 1; i >= demographicGroup.getInitAccountSize(); i--) {
                    this.accountList.remove(i);
                }
            }
            this.initAccountSize = demographicGroup.initAccountSize;
        } else {
            return true;
        }
        return false;
    }


    public boolean checkIfEventWatched(String movie, Date year) {
        for (Account account : this.accountList) {
            try {
                List<CheckOutEvent> checkOutEvents = account.yearMonthCheckOutMap.get(DateUtil.getYearMonth());
                if (null != checkOutEvents) {
                    for (CheckOutEvent checkOutEvent : checkOutEvents) {
                        if (checkOutEvent.event.shortName.equals(movie) &&
                                checkOutEvent.event.year.equals(year)) {
                            return true;
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                return true;
            }
        }
        return false;
    }


    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public List<Account> getAccountList() {
        return accountList;
    }

    public void setAccountList(List<Account> accountList) {
        this.accountList = accountList;
    }

    public int getInitAccountSize() {
        return initAccountSize;
    }

    public void setInitAccountSize(int initAccountSize) {
        this.initAccountSize = initAccountSize;
    }
}
