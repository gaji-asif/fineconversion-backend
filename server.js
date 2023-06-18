const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

const convertToPdfRoutes = require("./routes/convertToPdf");


//config
dotenv.config({ path: "./config/config.env" });

//conneting to database
connectDatabase();
app.use("/api/v1/convert-to-pdf", convertToPdfRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is working at http://localhost:${process.env.PORT}`);
});
