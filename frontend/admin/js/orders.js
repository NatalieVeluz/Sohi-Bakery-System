const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../customer/pages/login.html";
}

// LOAD ALL ORDERS
async function loadOrders() {
    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const orders = await response.json();

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    orders.forEach(order => {
        table.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.full_name}</td>
                <td>₱${order.total}</td>
                <td>${order.status}</td>
                <td>
                    <select onchange="updateStatus(${order.id}, this.value)">
                        <option value="">Select</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

// UPDATE ORDER STATUS
async function updateStatus(orderId, status) {
    if (!status) return;

    await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });

    loadOrders();
}

function logout() {
    localStorage.clear();
    window.location.href = "../../customer/pages/login.html";
}

loadOrders();