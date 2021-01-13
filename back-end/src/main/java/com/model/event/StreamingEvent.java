package com.model.event;


import java.util.Date;

public abstract class StreamingEvent  extends Event {
    public StreamingEvent(String shortName, String longName, Date dateCreated, Date year, double duration,int number) {
        super(shortName, longName, dateCreated, year, duration,number);
    }
}
