const db = require("../db");

exports.getAllAddresses = (req, res) => {
  db.query(
    `SELECT a.*, c.name AS country, d.name AS division, 
    dis.name AS district, 
    p.name AS police_station
     FROM address a
     JOIN countries c ON a.country_id = c.id
     JOIN divisions d ON a.division_id = d.id
     JOIN districts dis ON a.district_id = dis.id
     JOIN policestations p ON a.police_station_id = p.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

exports.createAddress = (req, res) => {
  const { address_line_1, address_line_2, country_id, division_id, district_id, police_station_id } = req.body;
  db.query(
    "INSERT INTO address (address_line_1, address_line_2, country_id, division_id, district_id, police_station_id) VALUES (?, ?, ?, ?, ?, ?)",
    [address_line_1, address_line_2, country_id, division_id, district_id, police_station_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
};

exports.deleteAddress = (req, res) => {
  db.query("DELETE FROM address WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Address deleted successfully" });
  });
};
