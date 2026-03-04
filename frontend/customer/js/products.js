let allProducts = [];

// ================= LOAD CATEGORIES =================
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) return;

        const categories = await response.json();
        const select = document.getElementById("categoryFilter");

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.warn("Category loading failed:", error);
    }
}

// ================= LOAD PRODUCTS =================
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();
        allProducts = products;

        displayProducts(products);

    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById("productList").innerHTML =
            "<p>Failed to load products.</p>";
    }
}

// ================= DISPLAY PRODUCTS =================
function displayProducts(products) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {

        // Safe image handling (NO MORE LOCAL ERRORS)
        const imageUrl = product.image
            ? product.image
            : "https://via.placeholder.com/250x180?text=No+Image";

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><strong>₱${product.price}</strong></p>
            <button onclick="viewProduct(${product.id})">
                View Details
            </button>
        `;

        container.appendChild(card);
    });
}

// ================= FILTER PRODUCTS =================
function filterProducts() {
    const selected = document.getElementById("categoryFilter").value;

    if (!selected) {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(p =>
        p.category_id &&
        p.category_id.toString() === selected
    );

    displayProducts(filtered);
}

// ================= VIEW PRODUCT =================
function viewProduct(id) {
    window.location.href = `product-details.html?id=${id}`;
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadProducts();

    document
        .getElementById("categoryFilter")
        .addEventListener("change", filterProducts);
});