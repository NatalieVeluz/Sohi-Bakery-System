const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadCategories() {
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();

    const list = document.getElementById("categoryList");
    list.innerHTML = "";

    categories.forEach(cat => {
        list.innerHTML += `
            <tr>
                <td>${cat.id}</td>
                <td>${cat.name}</td>
                <td>
                    <button onclick="deleteCategory(${cat.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function addCategory() {
    const name = document.getElementById("categoryName").value;

    await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });

    loadCategories();
}

async function deleteCategory(id) {
    await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadCategories();
}

function logout() {
    localStorage.clear();
    window.location.href = "../../customer/pages/login.html";
}

loadCategories();