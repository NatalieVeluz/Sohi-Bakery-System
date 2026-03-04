const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function loadOrderSummary() {
    const cart = getCart();
    const summary = document.getElementById("orderSummary");

    summary.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        summary.innerHTML += `
            <p>${item.name} (x${item.quantity}) - ₱${item.price * item.quantity}</p>
        `;
    });

    document.getElementById("checkoutTotal").innerText = "Total: ₱" + total;
}

async function placeOrder() {
    const cart = getCart();
    const proof = document.getElementById("proof").value;
    const address = document.getElementById("address").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!cart.length) {
        alert("Cart is empty!");
        return;
    }

    if (!address || !paymentMethod) {
        alert("Please complete delivery details.");
        return;
    }

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            items,
            proof,
            address,
            payment_method: paymentMethod
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "my-orders.html";
    } else {
        alert(data.message);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

loadOrderSummary();