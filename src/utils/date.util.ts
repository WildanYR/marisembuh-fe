import { DateTime, Interval } from "luxon";

export const isTimeGreaterThan = (timeString: string, date: Date | string) => {
  const splitTime = timeString.split(":");
  const targetHours = parseInt(splitTime[0]);
  const targetMinutes = parseInt(splitTime[1]);
  const targetSeconds = parseInt(splitTime[2]);

  if (typeof date === "string") {
    date = new Date(date);
  }
  const dateTime = DateTime.fromJSDate(date);
  const lateLimitDate = dateTime.set({
    hour: targetHours,
    minute: targetMinutes,
    second: targetSeconds,
  });

  return dateTime > lateLimitDate;
};

export const getFilterStartEndISODate = (
  startDate: Date | string,
  endDate: Date | string
) => {
  if (typeof startDate === "string") {
    startDate = new Date(startDate);
  }
  if (typeof endDate === "string") {
    endDate = new Date(endDate);
  }
  return {
    startDate: DateTime.fromJSDate(startDate).startOf("day").toISO(),
    endDate: DateTime.fromJSDate(endDate).endOf("day").toISO(),
  };
};

export const getStartEndOfMonthDate = (date?: Date | string) => {
  let dateTime: DateTime;
  if (date) {
    if (typeof date === "string") {
      date = new Date(date);
    }
    dateTime = DateTime.fromJSDate(date);
  } else {
    dateTime = DateTime.now();
  }

  return {
    startOfMonth: dateTime.startOf("month").startOf("day").toJSDate(),
    endOfMonth: dateTime.endOf("month").endOf("day").toJSDate(),
  };
};

export const formatSQLStringDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
};

export const formatLocaleStringDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return DateTime.fromJSDate(date).toFormat("dd LLLL yyyy");
};

export const formatTimeStringDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return DateTime.fromJSDate(date).toFormat("HH:mm");
};

export const calculateAgeFromBirthdate = (birthdate: Date | string) => {
  if (typeof birthdate === "string") {
    birthdate = new Date(birthdate);
  }
  const today = DateTime.now();
  const birthday = DateTime.fromJSDate(birthdate);
  const interval = Interval.fromDateTimes(birthday, today);
  return Math.floor(interval.length("years"));
};
