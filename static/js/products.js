let snapshot = null;
let cursorUpdatedAt = null;
let cursorId = null;

async function loadProducts(reset = false) {
    const container = document.getElementById("products");

    // RESET only on filter
    if (reset) {
        snapshot = null;
        cursorUpdatedAt = null;
        cursorId = null;
        container.innerHTML = "";
    }

    let category = document.getElementById("category").value;
    let url = "/api/products/?limit=20";

    if (category) {
        url += "&category=" + category;
    }

    if (snapshot) {
        url += "&snapshot_time=" + encodeURIComponent(snapshot);
    }

    if (cursorUpdatedAt && cursorId) {
        url += "&cursor_updated_at=" + encodeURIComponent(cursorUpdatedAt);
        url += "&cursor_id=" + cursorId;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        snapshot = data.snapshot_time;

        if (data.next_cursor) {
            cursorUpdatedAt = data.next_cursor.cursor_updated_at;
            cursorId = data.next_cursor.cursor_id;
        } else {
            cursorUpdatedAt = null;
            cursorId = null;
            alert("No more products!");
        }

        // ❗ IMPORTANT FIX HERE
        // only clear on first load
        if (reset) {
            container.innerHTML = "";
        }

        // append ALWAYS (for pagination)
        data.items.forEach(product => {
            container.innerHTML += `
                <div class="card">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Price: ₹${product.price}</p>
                    <small>ID: ${product.id}</small>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading products:", error);
    }
}

window.onload = function () {
    loadProducts(true);
};