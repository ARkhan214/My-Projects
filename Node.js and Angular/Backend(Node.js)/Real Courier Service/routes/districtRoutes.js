const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/districtController");

router.get("/", ctrl.getAllDistricts);
router.get("/division/:divisionId", ctrl.getDistrictsByDivision);
router.post("/", ctrl.createDistrict);
router.put("/:id", ctrl.updateDistrict);
router.delete("/:id", ctrl.deleteDistrict);

module.exports = router;
