/* ===============================
   GLOBAL VARIABLES
================================*/
let cart = JSON.parse(localStorage.getItem("faustoreCart")) || [];
updateCartCount();

// Store fetched products globally
let products = [];

// Users & current user
let currentUser = localStorage.getItem("faustoreCurrentUser");
updateAuthUI();

/* ===============================
   LOAD PRODUCTS FROM SERVER
================================*/
async function loadProducts() {
  const API_URL = "https://mongodb-crud-api-khgh.onrender.com/api/products"; // your server endpoint
  try {
    const res = await fetch(API_URL);
    products = await res.json(); // save globally

    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
        <div class="card bg-dark-glass h-100 text-light">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">₱${p.price.toLocaleString()}</p>
            <button class="btn btn-glow w-100" onclick="addToCart('${p._id}')">
              Add to Cart
            </button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

/* ===============================
   CART SYSTEM
================================*/
function addToCart(id) {
  const item = products.find(p => p._id === id);
  if (!item) return alert("Product not found.");

  cart.push(item);
  localStorage.setItem("faustoreCart", JSON.stringify(cart));
  updateCartCount();
  alert(`${item.name} added to cart!`);
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

function showCart() {
  const cartCanvas = new bootstrap.Offcanvas("#cartCanvas");
  cartCanvas.show();

  const ul = document.getElementById("cartItems");
  ul.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    ul.innerHTML += `
      <li class="mb-2">
        ${item.name} - ₱${item.price}
        <button class="btn btn-sm btn-danger float-end" onclick="removeCartItem(${index})">X</button>
      </li>
    `;
    total += item.price;
  });

  document.getElementById("cartTotal").textContent = total;
}

function removeCartItem(i) {
  cart.splice(i, 1);
  localStorage.setItem("faustoreCart", JSON.stringify(cart));
  showCart();
  updateCartCount();
}

/* ===============================
   AUTH: SIGN IN / SIGN UP
================================*/
async function signUp() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Please fill all fields.");

  try {
    const res = await fetch("https://mongodb-crud-api-khgh.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }) // optionally add name
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error || "Failed to create account.");
    }

    alert(data.message || "Account created! You can now sign in.");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

  } catch (err) {
    console.error("SignUp Error:", err);
    alert("Something went wrong.");
  }
}

async function signIn() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Please fill all fields.");

  try {
    const res = await fetch("https://mongodb-crud-api-khgh.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error || "Login failed.");
    }

    currentUser = data.user.email;
    localStorage.setItem("faustoreCurrentUser", currentUser);
    updateAuthUI();
    alert("Signed in successfully!");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

  } catch (err) {
    console.error("SignIn Error:", err);
    alert("Something went wrong.");
  }
}

function signOut() {
  localStorage.removeItem("faustoreCurrentUser");
  currentUser = null;
  updateAuthUI();
}

function updateAuthUI() {
  const signInUpBtn = document.getElementById("signInUpBtn");
  const signOutBtn = document.getElementById("signOutBtn");

  if (currentUser) {
    signInUpBtn.classList.add("d-none");
    signOutBtn.classList.remove("d-none");
  } else {
    signOutBtn.classList.add("d-none");
    signInUpBtn.classList.remove("d-none");
  }
}

/* ===============================
   ADMIN PAGE BUTTON (ADMIN LOGIN REQUIRED)
================================*/
function openAdmin() {
  if (!currentUser) {
    alert("You must be signed in to access the admin dashboard!");
    return;
  }

  const adminEmail = prompt("Enter admin email:");
  const adminPass = prompt("Enter admin password:");

  if (adminEmail === "admin" && adminPass === "123") {
    alert("Welcome Admin! Redirecting to Admin Page...");
    window.location.href = "admin.html";
  } else {
    alert("Access denied! Invalid admin credentials.");
  }
}

// Call loadProducts on page load
loadProducts();
