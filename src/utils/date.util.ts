export const isTimeGreaterThan = (timeString: string, date: Date) => {
  // Mendapatkan waktu dari tanggal yang diberikan
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Mendapatkan waktu dari string yang diberikan
  const splitTime = timeString.split(":");
  const targetHours = parseInt(splitTime[0]);
  const targetMinutes = parseInt(splitTime[1]);
  const targetSeconds = parseInt(splitTime[2]);

  // Membandingkan jam
  if (hours > targetHours) {
    return true;
  } else if (hours < targetHours) {
    return false;
  }

  // Membandingkan menit jika jam sama
  if (minutes > targetMinutes) {
    return true;
  } else if (minutes < targetMinutes) {
    return false;
  }

  // Membandingkan detik jika jam dan menit sama
  if (seconds > targetSeconds) {
    return true;
  } else {
    return false;
  }
};
