/* ===============================
   FAUSTORE DEFAULT PRODUCTS
================================*/
let products = JSON.parse(localStorage.getItem("faustoreProducts")) || [
  { id: 1, name: "Wireless Headphones", price: 59, img: "https://picsum.photos/300?random=1" },
  { id: 2, name: "Smart Watch", price: 120, img: "https://picsum.photos/300?random=2" },
  { id: 3, name: "Gaming Mouse", price: 35, img: "https://picsum.photos/300?random=3" }
];

// Save to localStorage
localStorage.setItem("faustoreProducts", JSON.stringify(products));

/* ===============================
   DISPLAY PRODUCTS
================================*/
function loadProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card text-light">
          <img src="${p.img}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">₱${p.price}</p>
            <button class="btn btn-glow w-100" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

loadProducts();

/* ===============================
   CART SYSTEM
================================*/
let cart = JSON.parse(localStorage.getItem("faustoreCart")) || [];
updateCartCount();

function addToCart(id) {
  const item = products.find(p => p.id === id);
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
let users = JSON.parse(localStorage.getItem("faustoreUsers")) || [];
let currentUser = localStorage.getItem("faustoreCurrentUser");

updateAuthUI();

function signUp() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Please fill all fields.");

  if (users.find(u => u.email === email)) {
    return alert("Email already exists.");
  }

  users.push({ email, password: pass });
  localStorage.setItem("faustoreUsers", JSON.stringify(users));

  alert("Account created! You can now sign in.");
}

function signIn() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  const user = users.find(u => u.email === email && u.password === pass);

  if (!user) return alert("Incorrect email or password.");

  currentUser = email;
  localStorage.setItem("faustoreCurrentUser", email);

  updateAuthUI();
  alert("Signed in!");
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
  // Check if a user is signed in
  if (!currentUser) {
    alert("You must be signed in to access the admin dashboard!");
    return;
  }

  // Prompt for admin credentials
  const adminEmail = prompt("Enter admin email:");
  const adminPass = prompt("Enter admin password:");

  if (adminEmail === "admin" && adminPass === "123") {
    alert("Welcome Admin! Redirecting to Admin Page...");
    window.location.href = "admin.html";
  } else {
    alert("Access denied! Invalid admin credentials.");
  }
}
