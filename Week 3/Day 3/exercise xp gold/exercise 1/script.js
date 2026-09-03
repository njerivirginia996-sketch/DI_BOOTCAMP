document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('genres');

  if (!select) return;

  const classicOption = document.createElement('option');
  classicOption.value = 'classic';
  classicOption.textContent = 'Classic';
  select.appendChild(classicOption);
  select.value = 'classic';

  console.log(select.value);

  select.addEventListener('change', () => {
    console.log(select.value);
  });
});
