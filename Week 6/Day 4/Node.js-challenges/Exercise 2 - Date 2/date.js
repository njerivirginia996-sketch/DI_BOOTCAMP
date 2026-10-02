function minutesLived(birthdate) {
  const birthDate = new Date(birthdate);

  if (Number.isNaN(birthDate.getTime())) {
    throw new TypeError('Please provide a valid birthdate.');
  }

  const minutes = Math.floor((Date.now() - birthDate.getTime()) / 60000);

  if (minutes < 0) {
    throw new RangeError('Birthdate cannot be in the future.');
  }

  return minutes;
}

module.exports = minutesLived;