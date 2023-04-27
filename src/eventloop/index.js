let current = null;
class EventList {
  constructor() {
    this.eventList = [];
  }
}

export function getEventList() {
  if (current) {
    return current;
  }
  return new EventList();
}
