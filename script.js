let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];

function showLogin() {
  showOnly("auth-container");
}

function showRegister() {
  showOnly("register-container");
}

function showForgot() {
  showOnly("forgot-container");
}

function showReset() {
  showOnly("reset-container");
}

function showDashboard() {
  showOnly("dashboard");
  document.getElementById("username").innerText = currentUser.name;
  renderUsers();
}

function showOnly(id) {
  document.querySelectorAll(".container").forEach((div) => div.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function register() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered successfully!");
  showLogin();
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    showDashboard();
  } else {
    alert("Invalid credentials");
  }
}

function sendReset() {
  const email = document.getElementById("forgot-email").value;
  const user = users.find((u) => u.email === email);
  if (user) {
    alert("Reset link sent (simulated). Go to Reset Password.");
    showReset();
  } else {
    alert("Email not found!");
  }
}

function resetPassword() {
  const email = document.getElementById("reset-email").value;
  const newPassword = document.getElementById("new-password").value;

  const user = users.find((u) => u.email === email);
  if (user) {
    user.password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Password reset successful!");
    showLogin();
  } else {
    alert("Email not found!");
  }
}

function logout() {
  currentUser = null;
  showLogin();
}

function addUser() {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value.trim();

  if (!name || !email || !role) {
    alert("Please fill in all fields.");
    return;
  }

  currentUser.items = currentUser.items || [];
  currentUser.items.push({ name, email, role });
  updateUser(currentUser);
  renderUsers();

  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userRole").value = "";
}

function renderUsers() {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  (currentUser.items || []).forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="edit-btn" onclick="editUser(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function editUser(index) {
  const user = currentUser.items[index];
  const newName = prompt("Edit Name:", user.name);
  const newEmail = prompt("Edit Email:", user.email);
  const newRole = prompt("Edit Role:", user.role);

  if (newName && newEmail && newRole) {
    currentUser.items[index] = {
      name: newName,
      email: newEmail,
      role: newRole,
    };
    updateUser(currentUser);
    renderUsers();
  }
}

function deleteUser(index) {
  if (confirm("Are you sure to delete this user?")) {
    currentUser.items.splice(index, 1);
    updateUser(currentUser);
    renderUsers();
  }
}

function updateUser(updated) {
  users = users.map((u) => (u.email === updated.email ? updated : u));
  localStorage.setItem("users", JSON.stringify(users));
}
