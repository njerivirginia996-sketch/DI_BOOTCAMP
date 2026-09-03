function calculateTip() {
  const billAmount = document.getElementById('billAmt').value;
  const serviceQuality = document.getElementById('serviceQual').value;
  let numberOfPeople = document.getElementById('numOfPeople').value;
  const totalTip = document.getElementById('totalTip');
  const tip = document.getElementById('tip');
  const each = document.getElementById('each');

  if (serviceQuality == 0 || billAmount === '') {
    alert('Please enter the bill amount and service quality.');
    return;
  }

  if (numberOfPeople === '' || numberOfPeople < 1) {
    numberOfPeople = 1;
    each.style.display = 'none';
  } else {
    each.style.display = 'block';
  }

  const total = ((Number(billAmount) * Number(serviceQuality)) / Number(numberOfPeople)).toFixed(2);

  totalTip.style.display = 'block';
  tip.textContent = total;
}
