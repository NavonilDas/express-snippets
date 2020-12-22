import express from "express";

const app = express();
const PORT = 1001;


app.listen(PORT, () => console.log(`Working at http://localhost:${PORT}/`))