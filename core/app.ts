import express from "express";
import bodyParser from "body-parser";
import userRoutes from "../routes/userRoutes";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;

