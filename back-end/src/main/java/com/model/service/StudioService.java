package com.model.service;

import com.model.event.Event;
import com.model.event.StudioEvent;
import com.model.price.Price;

import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

public class StudioService extends Service {
    public List<Event> studioevents = new LinkedList<>();

    @Override
    public void buyEvent(Event checkOutEvent, YearMonth yearMonth) {
        Price price = totalMoneyCollected.getOrDefault(yearMonth, new Price(0));
        totalMoneyCollected.put(yearMonth,
                new Price(((StudioEvent)checkOutEvent).licensePrice.getPrice() + price.getPrice()));
    }

    public StudioService(String shortName, String longName, Date dateCreated) {
        super(shortName, longName, dateCreated);
    }

    public boolean validateIfEventExists(String shortName, Date year){
        for (Event studioevent : this.studioevents) {
          if(studioevent.shortName.equals(shortName) && studioevent.year.equals(year)){
              return true;
          }
        }
        return false;
    }

    public com.model.output.StudioService display(YearMonth yearMonth){
        com.model.output.StudioService studioService = new com.model.output.StudioService();
        studioService.shortName = this.shortName;
        studioService.longName = this.longName;
        studioService.current_period =  getPriceByMonth(yearMonth);
        studioService.previous_period = getPriceByMonth(yearMonth.minus(1, ChronoUnit.MONTHS));
        studioService.total = getTotalPriceExceptCurrentMonth(yearMonth);
        studioService.studioEventList = this.studioevents;
        return studioService;
    }



}
