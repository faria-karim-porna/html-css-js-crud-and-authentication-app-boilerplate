let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
let deleteIndex = null;

function showToast(message, type = "info") {
  const toastEl = document.getElementById("toast");
  const toastBody = document.getElementById("toast-body");

  // Set message and styling
  toastBody.innerText = message;
  toastEl.className = `toast d-flex justify-content-center align-items-center text-bg-${type === "error" ? "secondary" : "dark"} border-0`;

  // Show with slide-fade animation
  setTimeout(() => {
    toastEl.classList.add("show");
  }, 10); // tiny delay to trigger CSS transition

  // Hide after 1.5s
  setTimeout(() => {
    toastEl.classList.add("hideing");
    toastEl.classList.remove("show");

    // Fully hide it after transition ends (cleanup)
    setTimeout(() => {
      toastEl.classList.remove("hideing");
    }, 400); // match CSS transition time
  }, 1500);
}

// ---------- Register ----------
function register() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  if (users.find((u) => u.email === email)) {
    showToast("User already exists!", "error");
    return;
  }

  users.push({ name, email, password, items: [] });
  localStorage.setItem("users", JSON.stringify(users));
  showToast("Registered Successfully!!", "success");
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
    showToast(`Welcome ${user.name}!`);
  } else {
    showToast("Invalid credentials", "error");
  }
}

// ---------- Forgot ----------
function sendReset() {
  const email = document.getElementById("forgot-email").value;
  const user = users.find((u) => u.email === email);
  if (user) {
    showToast("Reset link sent (simulated). Go to Reset Password page.");
    window.location.href = "reset.html";
  } else {
    showToast("Email not found.", "error");
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
    showToast("Password reset successful!");
    window.location.href = "login.html";
  } else {
    showToast("Email not found.", "error");
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
  showToast("Logged out successfully");
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

  showToast("User added successfully", "success");
}

function renderUsers() {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  (currentUser.items || []).forEach((u, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="align-middle">${i + 1}</td>
    <td class="align-middle">${u.name}</td>
    <td class="align-middle">${u.email}</td>
    <td class="align-middle">${u.role}</td>
    <td class="d-flex align-middle">
      <button class="btn btn-sm btn-dark me-1" onclick="editUser(${i})">Edit</button>
      <button class="btn btn-sm btn btn-outline-dark" onclick="deleteUser(${i})">Delete</button>
    </td>
`;
    tbody.appendChild(row);
  });
}

function editUser(index) {
  const tbody = document.querySelector("#userTable tbody");
  const row = tbody.children[index];
  const user = currentUser.items[index];

  // Store original user temporarily in the row’s dataset
  row.dataset.original = JSON.stringify(user);

  // Replace text cells with input fields
  row.innerHTML = `
    <td class="align-middle">${index + 1}</td>
    <td class="align-middle"><input type="text" class="form-control form-control-sm" value="${user.name}" /></td>
    <td class="align-middle"><input type="email" class="form-control form-control-sm" value="${user.email}" /></td>
    <td class="align-middle"><input type="text" class="form-control form-control-sm" value="${user.role}" /></td>
    <td class="align-middle d-flex gap-1">
      <button class="btn btn-sm btn-dark" onclick="saveUser(${index})">Save</button>
      <button class="btn btn-sm btn-outline-secondary" onclick="cancelEdit(${index})">Cancel</button>
    </td>
  `;
}

function cancelEdit(index) {
  const tbody = document.querySelector("#userTable tbody");
  const row = tbody.children[index];

  // Re-render the row using saved data
  const original = JSON.parse(row.dataset.original);

  row.innerHTML = `
    <td class="align-middle">${index + 1}</td>
    <td class="align-middle">${original.name}</td>
    <td class="align-middle">${original.email}</td>
    <td class="align-middle">${original.role}</td>
    <td class="d-flex align-middle">
      <button class="btn btn-sm btn-dark me-1" onclick="editUser(${index})">Edit</button>
      <button class="btn btn-sm btn-outline-dark" onclick="deleteUser(${index})">Delete</button>
    </td>
  `;
}

function saveUser(index) {
  const tbody = document.querySelector("#userTable tbody");
  const row = tbody.children[index];

  const name = row.children[1].querySelector("input").value.trim();
  const email = row.children[2].querySelector("input").value.trim();
  const role = row.children[3].querySelector("input").value.trim();

  if (!name || !email || !role) {
    showToast("All fields are required.", "error");
    return;
  }

  currentUser.items[index] = { name, email, role };
  updateUser(currentUser);
  renderUsers();
  showToast("User updated successfully", "info");
}

function deleteUser(index) {
  deleteIndex = index;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  modal.show();
}

function confirmDeleteUser(index) {
  if (deleteIndex !== null) {
    currentUser.items.splice(deleteIndex, 1);
    updateUser(currentUser);
    renderUsers();
    showToast("User deleted successfully");
    deleteIndex = null;
  }

  // Hide modal manually
  const modalEl = document.getElementById("confirmDeleteModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
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
