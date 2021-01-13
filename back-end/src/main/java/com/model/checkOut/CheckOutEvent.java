package com.model.checkOut;


import com.model.event.Event;
import com.model.price.Price;
import com.model.service.Service;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Date;

public class CheckOutEvent {
    public Event event;
    public Date dateCreated;
    public Service service;
    public Price price;

    public CheckOutEvent(Service service , Event event, Date dateCreated, Price price) {
        this.event = event;
        this.service = service;
        this.dateCreated = dateCreated;
        this.price = price;
    }

    public YearMonth getYearMonth(){
        YearMonth yearMonth =
                YearMonth.from(this.dateCreated.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate());
        return yearMonth;
    }
}
