let allBoldItems = [];

function getBoldItems() {
  const paragraph = document.querySelector('#sentence');
  allBoldItems = paragraph ? paragraph.querySelectorAll('strong') : [];
}

function highlight() {
  allBoldItems.forEach((item) => {
    item.style.color = 'blue';
  });
}

function returnItemsToDefault() {
  allBoldItems.forEach((item) => {
    item.style.color = 'black';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getBoldItems();

  const paragraph = document.querySelector('#sentence');
  if (paragraph) {
    paragraph.addEventListener('mouseover', highlight);
    paragraph.addEventListener('mouseout', returnItemsToDefault);
  }
});
