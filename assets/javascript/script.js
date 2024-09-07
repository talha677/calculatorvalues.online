const body = document.querySelector("body"),
  icons = document.querySelectorAll('.icon'),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text"),
  calSide = body.querySelector(".cal-side"),
  calToggle = body.querySelector(".cal-toggle"),
  resultInput = document.querySelector('.calculator__result-primary');

// Call the adjustFontSize function whenever the input value changes
resultInput.addEventListener('input', () => {
  if (resultInput.value.length > 12) {
    resultInput.style.overflowX = 'hidden'; /* Hide scrollbar when input value exceeds 12 characters */
  } else {
    resultInput.style.overflowX = 'auto'; /* Show scrollbar when input value is 12 characters or less */
  }
});


document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
})

calSide.addEventListener("click", () => {
  calToggle.classList.toggle("close1");
});

icons.forEach(icon => {
  icon.addEventListener('click', (e) => {
    icon.classList.toggle("open");
  });
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});


