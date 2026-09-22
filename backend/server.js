import express from "express";
import cors from "cors";
import notesRoutes from "./src/routes/notesRoutes.js";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config();

console.log(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5001

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json());
app.use(rateLimiter)



app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
})

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
  app.listen(5001, () => {
    console.log("Server started on PORT:", PORT);
});
});
