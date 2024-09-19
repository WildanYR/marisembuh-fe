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

export const formatISOStringDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return DateTime.fromJSDate(date).toISO();
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

export const getRelativeTimeStatus = (date: Date) => {
  // Mendapatkan timestamp saat ini dan tanggal input
  const sekarang = Date.now();
  const waktuInput = date.getTime();

  // Menghitung selisih waktu dalam milidetik
  const selisih = sekarang - waktuInput;

  // Konversi ke berbagai satuan waktu
  const detik = Math.floor(selisih / 1000);
  const menit = Math.floor(detik / 60);
  const jam = Math.floor(menit / 60);
  const hari = Math.floor(jam / 24);
  const bulan = Math.floor(hari / 30);
  const tahun = Math.floor(bulan / 12);

  // Menentukan status waktu relatif
  if (detik < 60) {
    return "baru saja";
  } else if (menit < 60) {
    return `${menit} menit yang lalu`;
  } else if (jam < 24) {
    return `${jam} jam yang lalu`;
  } else if (hari < 30) {
    return `${hari} hari yang lalu`;
  } else if (bulan < 12) {
    return `${bulan} bulan yang lalu`;
  } else {
    return `${tahun} tahun yang lalu`;
  }
};
