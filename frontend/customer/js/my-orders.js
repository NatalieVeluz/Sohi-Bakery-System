const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let ordersData = [];

async function loadMyOrders() {
    const response = await fetch(`${API_URL}/orders/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();
    ordersData = data;

    renderOrders();
}

function renderOrders() {
    const container = document.getElementById("ordersContainer");
    container.innerHTML = "";

    if (!ordersData.length) {
        container.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    const grouped = {};

    ordersData.forEach(item => {
        if (!grouped[item.order_id]) {
            grouped[item.order_id] = {
                total: item.total,
                status: item.status,
                created_at: item.created_at,
                products: []
            };
        }

        grouped[item.order_id].products.push({
            product_id: item.product_id,
            product_name: item.product_name
        });
    });

    Object.keys(grouped).forEach(orderId => {
        const order = grouped[orderId];

        let productsHTML = "";

        order.products.forEach(product => {
            productsHTML += `
                <div style="margin-bottom:10px;">
                    <p>• ${product.product_name}</p>
                    ${
                        order.status === "Completed"
                        ? `<button onclick="toggleReviewForm(${product.product_id}, ${orderId})">
                                Review
                           </button>`
                        : ""
                    }
                    <div id="review-form-${product.product_id}-${orderId}" 
                         style="display:none; margin-top:10px;"></div>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="order-card" style="margin-bottom:30px;">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total:</strong> ₱${order.total}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                <hr>
                ${productsHTML}
                <hr>
            </div>
        `;
    });
}

function toggleReviewForm(productId, orderId) {
    const formContainer = document.getElementById(
        `review-form-${productId}-${orderId}`
    );

    if (formContainer.style.display === "block") {
        formContainer.style.display = "none";
        return;
    }

    formContainer.style.display = "block";

    formContainer.innerHTML = `
        <div style="margin-top:10px;">
            <input type="number" 
                   id="rating-${productId}-${orderId}" 
                   min="1" max="5" 
                   placeholder="Rating (1-5)"
                   style="width:80px;">
            <br><br>
            <textarea 
                id="comment-${productId}-${orderId}" 
                placeholder="Your review"
                rows="3"
                style="width:250px;"></textarea>
            <br><br>
            <button onclick="submitReview(${productId}, ${orderId})">
                Submit
            </button>
        </div>
    `;
}

async function submitReview(productId, orderId) {
    const rating = document.getElementById(
        `rating-${productId}-${orderId}`
    ).value;

    const comment = document.getElementById(
        `comment-${productId}-${orderId}`
    ).value;

    if (!rating || !comment) {
        alert("Please fill all fields.");
        return;
    }

    const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            product_id: productId,
            rating,
            comment
        })
    });

    const data = await response.json();
    alert(data.message);

    // Hide form after submit
    document.getElementById(
        `review-form-${productId}-${orderId}`
    ).style.display = "none";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

loadMyOrders();