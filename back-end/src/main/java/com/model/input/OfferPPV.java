package com.model.input;

import com.model.price.Price;

import java.util.Date;

public class OfferPPV {
    public String streamingService;
    public String studio;
    public String ppv;
    public Date year;
    public String price;


    public String getPpv() {
        return ppv;
    }

    public void setPpv(String ppv) {
        this.ppv = ppv;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getStreamingService() {
        return streamingService;
    }

    public void setStreamingService(String streamingService) {
        this.streamingService = streamingService;
    }

    public String getStudio() {
        return studio;
    }

    public void setStudio(String studio) {
        this.studio = studio;
    }

    public Date getYear() {
        return year;
    }

    public void setYear(Date year) {
        this.year = year;
    }
}
