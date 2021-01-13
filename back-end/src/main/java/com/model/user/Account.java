package com.model.user;

import com.model.checkOut.CheckOutEvent;
import com.model.event.Movie;
import com.model.event.PayPerViewEvent;
import com.model.event.StreamingEvent;
import com.model.price.Price;
import com.model.service.StreamingService;

import java.time.YearMonth;
import java.util.*;

public class Account {
    public String userName;
    public String emailID;
    private String pasword;
    int id;
    Date dateAdded;
    public List<StreamingService> streamingServiceList = new ArrayList<>();
    public Map<YearMonth, List<CheckOutEvent>> yearMonthCheckOutMap = new HashMap<>();
    public Map<StreamingService, YearMonth> expiryMonthlySubscriptionDate = new HashMap<>();

    public Account(String userName, String emailID, String pasword, int id, Date dateAdded) {
        this.userName = userName;
        this.emailID = emailID;
        this.pasword = pasword;
        this.id = id;
        this.dateAdded = dateAdded;
    }


    public void checkOut(CheckOutEvent checkOutEvent){
        if(!isEventAlreadyStreamed(checkOutEvent)) {
            StreamingService streamingService = (StreamingService) checkOutEvent.service;
            StreamingEvent streamingEvent = (StreamingEvent) checkOutEvent.event;
            if(streamingEvent instanceof PayPerViewEvent){
                streamingService.buyEvent(streamingEvent,checkOutEvent.getYearMonth());
            }else{
                if(!isMovieWatchedThisMonth(checkOutEvent)){
                    streamingService.buyEvent(streamingEvent,checkOutEvent.getYearMonth());
                }
            }
            List<CheckOutEvent> checkouts = this.yearMonthCheckOutMap.
                    getOrDefault(checkOutEvent.getYearMonth(), new ArrayList<CheckOutEvent>());
            checkouts.add(checkOutEvent);
            this.yearMonthCheckOutMap.put(checkOutEvent.getYearMonth(), checkouts);
            if (streamingEvent instanceof Movie) {
                expiryMonthlySubscriptionDate.put(streamingService, checkOutEvent.getYearMonth());
            }
        }
    }

    boolean isMovieWatchedThisMonth(CheckOutEvent checkOutEvent){
        if(expiryMonthlySubscriptionDate.containsKey(checkOutEvent.service)){
            if(expiryMonthlySubscriptionDate.get(checkOutEvent.service).equals(checkOutEvent.getYearMonth())){
                return true;
            }
        }
       return false;
    }

    boolean isEventAlreadyStreamed(CheckOutEvent checkOutEvent){
        List<CheckOutEvent> checkouts = this.yearMonthCheckOutMap.
                getOrDefault(checkOutEvent.getYearMonth(), new ArrayList<CheckOutEvent>());
        for(CheckOutEvent checkout : checkouts){
            if(checkout.event.shortName.equals(checkOutEvent.event.shortName) &&
                    checkout.service.shortName.equals(checkOutEvent.service.shortName)){
                return true;
            }
        }
        return false;
    }

    public Price getPriceByMonth(YearMonth yearMonth){
        List<CheckOutEvent> checkOutEvents = yearMonthCheckOutMap.getOrDefault(yearMonth,new ArrayList<>());
        Set<StreamingService> streamingServiceSet = new HashSet<>();
        double price = 0;
        for(CheckOutEvent checkOutEvent : checkOutEvents){
            if(checkOutEvent.event instanceof Movie){
                if(!streamingServiceSet.contains(checkOutEvent.service)){
                    price += checkOutEvent.price.getPrice();
                }
                streamingServiceSet.add((StreamingService) checkOutEvent.service);
            }else{
                price += checkOutEvent.price.getPrice();
            }
        }
        return new Price(price);
    }

    public Price getTotalPriceExceptMonth(YearMonth yearMonth){
        double price = 0;
        for(YearMonth yearMonth1 : yearMonthCheckOutMap.keySet()){
            if(yearMonth.equals(yearMonth1)) continue;
            price += getPriceByMonth(yearMonth1).getPrice();
        }
        return new Price(price);
    }

}
