const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/divisionController");

router.get("/", ctrl.getAllDivisions);
router.get("/:id", ctrl.getDivisionById);
router.get("/country/:countryId", ctrl.getDivisionsByCountry);
router.post("/", ctrl.createDivision);
router.put("/:id", ctrl.updateDivision);
router.delete("/:id", ctrl.deleteDivision);

module.exports = router;
