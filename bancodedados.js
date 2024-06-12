require("./configure");
const mongoose = require("mongoose");

function bancodedados() {
    mongoose.connect(conexaodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "erro ao tentar se conectar na database"));
    db.once("open", () => {
        console.log("conectei na database");
        return "conctado";
    });
}

module.exports.bancodedados = bancodedados;
