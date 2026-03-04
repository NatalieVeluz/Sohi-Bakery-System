document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       LOGIN HANDLER
    ========================= */
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${window.API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                if (data.role === "admin") {
                    window.location.href = "../../admin/pages/dashboard.html";
                } else {
                    window.location.href = "home.html";
                }

            } catch (error) {
                alert("Server error. Try again.");
            }
        });
    }

    /* =========================
       NAVBAR LOGIN / LOGOUT
    ========================= */
    const authLink = document.getElementById("authLink");

    if (!authLink) return;

    const token = localStorage.getItem("token");

    if (token) {
        authLink.textContent = "Logout";
        authLink.href = "#";

        authLink.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "login.html";
        });

    } else {
        authLink.textContent = "Login";
        authLink.href = "login.html";
    }

});