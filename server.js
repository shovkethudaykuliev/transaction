const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let transactions = [];

app.get("/", (req, res) => {
  let balance = 0;
  transactions.forEach(t => {
    if (t.type === "income") balance += Number(t.amount);
    else balance -= Number(t.amount);
  });
  res.render("home", { balance, transactions });
});

//add bolek

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const { title, amount, type } = req.body;
  transactions.push({
    id: Date.now(),
    title,
    amount,
    type,
    date: new Date().toLocaleString()
  });
  res.redirect("/");
});

// Edit bolegi


app.get("/edit/:id", (req, res) => {
  const transaction = transactions.find(t => t.id == req.params.id);
  res.render("edit", { transaction });
});

app.post("/edit/:id", (req, res) => {
  const { title, amount, type } = req.body;
  const idx = transactions.findIndex(t => t.id == req.params.id);
  if (idx !== -1) {
    transactions[idx].title = title;
    transactions[idx].amount = amount;
    transactions[idx].type = type;
  }
  res.redirect("/");
});

 //Delete bolek


app.get("/delete/:id", (req, res) => {
  transactions = transactions.filter(t => t.id != req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server running:localhost:${PORT}`));
