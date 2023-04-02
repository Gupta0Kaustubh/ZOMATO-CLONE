import express from "express";
import dotenv from "dotenv";

// Database connection
import Connectdb from "./database/connection";

dotenv.config();

const zomato = express();

zomato.use(express.json());

zomato.get("/", (req, res) => {
    res.json({
        message: "Server is running ...",
    });
});

const PORT = 4000;

zomato.listen(PORT, () => {
    Connectdb()
        .then(() => {
            console.log("Server is running, and the database is connected successfully !!!");
        })
        .catch((error) => {
            console.log("Server is running, but the database connection failed");
            console.log(error);
        })
});