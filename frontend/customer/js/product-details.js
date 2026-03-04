const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "⭐" : "☆";
    }
    return stars;
}

async function loadProduct() {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }

        const product = await response.json();

        document.getElementById("productDetails").innerHTML = `
            <img src="${product.image || '../images/default.jpg'}" width="250">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>₱${product.price}</strong></p>

            <label>Quantity:</label>
            <input type="number" id="quantity" value="1" min="1">

            <br><br>

            <button onclick="addProductToCart(${product.id}, '${product.name}', ${product.price})">
                Add to Cart
            </button>
            <hr>
        `;
    } catch (error) {
        console.error("Error loading product:", error);
        document.getElementById("productDetails").innerHTML =
            "<p>Product not found.</p>";
    }
}

async function loadReviews() {
    try {
        const response = await fetch(`${API_URL}/reviews/product/${productId}`);
        if (!response.ok) return;

        const reviews = await response.json();
        const container = document.getElementById("reviewList");
        container.innerHTML = "";

        if (!reviews.length) {
            container.innerHTML = "<p>No reviews yet.</p>";
            return;
        }

        reviews.forEach(review => {
            container.innerHTML += `
                <div>
                    <strong>${review.full_name}</strong>
                    <p>${generateStars(review.rating)}</p>
                    <p>${review.comment}</p>
                    <hr>
                </div>
            `;
        });

    } catch (error) {
        console.warn("Reviews loading failed:", error);
    }
}

function addProductToCart(id, name, price) {
    const quantity =
        parseInt(document.getElementById("quantity").value);
    addToCart(id, name, price, quantity);
}

document.addEventListener("DOMContentLoaded", () => {
    loadProduct();
    loadReviews();
});