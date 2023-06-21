const express = require("express");
const { convertToPdf } = require("../controllers/officeToPdfController");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { imageToPdf } = require("../controllers/imageToPdfController");

const uploadFolder = "./public/uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname
      .replace(fileExt, "")
      .toLocaleLowerCase()
      .split(" ")
      .join("-") + '-' + Date.now();
    
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1e7, // 10MB
  },
});

router.route("/jpg-to-pdf").post(imageToPdf);
router.route("/office-to-pdf").post(upload.single("file"), convertToPdf);

module.exports = router;
