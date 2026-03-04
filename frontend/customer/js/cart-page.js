function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const cart = getCart();
    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        container.innerHTML += `
            <div>
                <h3>${item.name}</h3>
                <p>₱${item.price} x ${item.quantity}</p>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
            <hr>
        `;
    });

    document.getElementById("cartTotal").innerText = "Total: ₱" + total;
}

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

loadCart();