const db = require("../db");

exports.getAllDistricts = (req, res) => {
  db.query("SELECT * FROM districts", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getDistrictsByDivision = (req, res) => {
  db.query("SELECT * FROM districts WHERE division_id=?", [req.params.divisionId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createDistrict = (req, res) => {
  const { name, division_id } = req.body;
  db.query("INSERT INTO districts (name, division_id) VALUES (?, ?)", [name, division_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, division_id });
  });
};

exports.updateDistrict = (req, res) => {
  const { name, division_id } = req.body;
  db.query("UPDATE districts SET name=?, division_id=? WHERE id=?", [name, division_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "District updated successfully" });
  });
};

exports.deleteDistrict = (req, res) => {
  db.query("DELETE FROM districts WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "District deleted successfully" });
  });
};
