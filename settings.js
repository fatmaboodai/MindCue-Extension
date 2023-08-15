
// Get references to the checkbox and button
const checkbox = document.getElementById('setting1');
const saveButton = document.getElementById('saveButton');

// Event listener for button click
saveButton.addEventListener('click', () => {
  // Get the checkbox state
  const checkboxState = checkbox.checked;

  // Save the state in localStorage
  localStorage.setItem('checkboxState', JSON.stringify(checkboxState));

  // You can provide user feedback here if you want
  console.log('Checkbox state saved.');
});

// On page load, set the checkbox state if available in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const storedCheckboxState = localStorage.getItem('checkboxState');
  if (storedCheckboxState !== null) {
    const parsedState = JSON.parse(storedCheckboxState);
    checkbox.checked = parsedState;
  }
});

