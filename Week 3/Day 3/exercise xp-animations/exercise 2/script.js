document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const animate = document.getElementById('animate');
  const moveBtn = document.getElementById('moveBtn');

  if (!container || !animate || !moveBtn) return;

  let position = 0;
  let intervalId = null;

  function myMove() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      if (position >= container.clientWidth - animate.clientWidth) {
        clearInterval(intervalId);
        return;
      }

      position += 1;
      animate.style.left = position + 'px';
    }, 1);
  }

  moveBtn.addEventListener('click', myMove);
});
