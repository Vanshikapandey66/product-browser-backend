let snapshot = null;
let cursorUpdatedAt = null;
let cursorId = null;

async function loadProducts(reset = false) {
    const container = document.getElementById("products");

    if (reset) {
        snapshot = null;
        cursorUpdatedAt = null;
        cursorId = null;
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
        url += `&cursor_updated_at=${encodeURIComponent(cursorUpdatedAt)}&cursor_id=${cursorId}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    snapshot = data.snapshot_time;
    cursorUpdatedAt = data.next_cursor?.cursor_updated_at || null;
    cursorId = data.next_cursor?.cursor_id || null;

    // 🔥 IMPORTANT FIX (THIS WAS BUG)
    container.innerHTML = "";

    data.items.forEach(p => {
        container.innerHTML += `
            <div class="card">
                <h3>${p.name}</h3>
                <p>${p.category}</p>
                <p>₹${p.price}</p>
            </div>
        `;
    });
}

window.onload = () => loadProducts(true);

function nextPage() {
    loadProducts(false);
}

function prevPage() {
    loadProducts(false);
}