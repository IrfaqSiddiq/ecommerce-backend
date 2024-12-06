const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db'); // Use a file-based database for persistence

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255)
    )
  `, (err) => {
    if (err) {
      console.error("Table creation error:", err.message);
    } else {
      console.log('Users table created or already exists.');
    }
  });
});

// Create the `products` table
db.run(`
      CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name VARCHAR(255) NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      product_type TEXT,
      img BLOB,
      mimeType TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Table creation error (products):", err.message);
    } else {
      console.log('Products table created or already exists.');
    }
  });

// Create the `inventory` table
db.run(`
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (product_id)
)
`, (err) => {
if (err) {
  console.error("Table creation error (products):", err.message);
} else {
  console.log('Inventory table created or already exists.');
}
});

db.run(`
    CREATE TABLE sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      user_id INTEGER NOT NULL,             
      user_token TEXT NOT NULL UNIQUE,      
      is_expired BOOLEAN NOT NULL DEFAULT 0, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  
    )
  `, (err) => {
  if (err) {
    console.error("Table creation error (sessions):", err.message);
  } else {
    console.log('sessions table created or already exists.');
  }
});

module.exports = db;
