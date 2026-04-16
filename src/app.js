const express = require("express");
const cors = require("cors");
const profilesRoute = require("./routes/profiles");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/profiles", profilesRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});