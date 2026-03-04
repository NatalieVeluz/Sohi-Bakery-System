const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../customer/pages/login.html";
}

// LOAD CUSTOMERS
async function loadCustomers() {
    const response = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const customers = await response.json();

    const table = document.getElementById("customerTable");
    table.innerHTML = "";

    customers.forEach(customer => {
        table.innerHTML += `
            <tr>
                <td>${customer.full_name}</td>
                <td>${customer.email}</td>
                <td>${customer.total_orders}</td>
                <td>₱${customer.total_spent}</td>
                <td>
                    <button onclick="viewOrders(${customer.id})">
                        View
                    </button>
                </td>
            </tr>
        `;
    });
}

// VIEW CUSTOMER ORDERS
async function viewOrders(customerId) {
    const response = await fetch(`${API_URL}/customers/${customerId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const orders = await response.json();

    const container = document.getElementById("orderHistory");
    container.innerHTML = "";

    if (!orders.length) {
        container.innerHTML = "<p>No orders found.</p>";
        return;
    }

    orders.forEach(order => {
        container.innerHTML += `
            <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Total:</strong> ₱${order.total}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Date:</strong> ${order.created_at}</p>
            </div>
        `;
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "../../customer/pages/login.html";
}

loadCustomers();