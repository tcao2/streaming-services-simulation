const EVENT_TYPE = {
  MOVIE: "Movie",
  PPV: "PPV",
};

class Event {
  constructor(type, name, yearProduced, duration, studio, licenseFee) {
    this.type = type;
    this.name = name;
    this.yearProduced = yearProduced;
    this.duration = duration;
    this.studio = studio;
    this.licenseFee = licenseFee;
  }
}

export default { Event, EVENT_TYPE };
