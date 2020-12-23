import express from "express";

const app = express();
const PORT = 1001;

require('./mongoose_model/db');

app.listen(PORT, () => console.log(`Working at http://localhost:${PORT}/`));