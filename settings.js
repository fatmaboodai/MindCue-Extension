// Define a function to handle local storage for checkbox state
function handleCheckboxState(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
  
    // Retrieve the saved state from local storage
    const savedState = localStorage.getItem(checkboxId + "State");
  
    // Set the checkbox's state based on the saved state
    if (savedState === "ticked") {
      checkbox.checked = true;
    } else if (savedState === "not-ticked") {
      checkbox.checked = false;
    }
  
    // Update local storage with the current checkbox state
    checkbox.addEventListener("change", function () {
      const newState = this.checked ? "ticked" : "not-ticked";
      localStorage.setItem(checkboxId + "State", newState);
    });
  }
  