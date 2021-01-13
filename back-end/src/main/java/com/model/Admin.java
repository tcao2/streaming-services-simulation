package com.model;

import com.model.checkOut.CheckOutEvent;
import com.model.event.*;
import com.model.price.Price;
import com.model.service.Service;
import com.model.service.StreamingService;
import com.model.service.StudioService;
import com.model.user.Account;
import com.model.user.DemographicGroup;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

class Pair {
    int number;
    Event event;
    Service studioService;

    public Pair(Event event, Service service) {
        this.event = event;
        this.studioService = service;
    }
}

public class Admin {

    HashMap<String, DemographicGroup> demo_map = new HashMap<>();
    HashMap<String, StudioService> studio_map = new HashMap<>();
    HashMap<String, StreamingService> streamService_map = new HashMap<>();
    static LocalDate localDate = null;
    public static int number = 0;

    public static void main(String[] args) throws Exception {
        Date myDate = parseDate("2020-10");
        localDate = myDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Admin admin = new Admin();
        admin.processInstructions(false);
    }

    public void processInstructions(Boolean verboseMode) {
        Date myDate = parseDate("2020-10");
        localDate = myDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Scanner commandLineInput = new Scanner(System.in);
        String wholeInputLine;
        String[] tokens;
        final String DELIMITER = ",";
        boolean shouldBreak = false;
        while (true) {
            if(shouldBreak) break;
            try {
                wholeInputLine = commandLineInput.nextLine();
                tokens = wholeInputLine.split(DELIMITER);
                System.out.println("> " + wholeInputLine);
                String action = tokens[0];
                switch (action){
                    case "create_demo":
                        createDemoGraphicGroup(tokens);
                        break;
                    case "create_studio":
                        createStudio(tokens);
                        break;
                    case "create_event":
                        createStudioEvent(tokens);
                        break;
                    case "create_stream":
                        createStreamingService(tokens);
                        break;
                    case "offer_movie":
                        offerMovieToStreamingService(tokens);
                        break;
                    case "offer_ppv":
                        offerPPVToStreamingService(tokens);
                        break;
                    case "watch_event":
                        watchStreamingEvent(tokens);
                        break;
                    case "next_month":
                        nextDate();
                        break;
                    case "display_demo":
                        displayDemo(tokens);
                        break;
                    case "display_studio":
                        displayStudio(tokens);
                        break;
                    case "display_stream":
                        displayStream(tokens);
                        break;
                    case "display_events":
                        displayStudioEvents();
                        break;
                    case "display_offers":
                        displayStreamingEvents();
                        break;
                    case "display_time":
                        displayTime();
                        break;
                    case "stop":
                        shouldBreak = true;
                        break;
                    default:
                        break;
                }
            }catch (Exception e){

            }
        }
    }

    public void displayStudioEvents() {
        ArrayList<Pair> alist = new ArrayList<Pair>();
        this.studio_map.forEach((s, studioService) -> {
            for(Event studioEvent : studioService.studioevents){
                Pair apair = new Pair(studioEvent,studioService);
                alist.add(apair);
            }
        });
        alist.stream().sorted(Comparator.comparingInt(o -> ((StudioEvent) (o.event)).number)).forEach(pair -> {
            StudioEvent studioEvent = (StudioEvent) pair.event;
            if(studioEvent instanceof StudioPPVEvent){
                System.out.println("ppv," +
                        studioEvent.shortName + ","
                        + YearMonth.from(studioEvent.year.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()).getYear() + ","
                        + (int)studioEvent.duration + ","
                        + ((StudioService)pair.studioService).shortName + ","
                        + ((StudioPPVEvent) studioEvent).licensePrice.getPrice());
            }else{
                System.out.println("movie," +
                        studioEvent.shortName + ","
                        + YearMonth.from(studioEvent.year.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()).getYear() + ","
                        + (int)studioEvent.duration + ","
                        + ((StudioService)pair.studioService).shortName + ","
                        + ((StudioMovieEvent) studioEvent).licensePrice.getPrice());
            }
        });

    }

    public void displayStreamingEvents() throws Exception{
        ArrayList<Pair> alist = new ArrayList<Pair>();
        this.streamService_map.forEach((s, streamingService) -> {
            try {
                for(Event studioEvent : streamingService.yearMonthStreamingMap.getOrDefault(getYearMonth(),new ArrayList<>())){
                    Pair apair = new Pair(studioEvent,streamingService);
                    alist.add(apair);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        alist.stream().sorted(Comparator.comparingInt(o -> ((StreamingEvent) (o.event)).number)).forEach(pair -> {
            StreamingEvent streamingEvent = (StreamingEvent) pair.event;
            if(streamingEvent instanceof PayPerViewEvent){
                    System.out.println(((StreamingService)pair.studioService).shortName + ","
                            + "ppv,"
                            + streamingEvent.shortName + ","
                            +  YearMonth.from(streamingEvent.year.toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()).getYear()+","
                            + ((PayPerViewEvent) streamingEvent).price.getPrice());
                }else{
                    System.out.println(((StreamingService)pair.studioService).shortName + ","
                            + "movie,"
                            + streamingEvent.shortName + ","
                            + YearMonth.from(streamingEvent.year.toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()).getYear());
                }
        });


    }

    public void displayTime() throws Exception{
        System.out.println("time,"+localDate.getMonthValue()+","+localDate.getYear());
    }

    public void displayDemo(String[] tokens) throws Exception{
        String name = tokens[1];
        if(demo_map.containsKey(name)){
            demo_map.get(name).display(getYearMonth());
        }
    }

    public void displayStudio(String[] tokens) throws Exception{
        String name = tokens[1];
        if(studio_map.containsKey(name)){
            studio_map.get(name).display(getYearMonth());
        }
    }

    public void displayStream(String[] tokens) throws Exception{
        String name = tokens[1];
        if(streamService_map.containsKey(name)){
            streamService_map.get(name).display(getYearMonth());
        }
    }

    public void watchStreamingEvent(String[] tokens) throws Exception{
        String demoGraphGroup = tokens[1];
        double percentage = Double.parseDouble(tokens[2]);
        String strStreamService = tokens[3];
        String eventName = tokens[4];
        Date yearProduced = getYear(tokens[5]);

        if(demo_map.containsKey(demoGraphGroup) && streamService_map.containsKey(strStreamService) && null!=
                streamService_map.get(strStreamService).getEvent(eventName,yearProduced,getYearMonth())){
            DemographicGroup demographicGroup = demo_map.get(demoGraphGroup);
            StreamingService streamingService = streamService_map.get(strStreamService);
            Event event = streamingService.getEvent(eventName, yearProduced,getYearMonth());
            demographicGroup.watchEvent(percentage, streamingService, event,getDate());
        }

    }

    public  void offerMovieToStreamingService(String[] tokens) throws Exception{
        String service = tokens[1];
        String movieName = tokens[2];
        String yearProduced = tokens[3];
        StreamingService streamingService = streamService_map.get(service);
        studio_map.forEach((s, studioService) -> {
            studioService.studioevents.forEach(event -> {
                try {
                    if(event.shortName.equals(movieName) && event.year.equals(getYear(yearProduced))){
                        CheckOutEvent checkOutEvent = new CheckOutEvent(studioService,event,getDate(),((StudioMovieEvent)event).licensePrice);
                        streamingService.checkOutMovie(checkOutEvent);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        });
    }

    public  void offerPPVToStreamingService(String[] tokens) throws Exception{
        String service = tokens[1];
        String movieName = tokens[2];
        String yearProduced = tokens[3];
        Price price = new Price(Double.parseDouble(tokens[4]));
        StreamingService streamingService = streamService_map.get(service);
        studio_map.forEach((s, studioService) -> {
            studioService.studioevents.forEach(event -> {
                try {
                    if(event.shortName.equals(movieName) && event.year.equals(getYear(yearProduced))){
                        CheckOutEvent checkOutEvent = new CheckOutEvent(studioService,event,getDate(),((StudioPPVEvent)event).licensePrice);
                        streamingService.checkOutPPV(checkOutEvent,price);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        });
    }

    public void createStreamingService(String[] tokens) throws Exception{
        String shortName = tokens[1];
        String longName = tokens[2];
        int subscriptionPrice = Integer.parseInt(tokens[3]);
        StreamingService streamingService = new StreamingService(shortName,longName,getDate());
        streamingService.monthlySubscriptionRate = new Price(subscriptionPrice);
        streamService_map.put(shortName,streamingService);
    }

    public void createDemoGraphicGroup(String[] tokens) throws Exception {
        String shortName = tokens[1];
        String longName = tokens[2];
        int numOfAccounts  = Integer.parseInt(tokens[3]);
        DemographicGroup demographicGroup = new DemographicGroup(shortName,longName,getDate());
        for(int i = 0; i < numOfAccounts; i++){
            Account account = new Account("suman","suman","ssss",i,getDate());
            demographicGroup.accountList.add(account);
        }
        demo_map.put(shortName,demographicGroup);
    }

    public void createStudio(String[] tokens) throws Exception {
        String shortName = tokens[1];
        String longName = tokens[2];
        StudioService studioService = new StudioService(shortName,longName,getDate());
        studio_map.put(shortName,studioService);
    }

    public void createStudioEvent(String[] tokens) throws Exception {

        String type = tokens[1];
        String name = tokens[2];
        String yearProduced = tokens[3];
        int duration = Integer.parseInt(tokens[4]);
        String studio = tokens[5];
        int licenseFee = Integer.parseInt(tokens[6]);
        switch (type){
            case "movie":
                if(studio_map.containsKey(studio)){
                    Event studioMovieEvent = new StudioMovieEvent(name,name,getDate(),getYear(yearProduced)
                            ,duration,new Price(licenseFee),Admin.number++);
                    studio_map.get(studio).studioevents.add(studioMovieEvent);
                }
                break;
            case "ppv":
                if(studio_map.containsKey(studio)){
                    Event studioPPVEvent = new StudioPPVEvent(name,name,getDate(),getYear(yearProduced)
                            ,duration,new Price(licenseFee),Admin.number++);
                    studio_map.get(studio).studioevents.add(studioPPVEvent);
                }
                break;
        }

    }

    public Date getDate() throws Exception {
        return Date.from(localDate.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }

    public Date nextDate() throws Exception {
        localDate = localDate.plus(1,ChronoUnit.MONTHS);
        return Date.from(localDate.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }

    public Date getYear(String year) throws Exception {
        SimpleDateFormat sd = new SimpleDateFormat("yyyy");
        Date dateyear = sd.parse(year);
        return dateyear;
    }

    public static Date parseDate(String date) {
        try {
            return new SimpleDateFormat("yyyy-MM").parse(date);
        } catch (ParseException e) {
            return null;
        }
    }

    public YearMonth getYearMonth() throws Exception{
        YearMonth yearMonth =
                YearMonth.from(getDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate());
        return yearMonth;
    }



//    public static void main(String[] args) {
//        // DG and accounts
//        DemographicGroup demographicGroup1 = new DemographicGroup("4-5","somelong",
//                new Date(System.currentTimeMillis()));
//        Account account1 = new Account("suman","suman.datrika@gmail.com","123",1,
//                new Date(System.currentTimeMillis()));
//        Account account2 = new Account("dixitha","dixitha.datrika@gmail.com","123",2,
//                new Date(System.currentTimeMillis()));
//        demographicGroup1.accountList.add(account1);
//        demographicGroup1.accountList.add(account2);
//
//        //Create StudioService Fox and add few movies
//        StudioService studioServiceFox = new StudioService("FoxStudio","FoxLong",
//                new Date(System.currentTimeMillis()));
//        StudioEvent studioEventMovie1 = new StudioEvent("Movie1","Mov",
//                new Date(System.currentTimeMillis()), new Date(System.currentTimeMillis()),100,new Price(800));
//        studioServiceFox.studioevents.add(studioEventMovie1);
//
//        //Create StudioService sony and add few movies
//        StudioService studioServiceSony = new StudioService("SonyStudio","SonyLong",
//                new Date(System.currentTimeMillis()));
//        StudioEvent studioEventMovieSony = new StudioEvent("Movie1BySony","Mov",
//                new Date(System.currentTimeMillis()), new Date(System.currentTimeMillis()),100,new Price(650));
//        studioServiceSony.studioevents.add(studioEventMovieSony);
//
//        //Create StreamingService Netflix and hulu
//        StreamingService streamingServiceNetflix = new StreamingService("Netflix","netflix",
//                new Date(System.currentTimeMillis()));
//        StreamingService streamingServiceHulu = new StreamingService("Hulu","hulu",
//                new Date(System.currentTimeMillis()));
//
//        // Add available studios for netflix services
//        streamingServiceNetflix.studioServices.add(studioServiceFox);
//        streamingServiceNetflix.studioServices.add(studioServiceSony);
//        // Add available studios for netflix services
//        streamingServiceHulu.studioServices.add(studioServiceFox);
//        streamingServiceHulu.studioServices.add(studioServiceSony);
//
//
//        // Netflix buys movie from Fox
//        StudioService foxservice = streamingServiceNetflix.studioServices.get(0);
//        StudioEvent studioEvent = foxservice.studioevents.get(0);
//        CheckOutEvent checkOutEvent = new CheckOutEvent(foxservice,studioEvent,
//                new Date(System.currentTimeMillis()),studioEvent.licensePrice);
//        streamingServiceNetflix.checkOut(checkOutEvent);
//
//        //Hulu buys movies from sony
//        StudioService sonyservice = streamingServiceHulu.studioServices.get(1);
//        StudioEvent sonystudioEvent = sonyservice.studioevents.get(0);
//        CheckOutEvent checkOutEventFromsony = new CheckOutEvent(sonyservice,sonystudioEvent,
//                new Date(System.currentTimeMillis()),sonystudioEvent.licensePrice);
//        streamingServiceHulu.checkOut(checkOutEventFromsony);
//
//        //Account1 buys PPv from Netflix
//        account1.streamingServiceList.add(streamingServiceNetflix);
//        StreamingService streamingServiceNetflixforaccount1 = account1.streamingServiceList.get(0);
//        StreamingEvent streamingEventavailbleforaccount1 = streamingServiceNetflixforaccount1.streamingEventList.get(0);
//        CheckOutEvent checkOutEventforAccount1 = new CheckOutEvent(streamingServiceNetflixforaccount1,
//                streamingEventavailbleforaccount1,
//                new Date(System.currentTimeMillis()),((PayPerViewEvent)streamingEventavailbleforaccount1).price);
//        account1.checkOut(checkOutEventforAccount1);
//
//        //Account2 buys PPv from Netflix
//        account2.streamingServiceList.add(streamingServiceHulu);
//        StreamingService streamingServiceHuluforaccount2 = account2.streamingServiceList.get(0);
//        StreamingEvent streamingEventavailbleforaccount2 = streamingServiceHuluforaccount2.streamingEventList.get(0);
//        CheckOutEvent checkOutEventforAccountw = new CheckOutEvent(streamingServiceHuluforaccount2,
//                streamingEventavailbleforaccount2,
//                new Date(System.currentTimeMillis()),((PayPerViewEvent)streamingEventavailbleforaccount2).price);
//        account1.checkOut(checkOutEventforAccountw);
//
//        System.out.println(studioServiceFox.getPriceByMonth(YearMonth.now()).getPrice());
//        System.out.println(studioServiceSony.getPriceByMonth(YearMonth.now()).getPrice());
//        System.out.println(streamingServiceNetflix.getPriceByMonth(YearMonth.now()).getPrice());
//        System.out.println(streamingServiceHulu.getPriceByMonth(YearMonth.now()).getPrice());
//        System.out.println(demographicGroup1.getPriceByMonth(YearMonth.now()).getPrice());
//
//    }
}
