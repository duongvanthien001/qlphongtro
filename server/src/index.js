require("dotenv").config();
const express = require("express");
const indexRoute = require("./routes/index.route");
const prisma = require("./configs/prisma.config");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.ORIGIN_URL : "*",
  })
);

app.get("/", (_req, res) => {
  res.json("API QLPhongTro");
});

app.use("/api/v1", indexRoute);

const PORT = process.env.PORT || 3636;
app.listen(PORT, async () => {
  console.log(`Server is running on PORT: ${PORT}`);

  try {
    await prisma.$connect();
    console.log("Kết nối đến cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = app;
