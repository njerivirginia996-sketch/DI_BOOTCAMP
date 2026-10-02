function timeUntilNextHoliday(now = new Date()) {
  const holidays = [
    { name: "New Year's Day", month: 0, day: 1 },
    { name: 'Christmas Day', month: 11, day: 25 },
  ];

  let nextHoliday = holidays
    .map((holiday) => ({
      name: holiday.name,
      date: new Date(now.getFullYear(), holiday.month, holiday.day),
    }))
    .filter((holiday) => holiday.date > now)
    .sort((first, second) => first.date - second.date)[0];

  if (!nextHoliday) {
    const holiday = holidays[0];
    nextHoliday = {
      name: holiday.name,
      date: new Date(now.getFullYear() + 1, holiday.month, holiday.day),
    };
  }

  const totalSeconds = Math.floor((nextHoliday.date - now) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const today = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Today is ${today}. The next holiday is ${nextHoliday.name} on ${nextHoliday.date.toLocaleDateString('en-US')}, in ${days} days and ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} hours.`;
}

module.exports = timeUntilNextHoliday;