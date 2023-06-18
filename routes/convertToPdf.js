const express = require("express");
const { imageToPdf } = require("../controllers/imageToPdfController");
const router = express.Router();

router.route("/jpg-to-pdf").post(imageToPdf);

module.exports = router;