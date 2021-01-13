package com.model.event;

import java.util.Date;


public abstract class Event {
    public String shortName;
    public String longName;
    public Date dateCreated;
    public Date year;
    public double duration;
    public int number;

    public Event(String shortName, String longName, Date dateCreated, Date year, double duration,int number) {
        this.shortName = shortName;
        this.longName = longName;
        this.dateCreated = dateCreated;
        this.year = year;
        this.duration = duration;
        this.number = number;
    }




}
