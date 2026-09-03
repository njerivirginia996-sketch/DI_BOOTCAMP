document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('emailForm');
  const emailInput = document.getElementById('email');
  const message = document.getElementById('message');

  if (!form || !emailInput || !message) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(email)) {
      message.textContent = 'Valid email address';
      message.style.color = 'green';
    } else {
      message.textContent = 'Invalid email address';
      message.style.color = 'red';
    }
  });
});
