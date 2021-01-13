package com.model.event;


import com.model.price.Price;

import java.util.Date;

public class PayPerViewEvent extends StreamingEvent {
    public Price price;

    public PayPerViewEvent(String shortName, String longName, Date dateCreated, Date year, double duration, Price price, int number) {
        super(shortName, longName, dateCreated, year, duration,number);
        this.price = price;
    }
}
