package com.model.output;

import com.model.event.Event;
import com.model.event.StudioEvent;
import com.model.price.Price;
import java.util.Date;
import java.util.List;

public class StudioService {

    public String shortName;
    public String longName;
    public Date dateCreated;
    public List<Event> studioEventList;
    public Price current_period;
    public Price previous_period;
    public Price total;
    public Price licensingPrice;

}
