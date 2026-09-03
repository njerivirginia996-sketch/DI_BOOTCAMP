document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('getLocationBtn');
  const output = document.getElementById('location');

  if (!button || !output) return;

  button.addEventListener('click', () => {
    if (!navigator.geolocation) {
      output.textContent = 'Geolocation is not supported by this browser.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        output.textContent = `Latitude: ${latitude}\nLongitude: ${longitude}`;
      },
      () => {
        output.textContent = 'Unable to get your location.';
      }
    );
  });
});
