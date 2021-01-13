package com.model.input;

import java.util.Date;

public class StudioEvent {

    public String shortName;
    public String longName;
    public Date dateCreated;
    public Date year;
    public String duration;
    public String licensePrice;

    public String getLicensePrice() {
        return licensePrice;
    }

    public void setLicensePrice(String licensePrice) {
        this.licensePrice = licensePrice;
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

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getYear() {
        return year;
    }

    public void setYear(Date year) {
        this.year = year;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
