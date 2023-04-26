let current = null;
class EventList {
  constructor() {}
}

export function getEventList() {
  if (current) {
    return current;
  }
  return new EventList();
}
