package com.model.output;

import com.model.event.StreamingEvent;
import com.model.price.Price;

import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class StreamingService {

    public String shortName;
    public String longName;
    public Price monthlySubscriptionRate;
    public Price current_period;
    public Price previous_period;
    public Price total;
    public Price licensingPrice ;
    public List<StreamingEvent> offersForCurrentPeriod;

}
