/* ===============================
   Generate Stars
================================ */
function generateStars(rating) {
    let stars = "";
    rating = Number(rating);

    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "⭐" : "☆";
    }

    return stars;
}

/* ===============================
   Format Date
================================ */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

/* ===============================
   Load Product Dropdown
================================ */
async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    const select = document.getElementById("productFilter");

    products.forEach(product => {
        select.innerHTML += `
            <option value="${product.id}">
                ${product.name}
            </option>
        `;
    });
}

/* ===============================
   Load Reviews
================================ */
async function loadReviews() {

    const product_id = document.getElementById("productFilter").value;
    const sort = document.getElementById("sortFilter").value;

    let url = `${API_URL}/reviews/public?`;

    if (product_id) {
        url += `product_id=${product_id}&`;
    }

    if (sort) {
        url += `sort=${sort}`;
    }

    const container = document.getElementById("reviewList");
    container.innerHTML = "Loading...";

    try {
        const response = await fetch(url);
        const reviews = await response.json();

        container.innerHTML = "";

        if (!reviews.length) {
            container.innerHTML = "<p>No reviews found.</p>";
            return;
        }

        // Calculate average rating per product
        const productStats = {};

        reviews.forEach(r => {
            if (!productStats[r.product_name]) {
                productStats[r.product_name] = {
                    total: 0,
                    count: 0
                };
            }

            productStats[r.product_name].total += r.rating;
            productStats[r.product_name].count++;
        });

        reviews.forEach(review => {

            const stats = productStats[review.product_name];
            const average = (stats.total / stats.count).toFixed(1);

            container.innerHTML += `
                <div class="review-card">
                    <h3>${review.product_name}</h3>

                    <p>
                        <strong>Average Rating:</strong> 
                        ${generateStars(Math.round(average))} 
                        (${average}/5 from ${stats.count} reviews)
                    </p>

                    <hr>

                    <strong>${review.full_name}</strong>
                    <p>${generateStars(review.rating)}</p>
                    <p>${review.comment}</p>
                    <small>${formatDate(review.created_at)}</small>
                    <hr>
                </div>
            `;
        });

    } catch (error) {
        container.innerHTML = "Error loading reviews.";
    }
}

/* ===============================
   Init
================================ */
loadProducts();
loadReviews();