const express = require('express');
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(express.json()); 
const path = require("path");
app.use(cors());

app.use(fileUpload());


app.use(express.static(path.join(__dirname)));
 
module.exports = app; 