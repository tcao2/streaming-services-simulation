package com.model.event;


import com.model.price.Price;

import java.util.Date;

public class StudioEvent extends Event {
    public Price licensePrice;

    public StudioEvent(String shortName, String longName, Date dateCreated, Date year, int duration, Price licensePrice, int number) {
        super(shortName, longName, dateCreated, year, duration,number);
        this.licensePrice = licensePrice;
    }
}
