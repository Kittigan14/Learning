const express = require('express');
const sqlite = require('sqlite3');
const app = express();
const port = process.env.PORT || 3000;

// send data json
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Connection Database book.sqlite
const db = new sqlite.Database('Books.sqlite');

// Create Table Books
db.run(`CREATE TABLE IF NOT EXISTS Books (
    Books_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title TEXT,
    Author TEXT UNIQUE,
    Price INTEGER
)`);

// Create Table Customers
db.run(`CREATE TABLE IF NOT EXISTS Customers (
    Customer_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT
)`);

// Create Table Sales
db.run(`CREATE TABLE IF NOT EXISTS Sales (
    Sale_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Books_ID INTEGER,
    Customer_ID INTEGER,
    FOREIGN KEY (Books_ID) REFERENCES Books(Books_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customers(Customer_ID)
)`);

// Show database
app.get("/books", (req, res) => {

    db.all(`SELECT * FROM Books`, (err, rows) => {

        if (err) res.status(500).send(err);

        else res.json(rows);

    });

}); 

// INSERT database
app.post("/books", (req, res) => {

    const book = req.body;
    
    db.run(`INSERT INTO Books (Title, Author, Price) VALUES (?, ?, ?)`, book.Title, book.Author, book.Price, function (err) {

        if (err) res.status(500).send(err);

        else {
            book.Books_ID = this.lastID;
            res.send(book);
        }

    });

});

// Update Data on (PK)
app.post('/update/:Books_ID', (req, res) => {

    const book = req.body;

    db.run(`UPDATE Books SET Title = ?, Author = ?, Price = ? WHERE Books_ID = ?`, book.Title, book.Author, book.Price, req.params.Books_ID, function (err) {

        if (err) res.status(500).send(err);

        else res.send(book);

    });

});

// Delete Data on (PK)
app.post('/delete/:Books_ID', (req, res) => {

    const book_Id = req.params.Books_ID;

    db.run(`DELETE FROM Books WHERE Books_ID = ?`, book_Id , function (err) {

        if (err) res.status(500).send(err);

        else res.send(book);

    });

});

// Run Server on port 3000
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
})