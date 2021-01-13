class Event {
  constructor(
    studioShortName,
    studioLongName,
    shortName,
    longName,
    year,
    duration,
    licensePrice,
    type
  ) {
    this.studioShortName = studioShortName;
    this.studioLongName = studioLongName;
    this.shortName = shortName;
    this.longName = longName;
    this.year = year;
    this.duration = duration;
    this.licensePrice = licensePrice;
    this.type = type;
  }
}

export default Event;
