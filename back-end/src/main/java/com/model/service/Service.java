package com.model.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.model.event.Event;
import com.model.price.Price;

import java.time.YearMonth;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public abstract class Service {
    public String shortName;
    public String longName;
    public Date dateCreated;

    @JsonIgnore
    public Map<YearMonth, Price> totalMoneyCollected = new HashMap<>();

    public abstract void buyEvent(Event checkOutEvent, YearMonth yearMonth);

    public Price getPriceByMonth(YearMonth yearMonth){
       return totalMoneyCollected.getOrDefault(yearMonth,new Price(0));
    }

    public Price getTotalPriceExceptCurrentMonth(YearMonth yearMonth){
        double price = 0;
        for(YearMonth yearMonth1 : totalMoneyCollected.keySet()){
            if(yearMonth.equals(yearMonth1)) continue;
            price += getPriceByMonth(yearMonth1).getPrice();
        }
        return new Price(price);
    }

    public Service(String shortName, String longName, Date dateCreated) {
        this.shortName = shortName;
        this.longName = longName;
        this.dateCreated = dateCreated;
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

//    public Map<YearMonth, Price> getTotalMoneyCollected() {
//        return totalMoneyCollected;
//    }
//
//    public void setTotalMoneyCollected(Map<YearMonth, Price> totalMoneyCollected) {
//        this.totalMoneyCollected = totalMoneyCollected;
//    }
}
