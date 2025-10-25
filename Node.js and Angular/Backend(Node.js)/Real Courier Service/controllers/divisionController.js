const db = require("../db");

exports.getAllDivisions = (req, res) => {
  db.query("SELECT * FROM divisions", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getDivisionById = (req, res) => {
  db.query("SELECT * FROM divisions WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

exports.getDivisionsByCountry = (req, res) => {
  db.query("SELECT * FROM divisions WHERE country_id=?", [req.params.countryId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createDivision = (req, res) => {
  const { name, country_id } = req.body;
  db.query("INSERT INTO divisions (name, country_id) VALUES (?, ?)", [name, country_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, country_id });
  });
};

exports.updateDivision = (req, res) => {
  const { name, country_id } = req.body;
  db.query("UPDATE divisions SET name=?, country_id=? WHERE id=?", [name, country_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Division updated successfully" });
  });
};

exports.deleteDivision = (req, res) => {
  db.query("DELETE FROM divisions WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Division deleted successfully" });
  });
};
