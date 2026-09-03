document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const clearButton = document.getElementById('clear');

  if (!container) return;

  setTimeout(() => {
    alert('Hello World');
  }, 2000);

  setTimeout(() => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Hello World';
    container.appendChild(paragraph);
  }, 2000);

  let intervalId = setInterval(() => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Hello World';
    container.appendChild(paragraph);

    if (container.querySelectorAll('p').length >= 5) {
      clearInterval(intervalId);
    }
  }, 2000);

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      clearInterval(intervalId);
    });
  }
});
