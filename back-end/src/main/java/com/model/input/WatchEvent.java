package com.model.input;

import java.util.Date;

public class WatchEvent {

    public String demographicGroup;
    public double percentage ;
    public String streamingService ;
    public String eventName ;
    public Date yearProduced ;

    public String getDemographicGroup() {
        return demographicGroup;
    }

    public void setDemographicGroup(String demographicGroup) {
        this.demographicGroup = demographicGroup;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getStreamingService() {
        return streamingService;
    }

    public void setStreamingService(String streamingService) {
        this.streamingService = streamingService;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Date getYearProduced() {
        return yearProduced;
    }

    public void setYearProduced(Date yearProduced) {
        this.yearProduced = yearProduced;
    }
}
