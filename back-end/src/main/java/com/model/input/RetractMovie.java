package com.model.input;

import java.util.Date;

public class RetractMovie {
    public String streamingService;
    public String movie;
    public Date year;

    public String getStreamingService() {
        return streamingService;
    }

    public void setStreamingService(String streamingService) {
        this.streamingService = streamingService;
    }

    public String getMovie() {
        return movie;
    }

    public void setMovie(String movie) {
        this.movie = movie;
    }

    public Date getYear() {
        return year;
    }

    public void setYear(Date year) {
        this.year = year;
    }
}
