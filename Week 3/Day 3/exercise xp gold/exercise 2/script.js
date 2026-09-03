document.addEventListener('DOMContentLoaded', () => {
  const colorSelect = document.getElementById('colorSelect');
  const removeButton = document.getElementById('removeBtn');

  if (!colorSelect || !removeButton) return;

  function removecolor() {
    const selectedIndex = colorSelect.selectedIndex;

    if (selectedIndex >= 0) {
      colorSelect.remove(selectedIndex);
    }
  }

  removeButton.addEventListener('click', removecolor);
});
