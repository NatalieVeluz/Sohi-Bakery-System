const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../customer/pages/login.html";
}

// LOAD CATEGORIES FOR DROPDOWN
async function loadCategories() {
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();

    const select = document.getElementById("categorySelect");
    select.innerHTML = "";

    categories.forEach(cat => {
        select.innerHTML += `
            <option value="${cat.id}">${cat.name}</option>
        `;
    });
}

// LOAD PRODUCTS
async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach(prod => {
        list.innerHTML += `
            <div style="border:1px solid #ccc; padding:15px; margin:15px; border-radius:8px;">
                <img src="${prod.image}" width="120" style="border-radius:8px;"><br><br>
                <h3>${prod.name}</h3>
                <p>${prod.description}</p>
                <p><strong>₱${prod.price}</strong></p>
                <button onclick="deleteProduct(${prod.id})">Delete</button>
            </div>
        `;
    });
}

// ADD PRODUCT
async function addProduct() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const category_id = document.getElementById("categorySelect").value;
    const image = document.getElementById("image").value;

    await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            description,
            price,
            category_id,
            image
        })
    });

    loadProducts();
}

// DELETE PRODUCT
async function deleteProduct(id) {
    await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadProducts();
}

function logout() {
    localStorage.clear();
    window.location.href = "../../customer/pages/login.html";
}

loadCategories();
loadProducts();