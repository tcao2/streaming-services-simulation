package com.model.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.Admin;
import com.model.checkOut.CheckOutEvent;
import com.model.security.*;
import com.model.event.Event;
import com.model.event.StudioEvent;
import com.model.event.StudioMovieEvent;
import com.model.event.StudioPPVEvent;
import com.model.input.OfferMovie;
import com.model.input.OfferPPV;
import com.model.input.RetractMovie;
import com.model.input.WatchEvent;
import com.model.output.DisplayDemo;
import com.model.output.StreamingServiceList;
import com.model.output.StudioServiceList;
import com.model.price.Price;
import com.model.service.StreamingService;
import com.model.service.StudioService;
import com.model.user.Account;
import com.model.user.DemographicGroup;
import com.model.util.DateUtil;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.*;


@CrossOrigin
@RestController
@SpringBootApplication
public class StreamingServiceController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private MyUserDetailService userDetailsService;


    HashMap<String, DemographicGroup> demo_map = new HashMap<>();
    HashMap<String, StudioService> studio_map = new HashMap<>();
    HashMap<String, StreamingService> streamService_map = new HashMap<>();

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    @ApiOperation(value = "API to generate authentication token")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        String username = authenticationRequest.getUsername();
        String role = authenticationRequest.getRole();
        if (username.equals("admin") && role.equals("admin") ||
                demo_map.containsKey(username) && role.equals("demo") ||
                studio_map.containsKey(username) && role.equals("studio") ||
                streamService_map.containsKey(username) && role.equals("stream")) {
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
                );
            } catch (BadCredentialsException e) {
                throw new Exception("Incorrect username or password", e);
            }
            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(authenticationRequest.getUsername());
            final String jwt = jwtTokenUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthenticationResponse(jwt, authenticationRequest.getUsername()));
        } else throw new UsernameNotFoundException("Provided username is not a valid one.");
    }


    @PostMapping(value = "/demographicGroup")
    @ApiOperation(value = "Create a Demographic Group with the initial account size")
    public Boolean create_demo(@RequestBody DemographicGroup demographicGroup) throws Exception {
        if (!this.demo_map.containsKey(demographicGroup.shortName)) {
            demographicGroup.dateCreated = DateUtil.getDate();
            for (int i = 0; i < demographicGroup.getInitAccountSize(); i++) {
                Account account = new Account("suman", "suman", "ssss", i, DateUtil.getDate());
                demographicGroup.accountList.add(account);
            }
            demo_map.put(demographicGroup.shortName, demographicGroup);
            return true;
        }
        return false;
    }

    @PostMapping(value = "/updatedemographicGroup")
    @ApiOperation(value = "Update a Demographic Group")
    public Boolean update_demo(@RequestBody DemographicGroup demographicGroup) throws Exception {
        if (this.demo_map.containsKey(demographicGroup.shortName)) {
            DemographicGroup existingDemoGroup = this.demo_map.get(demographicGroup.shortName);
            existingDemoGroup.updateDemographicGroup(demographicGroup, DateUtil.getYearMonth(), DateUtil.getDate());
            return true;
        }
        return false;
    }


    @GetMapping(value = "/demographicGroup")
    @ApiOperation(value = "View the Demographic group information")
    public String get_demo(@RequestParam(value = "name") String name)
            throws Exception {
        DemographicGroup demographicGroup = demo_map.get(name);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(demographicGroup);
    }


    @GetMapping(value = "/displayTime")
    @ApiOperation(value = "Displays the current month and year the system is being configured to")
    public String displayTime()
            throws Exception {
        return DateUtil.localDate.getMonthValue() + "/" + DateUtil.localDate.getYear();
    }

    @GetMapping(value = "/nextTime")
    @ApiOperation(value = "Updates the current month  by one")
    public String nextDate()
            throws Exception {
        return DateUtil.nextDate();
    }


    @PostMapping(value = "/studioService")
    @ApiOperation(value = "Creates and updates the Studio Service")
    public Boolean createStudioService(@RequestBody StudioService studioService) throws Exception {
        studioService.dateCreated = DateUtil.getDate();
        if (!studio_map.containsKey(studioService.shortName)) {
            studio_map.put(studioService.shortName, studioService);
            return true;
        }
        return false;
    }

    @GetMapping(value = "/studioService")
    @ApiOperation(value = "Displays the Studio Service Information")
    public String getStudiService(@RequestParam(value = "name") String name)
            throws Exception {
        StudioService studioService = studio_map.get(name);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(studioService.display(DateUtil.getYearMonth()));
    }

    @PostMapping(value = "/studio/event/movie")
    @ApiOperation(value = "Creates the event (Movie) for a given Studio Service")
    public Boolean createStudioEvent(@RequestBody com.model.input.StudioMovieEvent studioMovieEvent) throws Exception {
        if (studio_map.containsKey(studioMovieEvent.studioName)) {
            StudioService studioService = studio_map.get(studioMovieEvent.studioName);
            if (!studioService.validateIfEventExists(studioMovieEvent.event.shortName,
                    studioMovieEvent.event.year)) {
                StudioMovieEvent studioMovieEvent1 = new StudioMovieEvent(studioMovieEvent.event.shortName,
                        studioMovieEvent.event.longName, studioMovieEvent.event.dateCreated,
                        studioMovieEvent.event.year, Integer.parseInt(studioMovieEvent.event.duration),
                        new Price(Double.parseDouble(studioMovieEvent.event.licensePrice))
                        , Admin.number++);
                studioService.studioevents.add(studioMovieEvent1);
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    @PostMapping(value = "/studio/event/movie/update")
    @ApiOperation(value = "Updates the event (Movie) for a given Studio Service")
    public Boolean updateStudioEvent(@RequestBody com.model.input.StudioMovieEvent studioMovieEvent) throws Exception {
        if (studio_map.containsKey(studioMovieEvent.studioName)) {
            StudioService studioService = studio_map.get(studioMovieEvent.studioName);
            for (Iterator<Event> it = studioService.studioevents.iterator(); it.hasNext(); ) {
                Event studioEvent = it.next();
                if (studioEvent.shortName.equals(studioMovieEvent.event.shortName) &&
                        studioEvent.year.equals(studioMovieEvent.event.year)) {
                    if (checkifEventWatchedByDems(studioMovieEvent.event.shortName, studioMovieEvent.event.year)) {
                        if (Double.parseDouble(studioMovieEvent.event.licensePrice) != ((StudioEvent) studioEvent).licensePrice.getPrice()) {
                            return false;
                        }
                    }
                    it.remove();
                    StudioMovieEvent studioMovieEvent1 = new StudioMovieEvent(studioMovieEvent.event.shortName,
                            studioMovieEvent.event.longName, studioMovieEvent.event.dateCreated,
                            studioMovieEvent.event.year, Integer.parseInt(studioMovieEvent.event.duration),
                            new Price(Double.parseDouble(studioMovieEvent.event.licensePrice)), Admin.number++);
                    studioService.studioevents.add(studioMovieEvent1);
                    break;
                }
            }
        }
        return true;
    }


    @PostMapping(value = "/studio/event/ppv/update")
    @ApiOperation(value = "Updates the event (PPV) for a given Studio Service")
    public Boolean updatePPVEvent(@RequestBody com.model.input.StudioMovieEvent studioMovieEvent)
            throws Exception {
        if (studio_map.containsKey(studioMovieEvent.studioName)) {
            StudioService studioService = studio_map.get(studioMovieEvent.studioName);
            for (Iterator<Event> it = studioService.studioevents.iterator(); it.hasNext(); ) {
                Event studioEvent = it.next();
                if (studioEvent.shortName.equals(studioMovieEvent.event.shortName) &&
                        studioEvent.year.equals(studioMovieEvent.event.year)) {
                    if (checkifEventWatchedByDems(studioMovieEvent.event.shortName, studioMovieEvent.event.year)) {
                        if (Double.parseDouble(studioMovieEvent.event.licensePrice) != ((StudioEvent) studioEvent).licensePrice.getPrice()) {
                            return false;
                        }
                    }
                    it.remove();
                    StudioPPVEvent studioMovieEvent1 = new StudioPPVEvent(studioMovieEvent.event.shortName,
                            studioMovieEvent.event.longName, studioMovieEvent.event.dateCreated,
                            studioMovieEvent.event.year, Integer.parseInt(studioMovieEvent.event.duration),
                            new Price(Double.parseDouble(studioMovieEvent.event.licensePrice)), Admin.number++);
                    studioService.studioevents.add(studioMovieEvent1);
                    break;
                }
            }
        }
        return true;
    }


    @PostMapping(value = "/studio/event/ppv")
    @ApiOperation(value = "Creates the event (PPV) for a given Studio Service")
    public Boolean createPPVEvent(@RequestBody com.model.input.StudioMovieEvent event) throws Exception {
        if (studio_map.containsKey(event.studioName)) {
            StudioService studioService = studio_map.get(event.studioName);
            if (!studioService.validateIfEventExists(event.event.shortName,
                    event.event.year)) {
                StudioPPVEvent studioPPVEvent = new StudioPPVEvent(event.event.shortName,
                        event.event.longName, event.event.dateCreated,
                        event.event.year, Integer.parseInt(event.event.duration),
                        new Price(Double.parseDouble(event.event.licensePrice))
                        , Admin.number++);
                studio_map.get(event.studioName).studioevents.add(studioPPVEvent);
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    @PostMapping(value = "/streamingService")
    @ApiOperation(value = "Creates the Streaming service")
    public Boolean createStreamingService(@RequestBody com.model.input.StreamingService streamingService) throws Exception {
        if (!streamService_map.containsKey(streamingService.shortName)) {
            StreamingService streamingService1 = new StreamingService(streamingService.shortName, streamingService.longName,
                    DateUtil.getDate(), streamingService.getMonthlySubscriptionRate());
            streamService_map.put(streamingService.shortName, streamingService1);
            return true;
        }
        return false;
    }

    @PostMapping(value = "/updateStreamingService")
    @ApiOperation(value = "Updates the Streaming service")
    public Boolean updateStreamingService(@RequestBody com.model.input.StreamingService streamingService) throws Exception {
        if (streamService_map.containsKey(streamingService.shortName)) {
            StreamingService existingStreamingService = streamService_map.get(streamingService.shortName);
            existingStreamingService.longName = streamingService.longName;
            if (existingStreamingService.getPriceByMonth(DateUtil.getYearMonth()).getPrice() == 0) {
                existingStreamingService.monthlySubscriptionRate = streamingService.getMonthlySubscriptionRate();
            }
            return true;
        }
        return false;
    }

    @GetMapping(value = "/streamingService")
    @ApiOperation(value = "Displays the Streaming service information")
    public String getStreamingService(@RequestParam(value = "name") String name)
            throws Exception {
        StreamingService streamingService = streamService_map.get(name);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(streamingService.display(DateUtil.getYearMonth()));
    }

    @PostMapping(value = "/offerMovie")
    @ApiOperation(value = "Studio Offers movie to the Streaming service")
    public Boolean offerMovieToStreamingService(@RequestBody OfferMovie offerMovie) throws Exception {
        StudioService studioService = studio_map.get(offerMovie.studio);
        StreamingService streamingService = streamService_map.get(offerMovie.streamingService);
        studioService.studioevents.forEach(event -> {
            try {
                if (event.shortName.equals(offerMovie.movie) && event.year.equals(offerMovie.year)) {
                    CheckOutEvent checkOutEvent = new CheckOutEvent(studioService, event, DateUtil.getDate(), ((StudioMovieEvent) event).licensePrice);
                    streamingService.checkOutMovie(checkOutEvent);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        return true;
    }

    @PostMapping(value = "/offerPPV")
    @ApiOperation(value = "Studio Offers PPV to the Streaming service")
    public Boolean offerPPVToStreamingService(@RequestBody OfferPPV offerPPV) throws Exception {
        StudioService studioService = studio_map.get(offerPPV.studio);
        StreamingService streamingService = streamService_map.get(offerPPV.streamingService);
        studioService.studioevents.forEach(event -> {
            try {
                if (event.shortName.equals(offerPPV.ppv) && event.year.equals(offerPPV.year)) {
                    CheckOutEvent checkOutEvent = new CheckOutEvent(studioService, event, DateUtil.getDate(), ((StudioPPVEvent) event).licensePrice);
                    streamingService.checkOutPPV(checkOutEvent, new Price(Double.
                            parseDouble(offerPPV.price)));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        return true;
    }

    @PostMapping(value = "/watchEvent")
    @ApiOperation(value = "Demographic groups watches the event from Streaming Service")
    public Boolean watchEvent(@RequestBody WatchEvent watchEvent) throws Exception {
        if (demo_map.containsKey(watchEvent.demographicGroup) &&
                streamService_map.containsKey(watchEvent.streamingService) && null !=
                streamService_map.get(watchEvent.streamingService).
                        getEvent(watchEvent.eventName, watchEvent.yearProduced, DateUtil.getYearMonth())) {
            DemographicGroup demographicGroup = demo_map.get(watchEvent.demographicGroup);
            StreamingService streamingService = streamService_map.get(watchEvent.streamingService);
            Event event = streamingService.getEvent(watchEvent.eventName,
                    watchEvent.yearProduced, DateUtil.getYearMonth());
            demographicGroup.watchEvent(watchEvent.percentage, streamingService, event, DateUtil.getDate());
        }
        return true;
    }

    @PostMapping(value = "/retractMovie")
    @ApiOperation(value = "Retracts the the movie from StreamingService if not watched by Demographic group")
    public Boolean retractMovie(@RequestBody RetractMovie retractMovie) throws Exception {
        if (this.streamService_map.containsKey(retractMovie.streamingService)) {
            StreamingService streamingService = this.streamService_map.get(retractMovie.streamingService);
            if (!checkifEventWatchedByDems(retractMovie.movie, retractMovie.year)) {
                streamingService.retractEvent(retractMovie.movie, retractMovie.year, DateUtil.getYearMonth());
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    public boolean checkifEventWatchedByDems(String movie, Date year) {
        for (Map.Entry<String, DemographicGroup> entry : this.demo_map.entrySet()) {
            DemographicGroup demographicGroup = entry.getValue();
            if (demographicGroup.checkIfEventWatched(movie, year)) {
                return true;
            }
        }
        return false;
    }

    @GetMapping(value = "/displayDemo")
    @ApiOperation(value = "Displays DemoGraphic Group Information")
    public String dispalyDemo(@RequestParam(value = "name") String name)
            throws Exception {
        DemographicGroup demographicGroup = demo_map.get(name);
        DisplayDemo displayDemo = new DisplayDemo();
        displayDemo.setShortName(demographicGroup.shortName);
        displayDemo.setLongName(demographicGroup.longName);
        displayDemo.setCurrent_month(demographicGroup.getPriceByMonth(DateUtil.getYearMonth()).getPrice());
        displayDemo.setPrevious_month(demographicGroup.getPriceByMonth(DateUtil.getYearMonth().minus(1, ChronoUnit.MONTHS)).
                getPrice());
        displayDemo.setSize(demographicGroup.accountList.size());
        displayDemo.setTotal(demographicGroup.getTotalHistoryPrice(DateUtil.getYearMonth()).getPrice());
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(displayDemo);
    }

    @GetMapping(value = "/displayAllStudio")
    @ApiOperation(value = "List API to provide all the Studio information")
    public String displayAllStudio()
            throws Exception {
        StudioServiceList studioServiceList = new StudioServiceList();
        for (String sre : this.studio_map.keySet()) {
            studioServiceList.studioServices.add(
                    this.studio_map.get(sre).display(DateUtil.getYearMonth()));
        }
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(studioServiceList);
    }

    @ApiOperation(value = "List API to provide all the Streaming Service information")
    @GetMapping(value = "/displayAllStreamingService")
    public String displayAllStreamingService()
            throws Exception {
        StreamingServiceList streamingServiceList = new StreamingServiceList();
        for (String sre : this.streamService_map.keySet()) {
            streamingServiceList.streamingServices.add(
                    this.streamService_map.get(sre).display(DateUtil.getYearMonth()));
        }
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(streamingServiceList);
    }

    @ApiOperation(value = "List API to provide all the Demographic Group information")
    @GetMapping(value = "/displayAllDemoGraphicGroup")
    public String displayAllDemoGroup()
            throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(this.demo_map);
    }

}

