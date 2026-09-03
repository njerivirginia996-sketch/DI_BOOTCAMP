document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('emailForm');
  const emailInput = document.getElementById('email');
  const message = document.getElementById('message');

  if (!form || !emailInput || !message) return;

  function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;

    const atIndex = email.indexOf('@');
    if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) return false;

    const dotIndex = email.lastIndexOf('.');
    if (dotIndex <= atIndex + 1 || dotIndex === email.length - 1) return false;

    const beforeAt = email.slice(0, atIndex);
    const afterAt = email.slice(atIndex + 1);

    if (!beforeAt || !afterAt) return false;

    const domainPart = afterAt.slice(0, dotIndex - atIndex - 1);
    if (!domainPart) return false;

    const extension = email.slice(dotIndex + 1);
    if (!extension || extension.includes('@') || extension.includes(' ')) return false;

    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-';
    for (const char of beforeAt + afterAt) {
      if (!validChars.includes(char) && char !== '@' && char !== '.') {
        return false;
      }
    }

    return true;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (isValidEmail(email)) {
      message.textContent = 'Valid email address';
      message.style.color = 'green';
    } else {
      message.textContent = 'Invalid email address';
      message.style.color = 'red';
    }
  });
});
