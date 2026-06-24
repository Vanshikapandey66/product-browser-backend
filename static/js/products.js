let currentPage = 1;

// IMPORTANT: Render URL fix (VERY IMPORTANT)
const BASE_URL = window.location.origin;

async function loadProducts(page = 1) {

    const container = document.getElementById("products");

    let category = document.getElementById("category").value;

    let url = `${BASE_URL}/api/products/?limit=20&page=${page}`;

    if (category) {
        url += `&category=${category}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = "";

        const products = data.items || [];

        if (products.length === 0) {
            container.innerHTML = "<h3>No Products Found</h3>";
            return;
        }

        products.forEach(product => {
            container.innerHTML += `
                <div class="card">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Price: ₹${product.price}</p>
                    <small>ID: ${product.id}</small>
                </div>
            `;
        });

        currentPage = page;
        document.getElementById("pageInfo").innerText = `Page ${page}`;

    } catch (err) {
        console.log(err);
        container.innerHTML = "<h3>Failed to load products</h3>";
    }
}

function nextPage() {
    loadProducts(currentPage + 1);
}

function prevPage() {
    if (currentPage > 1) {
        loadProducts(currentPage - 1);
    }
}

window.onload = () => loadProducts(1);