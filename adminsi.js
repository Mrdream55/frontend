// ============================================
// Load existing products from main store
// ============================================
let products = JSON.parse(localStorage.getItem("faustoreProducts")) || [
  { id: 1, name: "Wireless Headphones", price: 899, img: "https://picsum.photos/300?random=11" },
  { id: 2, name: "Smart Watch", price: 1299, img: "https://picsum.photos/300?random=22" },
  { id: 3, name: "Gaming Mouse", price: 499, img: "https://picsum.photos/300?random=33" }
];

function saveProducts() {
  localStorage.setItem("faustoreProducts", JSON.stringify(products));
}

// ============================================
// Load table
// ============================================
function loadTable() {
  let table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach((p, index) => {
    table.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.img}" width="60" class="rounded"></td>

        <td>
          <input id="name-${index}" class="form-control" value="${p.name}">
        </td>

        <td>
          <input id="price-${index}" class="form-control" type="number" value="${p.price}">
        </td>

        <td>
          <button class="btn btn-success btn-sm" onclick="updateProduct(${index})">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

loadTable();

// ============================================
// Add Product
// ============================================
function addProduct() {
  let name = document.getElementById("pName").value;
  let price = document.getElementById("pPrice").value;
  let img = document.getElementById("pImg").value;

  if (!name || !price || !img) {
    alert("Please fill all fields!");
    return;
  }

  let newProduct = {
    id: products.length + 1,
    name,
    price: Number(price),
    img
  };

  products.push(newProduct);
  saveProducts();
  loadTable();

  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pImg").value = "";

  alert("Product Added!");
}

// ============================================
// Update Product
// ============================================
function updateProduct(index) {
  let newName = document.getElementById(`name-${index}`).value;
  let newPrice = document.getElementById(`price-${index}`).value;

  products[index].name = newName;
  products[index].price = Number(newPrice);

  saveProducts();

  alert("Product Updated!");
}

// ============================================
// Delete Product
// ============================================
function deleteProduct(index) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  products.splice(index, 1);

  // reassign IDs
  products = products.map((p, i) => ({
    ...p,
    id: i + 1
  }));

  saveProducts();
  loadTable();

  alert("Product Deleted!");
}
