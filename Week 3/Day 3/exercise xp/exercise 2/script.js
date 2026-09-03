document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  console.log(form);

  const firstNameInput = document.getElementById('fname');
  const lastNameInput = document.getElementById('lname');
  console.log(firstNameInput);
  console.log(lastNameInput);

  const firstNameByName = document.getElementsByName('firstname')[0];
  const lastNameByName = document.getElementsByName('lastname')[0];
  console.log(firstNameByName);
  console.log(lastNameByName);

  const answerList = document.querySelector('.usersAnswer');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const firstNameValue = firstNameInput.value.trim();
    const lastNameValue = lastNameInput.value.trim();

    if (!firstNameValue || !lastNameValue) {
      return;
    }

    answerList.innerHTML = '';

    const firstNameItem = document.createElement('li');
    firstNameItem.textContent = firstNameValue;
    answerList.appendChild(firstNameItem);

    const lastNameItem = document.createElement('li');
    lastNameItem.textContent = lastNameValue;
    answerList.appendChild(lastNameItem);
  });
});
