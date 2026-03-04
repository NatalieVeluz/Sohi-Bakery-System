async function loadFeaturedProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    const container = document.getElementById("featuredProducts");
    container.innerHTML = "";

    products.slice(0, 4).forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p><strong>₱${product.price}</strong></p>
                <button onclick="viewProduct(${product.id})">
                    View
                </button>
            </div>
        `;
    });
}

function viewProduct(id) {
    window.location.href = `product-details.html?id=${id}`;
}

loadFeaturedProducts();