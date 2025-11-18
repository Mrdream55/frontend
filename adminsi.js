// ============================================
// API URL (your live backend)
// ============================================
const API_URL = "https://faustore.onrender.com/api/products";

// Global product storage
let products = [];

// ============================================
// Load table from MongoDB
// ============================================
async function loadTable() {
  let table = document.getElementById("productTable");
  table.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    products = await res.json();

    products.forEach((p, index) => {
      table.innerHTML += `
        <tr>
          <td>${p._id}</td>
          <td><img src="${p.img}" width="60" class="rounded"></td>

          <td>
            <input id="name-${index}" class="form-control" value="${p.name}">
          </td>

          <td>
            <input id="price-${index}" class="form-control" type="number" value="${p.price}">
          </td>

          <td>
            <button class="btn btn-success btn-sm" onclick="updateProduct(${index})">Update</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error loading products:", err);
    alert("Failed to load products.");
  }
}

loadTable();

// ============================================
// Add Product (POST MongoDB)
// ============================================
async function addProduct() {
  let name = document.getElementById("pName").value;
  let price = document.getElementById("pPrice").value;
  let img = document.getElementById("pImg").value;

  if (!name || !price || !img) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), img })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add product");
      return;
    }

    alert("Product Added!");
    loadTable();

    document.getElementById("pName").value = "";
    document.getElementById("pPrice").value = "";
    document.getElementById("pImg").value = "";

  } catch (err) {
    console.error("Add error:", err);
    alert("Could not add product.");
  }
}

// ============================================
// Update Product (PUT MongoDB)
// ============================================
async function updateProduct(index) {
  let newName = document.getElementById(`name-${index}`).value;
  let newPrice = document.getElementById(`price-${index}`).value;

  const id = products[index]._id;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, price: Number(newPrice) })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Update failed");
      return;
    }

    alert("Product Updated!");
    loadTable();
  } catch (err) {
    console.error("Update error:", err);
    alert("Could not update product.");
  }
}

// ============================================
// Delete Product (DELETE MongoDB)
// ============================================
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    alert("Product Deleted!");
    loadTable();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Could not delete product.");
  }
}


