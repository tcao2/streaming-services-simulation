package com.model.input;

import com.model.price.Price;

import java.util.Date;

public class StreamingService {
    public String shortName;
    public String longName;
    public String monthlySubscriptionRate;
    public Date dateCreated;

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    public Price getMonthlySubscriptionRate() {
        return new Price(Double.parseDouble(monthlySubscriptionRate));
    }

    public void setMonthlySubscriptionRate(String monthlySubscriptionRate) {
        this.monthlySubscriptionRate = monthlySubscriptionRate;
    }
}
