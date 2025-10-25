const db = require("../db");




exports.getAllCountries = (req, res) => {
  db.query("SELECT * FROM countries", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCountryById = (req, res) => {
  
  db.query("SELECT * FROM countries WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

exports.createCountry = (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO countries (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name });
  });
};

exports.updateCountry = (req, res) => {
  const { name } = req.body;
  db.query("UPDATE countries SET name=? WHERE id=?", [name, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Country updated successfully" });
  });
};

exports.deleteCountry = (req, res) => {
  db.query("DELETE FROM countries WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Country deleted successfully" });
  });
};
