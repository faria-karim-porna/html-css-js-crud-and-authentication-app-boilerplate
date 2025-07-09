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
  const name = document.getElementById("newUser").value;
  if (!name) return;
  currentUser.items = currentUser.items || [];
  currentUser.items.push(name);
  updateUser(currentUser);
  renderUsers();
  document.getElementById("newUser").value = "";
}

function renderUsers() {
  const list = document.getElementById("userList");
  list.innerHTML = "";
  (currentUser.items || []).forEach((name, idx) => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => {
      const updated = prompt("Edit name", name);
      if (updated !== null) {
        currentUser.items[idx] = updated;
        updateUser(currentUser);
        renderUsers();
      }
    };
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.style.float = "right";
    del.onclick = (e) => {
      e.stopPropagation();
      currentUser.items.splice(idx, 1);
      updateUser(currentUser);
      renderUsers();
    };
    li.appendChild(del);
    list.appendChild(li);
  });
}

function updateUser(updated) {
  users = users.map((u) => (u.email === updated.email ? updated : u));
  localStorage.setItem("users", JSON.stringify(users));
}
