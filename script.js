let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

// ---------- Register ----------
function register() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return;
  }

  users.push({ name, email, password, items: [] });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered successfully!");
  window.location.href = "login.html";
}

// ---------- Login ----------
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}

// ---------- Forgot ----------
function sendReset() {
  const email = document.getElementById("forgot-email").value;
  const user = users.find((u) => u.email === email);
  if (user) {
    alert("Reset link sent (simulated). Go to Reset Password page.");
    window.location.href = "reset.html";
  } else {
    alert("Email not found.");
  }
}

// ---------- Reset ----------
function resetPassword() {
  const email = document.getElementById("reset-email").value;
  const newPassword = document.getElementById("new-password").value;
  const user = users.find((u) => u.email === email);
  if (user) {
    user.password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Password reset successful!");
    window.location.href = "login.html";
  } else {
    alert("Email not found.");
  }
}

// ---------- Dashboard ----------
function showDashboard() {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("username").innerText = currentUser.name;
  renderUsers();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function addUser() {
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  const role = document.getElementById("userRole").value;

  if (!name || !email || !role) return;

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

  (currentUser.items || []).forEach((u, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>
        <button class="edit-btn" onclick="editUser(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteUser(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function editUser(index) {
  const u = currentUser.items[index];
  const name = prompt("Edit name:", u.name);
  const email = prompt("Edit email:", u.email);
  const role = prompt("Edit role:", u.role);

  if (name && email && role) {
    currentUser.items[index] = { name, email, role };
    updateUser(currentUser);
    renderUsers();
  }
}

function deleteUser(index) {
  if (confirm("Are you sure?")) {
    currentUser.items.splice(index, 1);
    updateUser(currentUser);
    renderUsers();
  }
}

function updateUser(updated) {
  users = users.map((u) => (u.email === updated.email ? updated : u));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(updated));
}

// Call this only on dashboard page
if (window.location.pathname.endsWith("dashboard.html")) {
  showDashboard();
}
