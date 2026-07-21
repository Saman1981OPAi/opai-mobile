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

export function getTimeAwareGreeting(firstName: string, date = new Date()) {
  const hour = date.getHours();
  const period =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : hour >= 17 && hour < 22
          ? "Good evening"
          : "Good night";
  const displayName = firstName.trim() || "Officer";

  return `${period} ${displayName}`;
}

export function startMinuteTicker(onTick: (context: TodayContext) => void) {
  onTick(getTodayContext());
  return setInterval(() => onTick(getTodayContext()), 60_000);
}
