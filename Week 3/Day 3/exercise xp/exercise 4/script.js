document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('MyForm');
  const radiusInput = document.getElementById('radius');
  const volumeInput = document.getElementById('volume');

  if (!form || !radiusInput || !volumeInput) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const radius = Number(radiusInput.value);

    if (!Number.isFinite(radius) || radius <= 0) {
      volumeInput.value = 'Invalid radius';
      return;
    }

    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    volumeInput.value = volume.toFixed(2);
  });
});
