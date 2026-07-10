export type TodayContext = {
  dateLabel: string;
  dayLabel: string;
  timeLabel: string;
};

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit"
});

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "long"
});

export function getTodayContext(date = new Date()): TodayContext {
  return {
    dateLabel: dateFormatter.format(date),
    dayLabel: dayFormatter.format(date),
    timeLabel: timeFormatter.format(date)
  };
}

export function startMinuteTicker(onTick: (context: TodayContext) => void) {
  onTick(getTodayContext());
  return setInterval(() => onTick(getTodayContext()), 60_000);
}
