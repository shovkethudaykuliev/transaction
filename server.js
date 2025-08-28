const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// In-memory transactions
let transactions = [];

// Home Page
app.get("/", (req, res) => {
  let balance = 0;
  transactions.forEach(t => {
    if (t.type === "Income") balance += Number(t.amount);
    else balance -= Number(t.amount);
  });
  res.render("home", { balance, transactions });
});

// Show Add Transaction Form
app.get("/add-transaction", (req, res) => {
  res.render("addTransaction");
});

// Handle Add Transaction Form
app.post("/add-transaction", (req, res) => {
  const { title, amount, type, date } = req.body;
  const newTransaction = {
    id: Date.now(),
    title: title || "Untitled",
    amount: parseFloat(amount),
    type,
    date
  };
  transactions.push(newTransaction);
  console.log("Yeni Transaction:", newTransaction);
  res.redirect("/");
});

// Edit Page
app.get("/edit/:id", (req, res) => {
  const transaction = transactions.find(t => t.id == req.params.id);
  res.render("edit", { transaction });
});

app.post("/edit/:id", (req, res) => {
  const { title, amount, type, date } = req.body;
  const idx = transactions.findIndex(t => t.id == req.params.id);
  if (idx !== -1) {
    transactions[idx].title = title;
    transactions[idx].amount = parseFloat(amount);
    transactions[idx].type = type;
    transactions[idx].date = date;
  }
  res.redirect("/");
});

// Delete
app.get("/delete/:id", (req, res) => {
  transactions = transactions.filter(t => t.id != req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));
