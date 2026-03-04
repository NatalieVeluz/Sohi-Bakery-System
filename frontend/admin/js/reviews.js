const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../customer/pages/login.html";
}

// LOAD ALL REVIEWS
async function loadReviews() {
    const response = await fetch(`${API_URL}/reviews`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const reviews = await response.json();

    const table = document.getElementById("reviewTable");
    table.innerHTML = "";

    reviews.forEach(review => {
        table.innerHTML += `
            <tr>
                <td>${review.id}</td>
                <td>${review.full_name}</td>
                <td>${review.product_name}</td>
                <td>${review.rating}/5</td>
                <td>${review.comment}</td>
                <td>
                    <button onclick="deleteReview(${review.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// DELETE REVIEW
async function deleteReview(id) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadReviews();
}

function logout() {
    localStorage.clear();
    window.location.href = "../../customer/pages/login.html";
}

loadReviews();