package com.model.event;


import com.model.price.Price;

import java.util.Date;

public class StudioMovieEvent extends StudioEvent {

    String type = "movie";
    public StudioMovieEvent(String shortName, String longName, Date dateCreated, Date year, int duration, Price licensePrice, int number) {
        super(shortName, longName, dateCreated, year, duration, licensePrice,number);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
