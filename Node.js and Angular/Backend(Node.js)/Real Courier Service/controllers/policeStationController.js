const db = require("../db");

exports.getAll = (req, res) => { 
  db.query("SELECT * FROM policestations", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getByDistrict = (req, res) => {
  db.query(
    "SELECT * FROM policestations WHERE district_id=?",
    [req.params.district_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

exports.createPoliceStation = (req, res) => {
  const { name, district_id } = req.body;
  db.query("INSERT INTO policestations (name, district_id) VALUES (?, ?)", [name, district_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, district_id });
  });
};

exports.updatePoliceStation = (req, res) => {
  const { name, district_id } = req.body;
  db.query("UPDATE policestations SET name=?, district_id=? WHERE id=?", [name, district_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Police Station updated successfully" });
  });
};

exports.deletePoliceStation = (req, res) => {
  db.query("DELETE FROM policestations WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Police Station deleted successfully" });
  });
};
