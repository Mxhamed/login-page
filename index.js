"use strict";

/* ------------------------------ /
/ Global Scope /
/ ------------------------------ */
const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
const emails = new Set(JSON.parse(localStorage.getItem("emails"))) || new Set();
const isGithub = window.location.hostname.includes("github.io");
let currentAccount = JSON.parse(localStorage.getItem("currentAccount"));

class Account {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

// Email & Password Regex Validation
function validateEmail(emailInput) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = emailInput.value.trim();

  !emailRegex.test(email)
    ? emailInput.setCustomValidity(
        "Enter a Valid Email Address (e.g. user@example.com)"
      )
    : emailInput.setCustomValidity("");

  return emailRegex.test(email);
}
function validatePassword(passwordInput) {
  const password = passwordInput.value;

  if (password.length < 8) {
    passwordInput.setCustomValidity(
      "Password MUST be at least 8 Characters Long"
    );
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    passwordInput.setCustomValidity(
      "Password MUST Contain at Least One Uppercase Letter"
    );
    return false;
  }
  if (!/[a-z]/.test(password)) {
    passwordInput.setCustomValidity(
      "Password MUST Contain at Least One Lowercase Letter"
    );
    return false;
  }
  if (!/[0-9]/.test(password)) {
    passwordInput.setCustomValidity(
      "Password MUST Contain at Least One Number"
    );
    return false;
  }
  if (!/[@$!%*?&]/.test(password)) {
    passwordInput.setCustomValidity(
      "Password MUST Contain at Least One Special Character (@$!%*?&)"
    );
    return false;
  }

  // If ALL Checks Pass
  passwordInput.setCustomValidity("");
  return true;
}

/* ------------------------------ /
/ Registration Page /
/ ------------------------------ */
// Pulling DOM Elements
const regForm = document.getElementById("regForm");
const regFName = document.getElementById("regFName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const regSubmitBtn = document.getElementById("regSubmitBtn");

// Helper Functions
const uniqueEmail = () =>
  emails.has(regEmail.value.trim())
    ? regEmail.setCustomValidity("Email Already in Use")
    : regEmail.setCustomValidity("");

const matchingPasswords = () =>
  regPassword.value === regConfirmPassword.value
    ? regConfirmPassword.setCustomValidity("")
    : regConfirmPassword.setCustomValidity("Passwords MUST Match");

// Event Handlers
regEmail?.addEventListener("input", function () {
  validateEmail(this) && uniqueEmail();
});
regPassword?.addEventListener("input", function () {
  validatePassword(this) && matchingPasswords();
});
regConfirmPassword?.addEventListener("input", matchingPasswords);

regSubmitBtn?.addEventListener("click", (e) => {
  // Form Validation
  if (!regForm.checkValidity()) return;
  e.preventDefault();

  // Store Data
  const email = regEmail.value.trim();
  console.log(email);
  accounts.push(new Account(regFName.value, email, regPassword.value));
  emails.add(email);
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("emails", JSON.stringify([...emails]));

  // Clear Form
  regFName.value =
    regEmail.value =
    regPassword.value =
    regConfirmPassword.value =
      "";

  // Redirect
  window.location.href = `
  ${window.location.origin}/${isGithub ? "login-page" : ""}/index.html
  `;
});

/* ------------------------------ /
/ Login Page /
/ ------------------------------ */
// Pulling DOM Elements
const mainForm = document.getElementById("mainForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

const checkEmailExistence = () => {
  emails.has(loginEmail.value.trim());

  if (emails.has(loginEmail.value.trim())) {
    loginEmail.setCustomValidity("");
    return true;
  } else {
    loginEmail.setCustomValidity(
      "The Email Address you're Trying to Use isn't yet Registered!"
    );
    return false;
  }
};
const isCorrectPassword = () => {
  const email = loginEmail.value.trim();
  accounts.find((acc) => acc.email === email).password === loginPassword.value
    ? loginPassword.setCustomValidity("")
    : loginPassword.setCustomValidity("Incorrect Password");
};

// Event Handlers
loginEmail?.addEventListener("input", function () {
  validateEmail(this) && checkEmailExistence();
});
loginPassword?.addEventListener("input", function () {
  validatePassword(this) && checkEmailExistence() && isCorrectPassword();
});

loginSubmitBtn?.addEventListener("click", (e) => {
  if (!mainForm.checkValidity()) return;
  e.preventDefault();

  // Current Logged User
  const email = loginEmail.value.trim();
  currentAccount = accounts.find((acc) => acc.email === email);
  localStorage.setItem("currentAccount", JSON.stringify(currentAccount));

  // Clear Form
  loginEmail.value = loginPassword.value = "";

  // Redirect
  window.location.href = `
  ${window.location.origin}/${isGithub ? "login-page" : ""}/home.html`;
});

/* ------------------------------ /
/ Homepage /
/ ------------------------------ */
const wlcMsg = document.getElementById("wlcMsg");
wlcMsg?.insertAdjacentHTML(
  "afterbegin",
  `<h1>Welcome
  ${currentAccount.name[0].toUpperCase() + currentAccount.name.slice(1)}
  </h1>`
);
