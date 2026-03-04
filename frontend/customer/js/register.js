async function register() {
    const full_name = document.getElementById("full_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.innerText = "";

    if (!full_name || !email || !password) {
        message.innerText = "All fields are required.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.innerText = data.message;
            return;
        }

        alert("Registration successful! Please login.");
        window.location.href = "login.html";

    } catch (error) {
        message.innerText = "Server error. Please try again.";
    }
}