function timeUntilNewYear(now = new Date()) {
  const newYear = new Date(now.getFullYear() + 1, 0, 1);
  const totalSeconds = Math.floor((newYear - now) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `January 1st is in ${days} days and ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} hours.`;
}

module.exports = timeUntilNewYear;