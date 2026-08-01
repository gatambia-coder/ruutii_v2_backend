const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.resolve(__dirname, ".env"),
});

console.log(process.env.MONGO_URI);

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Ruutii API running on port ${PORT}`);
    });
}

startServer();