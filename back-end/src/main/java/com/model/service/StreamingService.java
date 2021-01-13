package com.model.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.model.Admin;
import com.model.checkOut.CheckOutEvent;
import com.model.event.*;
import com.model.price.Price;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class StreamingService extends Service {

    public Map<YearMonth,List<StreamingEvent>> yearMonthStreamingMap = new HashMap<>() ;
    public Price monthlySubscriptionRate;
    public Map<StudioService, List<CheckOutEvent>> studioServiceCheckOutEventMap = new HashMap<>();

    @Override
    public void buyEvent(Event event, YearMonth yearMonth) {
        double currentPrice = totalMoneyCollected.getOrDefault(yearMonth,new Price(0.0)).getPrice();
        double addedPrice = 0.0;
        if(event instanceof PayPerViewEvent) {
            addedPrice = currentPrice + ((PayPerViewEvent) event).price.getPrice();
        }else {
            addedPrice = currentPrice + monthlySubscriptionRate.getPrice();
        }
        totalMoneyCollected.put(yearMonth,new Price(addedPrice));
    }

    public void retractEvent(String movie, Date year,YearMonth yearMonth){
       if(this.yearMonthStreamingMap.containsKey(yearMonth)){
           List<StreamingEvent> streamingEvents = this.yearMonthStreamingMap.get(yearMonth);
           Iterator<StreamingEvent> iterator = streamingEvents.iterator();
           while (iterator.hasNext()){
               StreamingEvent next = iterator.next();
               if(next.shortName.equals(movie) && next.year.equals(year)){
                   iterator.remove();
               }
           }
       }
    }

    public StreamingService(String shortName, String longName, Date dateCreated) {
        super(shortName, longName, dateCreated);
    }

    public StreamingService(String shortName, String longName, Date dateCreated,Price monthlySubscriptionRate) {
        super(shortName, longName, dateCreated);
        this.monthlySubscriptionRate = monthlySubscriptionRate;
    }


    public boolean checkOutPPV(CheckOutEvent checkOutEvent, Price price){
        if(!isEventAlreadyPurchased(checkOutEvent)) {
            StudioEvent studioEvent = (StudioEvent) checkOutEvent.event;
            buy(checkOutEvent, studioEvent);
            addEventPPV(studioEvent, price,checkOutEvent.getYearMonth());
        }
        return true;
    }

    public boolean checkOutMovie(CheckOutEvent checkOutEvent){
        if(!isEventAlreadyPurchased(checkOutEvent)){
            StudioEvent studioEvent = (StudioEvent) checkOutEvent.event;
            buy(checkOutEvent, studioEvent);
            addEventMovie(studioEvent,checkOutEvent.getYearMonth());
        }
        return true;
    }

    boolean isEventAlreadyPurchased(CheckOutEvent checkOutEvent){
        List<StreamingEvent> streamingEvents = this.yearMonthStreamingMap.
                getOrDefault(checkOutEvent.getYearMonth(), new ArrayList<StreamingEvent>());
        for(StreamingEvent event : streamingEvents){
            if(checkOutEvent.event.shortName.equals(event.shortName) &&
                    checkOutEvent.service.shortName.equals(event.shortName)){
                return true;
            }
        }
        return false;
    }

    private void buy(CheckOutEvent checkOutEvent, StudioEvent studioEvent) {
        StudioService studioService = (StudioService) checkOutEvent.service;
        studioService.buyEvent(studioEvent,checkOutEvent.getYearMonth());
        List<CheckOutEvent> checkOuteventList = studioServiceCheckOutEventMap.getOrDefault(studioService, new ArrayList<CheckOutEvent>());
        checkOuteventList.add(checkOutEvent);
        studioServiceCheckOutEventMap.put(studioService,checkOuteventList);
    }

    private boolean addEventPPV(Event studioEvent, Price price, YearMonth yearMonth){
        StreamingEvent event = new PayPerViewEvent(studioEvent.shortName,studioEvent.longName,
                new Date(System.currentTimeMillis()),studioEvent.year,studioEvent.duration,new Price(price.getPrice()), Admin.number++);
        addStreamingEvent(event,yearMonth);
        return true;
    }

    private void addStreamingEvent(StreamingEvent event, YearMonth yearMonth) {
        List<StreamingEvent> streamingEventList = yearMonthStreamingMap.getOrDefault(yearMonth, new ArrayList<>());
        streamingEventList.add(event);
        yearMonthStreamingMap.put(yearMonth, streamingEventList);
    }

    private boolean addEventMovie(Event studioEvent, YearMonth yearMonth){
        StreamingEvent event = new Movie(studioEvent.shortName,studioEvent.longName,
                new Date(System.currentTimeMillis()),studioEvent.year,studioEvent.duration, Admin.number++);
        addStreamingEvent(event,yearMonth);
        return true;
    }

    public Event getEvent(String name, Date year, YearMonth yearMonth){
        if(yearMonthStreamingMap.containsKey(yearMonth)) {
            List<StreamingEvent> streamingEventList = yearMonthStreamingMap.get(yearMonth);
            for (StreamingEvent streamingEvent : streamingEventList) {
                if (streamingEvent.shortName.equals(name) && streamingEvent.year.equals(year)) {
                    return streamingEvent;
                }
            }
        }
        return null;
    }

    public Price getLicensingPrice(){
        double licensingPrice = 0;
        for(StudioService service : this.studioServiceCheckOutEventMap.keySet()){
            List<CheckOutEvent> checkOutEvents = this.studioServiceCheckOutEventMap.get(service);
            for(CheckOutEvent checkOutEvent : checkOutEvents){
                licensingPrice += checkOutEvent.price.getPrice();
            }
        }
        return new Price(licensingPrice);
    }

    public com.model.output.StreamingService display(YearMonth yearMonth){
        com.model.output.StreamingService streamingService = new com.model.output.StreamingService();
        streamingService.shortName = shortName;
        streamingService.longName = longName;
        streamingService.monthlySubscriptionRate = this.monthlySubscriptionRate;
        streamingService.current_period = getPriceByMonth(yearMonth);
        streamingService.previous_period = getPriceByMonth(yearMonth.minus(1, ChronoUnit.MONTHS));
        streamingService.total = getTotalPriceExceptCurrentMonth(yearMonth);
        streamingService.licensingPrice = getLicensingPrice();
        streamingService.offersForCurrentPeriod = this.yearMonthStreamingMap.get(yearMonth);
        return streamingService;
    }

}
