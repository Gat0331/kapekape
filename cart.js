const prices = {
    espresso: 80,
    americano: 100,
    cappuccino: 120,
    macchiato: 140,
    croissant: 90,
    muffin: 100,
    cheesecake: 150
};

const itemNames = {
    espresso: "Espresso",
    americano: "Americano",
    cappuccino: "Cappuccino",
    macchiato: "Caramel Macchiato",
    croissant: "Chocolate Croissant",
    muffin: "Blueberry Muffin",
    cheesecake: "Cheesecake Slice"
};

let cart = {};

function addItem(item) {
    const qty = parseInt(document.querySelector(`input[name="${item}"]`).value) || 0;
    if (qty > 0) {
        if (cart[item]) {
            cart[item].quantity += qty;
        } else {
            cart[item] = {
                name: itemNames[item],
                quantity: qty,
                price: prices[item]
            };
        }
        document.querySelector(`input[name="${item}"]`).value = 0;
        updateCartDisplay();
    }
}

function removeItem(item) {
    delete cart[item];
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartTable = document.getElementById('cartTable');
    cartTable.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Remove</th>
        </tr>
    `;
    let total = 0;
    for (let item in cart) {
        const subtotal = cart[item].quantity * cart[item].price;
        total += subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cart[item].name}</td>
            <td>${cart[item].quantity}</td>
            <td>₱${subtotal}</td>
            <td><button type="button" onclick="removeItem('${item}')">Remove</button></td>
        `;
        cartTable.appendChild(row);
    }
    document.getElementById('cartTotal').textContent = "Total: ₱" + total;
}

function saveOrderToDatabase() {
    let items = [];
    let total = 0;
    for (let item in cart) {
        items.push({
            name: cart[item].name,
            quantity: cart[item].quantity,
            price: cart[item].price
        });
        total += cart[item].quantity * cart[item].price;
    }
    if (items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    console.log(JSON.stringify({ items, total }));
    
    fetch('save_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Order saved! Order ID: ' + data.orderId);
            cart = {};
            updateCartDisplay();
        } else {
            alert('Failed to save order.');
        }
    })
    .catch(() => alert('Failed to connect to server.'));
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);