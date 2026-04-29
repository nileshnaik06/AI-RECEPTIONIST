require("dotenv").config();
const app = require("./src/app");
const CONNECTDB = require("./src/db/db");

CONNECTDB();
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
