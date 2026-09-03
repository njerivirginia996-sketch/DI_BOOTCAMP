let shoppingList = [];

function addItem() {
  const input = document.getElementById('itemInput');
  const value = input.value.trim();

  if (!value) return;

  shoppingList.push(value);
  input.value = '';
  renderList();
}

function clearAll() {
  shoppingList = [];
  renderList();
}

function renderList() {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = '';

  const form = document.createElement('form');
  form.id = 'shoppingForm';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'itemInput';
  input.placeholder = 'Add an item';

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'AddItem';

  form.appendChild(input);
  form.appendChild(addButton);

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.textContent = 'ClearAll';
  clearButton.addEventListener('click', clearAll);

  root.appendChild(form);
  root.appendChild(clearButton);

  const list = document.createElement('ul');

  shoppingList.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  root.appendChild(list);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addItem();
  });
}

document.addEventListener('DOMContentLoaded', renderList);
