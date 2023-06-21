const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

const convertToPdfRoutes = require("./routes/convertToPdf");
const errorMiddleware = require("./middlewares/errors");


//config
dotenv.config({ path: "./config/config.env" });

//conneting to database
connectDatabase();
app.use("/api/v1/convert-to-pdf", convertToPdfRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT : ${process.env.PORT} on ${process.env.NODE_ENV} mode`,
  );
  //Middleware to handel error
  app.use(errorMiddleware);
});
