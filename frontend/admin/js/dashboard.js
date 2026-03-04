const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../customer/pages/login.html";
}

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        document.getElementById("stats").innerHTML = `
            <div class="card">
                <h3>Total Products</h3>
                <p>${data.total_products}</p>
            </div>

            <div class="card">
                <h3>Total Orders</h3>
                <p>${data.total_orders}</p>
            </div>

            <div class="card">
                <h3>Total Customers</h3>
                <p>${data.total_customers}</p>
            </div>

            <div class="card">
                <h3>Total Sales</h3>
                <p>₱${Number(data.total_sales).toLocaleString()}</p>
            </div>
        `;
    } catch (error) {
        console.error("Dashboard fetch error:", error);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "../../customer/pages/login.html";
}

loadDashboard();