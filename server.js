const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./orders.db');
const path = require('path');
app.use(express.static(path.join(__dirname)));

app.use(cors());
app.use(bodyParser.json());


// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Save order endpoint
app.post('/api/orders', (req, res) => {
    const { items, total } = req.body;
    db.run(
        'INSERT INTO orders (items, total) VALUES (?, ?)',
        [JSON.stringify(items), total],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, orderId: this.lastID });
        }
    );
});

// Get all orders endpoint (optional)
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.get('/', (req, res) => {
    res.send('Pahinga Café API is running.');
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'));