let currentPage = 1;

async function loadProducts(page = 1) {
    const container = document.getElementById("products");

    let category = document.getElementById("category").value;

    let url = `/api/products/?page=${page}`;

    if (category) {
        url += `&category=${category}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = "";

        data.results.forEach(product => {
            container.innerHTML += `
                <div class="card">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Price: ₹${product.price}</p>
                </div>
            `;
        });

        currentPage = page;
        document.getElementById("pageInfo").innerText = `Page ${page}`;

    } catch (error) {
        console.error(error);
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