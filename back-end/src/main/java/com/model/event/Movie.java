package com.model.event;

import java.util.Date;

public class Movie extends StreamingEvent {
    public Movie(String shortName, String longName, Date dateCreated, Date year, double duration,int number) {
        super(shortName, longName, dateCreated, year, duration,number);
    }
}
