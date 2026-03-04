// Auto redirect if already logged in
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (token) {
    if (role === "admin") {
        window.location.href = "../../admin/pages/dashboard.html";
    } else {
        window.location.href = "home.html";
    }
}

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    error.innerText = "";

    if (!email || !password) {
        error.innerText = "Email and password are required.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            error.innerText = data.message;
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
            window.location.href = "../../admin/pages/dashboard.html";
        } else {
            window.location.href = "home.html";
        }

    } catch (err) {
        error.innerText = "Server error. Please try again.";
    }
}