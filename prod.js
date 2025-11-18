/* ===============================
   GLOBAL VARIABLES
================================*/

// Cart stored in MongoDB (not localStorage)
let cart = []; 

// Store fetched products globally
let products = [];

// Logged user (fetched from server or memory variable)
let currentUser = null;
updateAuthUI();

/* ===============================
   LOAD PRODUCTS FROM SERVER
================================*/
async function loadProducts() {
  const API_URL = "https://mongodb-crud-api-vgdb.onrender.com/api/products"; 
  try {
    const res = await fetch(API_URL);
    products = await res.json(); 

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
   CART SYSTEM (NEW: SERVER-BASED)
================================*/
async function addToCart(id) {
  if (!currentUser) return alert("You must sign in first!");

  const item = products.find(p => p._id === id);
  if (!item) return alert("Product not found.");

  try {
    const res = await fetch("https://mongodb-crud-api-vgdb.onrender.com/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: currentUser, productId: id })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    cart = data.cart; 
    updateCartCount();
    alert(`${item.name} added to cart!`);

  } catch (err) {
    console.error("Cart Error:", err);
  }
}

async function loadCart() {
  if (!currentUser) return;

  const res = await fetch(
    `https://mongodb-crud-api-vgdb.onrender.com/api/cart/${currentUser}`
  );

  cart = await res.json();
  updateCartCount();
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
        <button class="btn btn-sm btn-danger float-end" onclick="removeCartItem('${item._id}')">X</button>
      </li>
    `;
    total += item.price;
  });

  document.getElementById("cartTotal").textContent = total;
}

async function removeCartItem(id) {
  const res = await fetch("https://mongodb-crud-api-vgdb.onrender.com/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: currentUser, productId: id })
  });

  const data = await res.json();
  cart = data.cart;
  showCart();
  updateCartCount();
}

/* ===============================
   AUTH: SIGN IN / SIGN UP
================================*/
async function signUp() {
  const name = document.getElementById("name")?.value || "";
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Please fill all fields.");

  try {
    const res = await fetch("https://mongodb-crud-api-vgdb.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    alert("Account created! Please sign in.");
  } catch (err) {
    console.error("SignUp Error:", err);
  }
}

async function signIn() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Please fill all fields.");

  try {
    const res = await fetch("https://mongodb-crud-api-vgdb.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    currentUser = data.user.email;
    updateAuthUI();
    loadCart(); 

    alert("Signed in successfully! 🎉");

  } catch (err) {
    console.error("SignIn Error:", err);
  }
}

function signOut() {
  currentUser = null;
  cart = [];
  updateAuthUI();
  updateCartCount();
}

/* ===============================
   AUTH UI UPDATE
================================*/
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
   ADMIN PAGE LOGIN
================================*/
function openAdmin() {
  if (!currentUser) {
    alert("Sign in first!");
    return;
  }

  const adminEmail = prompt("Admin email:");
  const adminPass = prompt("Admin password:");

  if (adminEmail === "admin" && adminPass === "123") {
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin credentials.");
  }
}

/* ===============================
   INIT
================================*/
loadProducts();
loadCart();
