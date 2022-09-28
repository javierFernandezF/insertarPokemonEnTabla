const {Pool} = require("pg");

const config = {
    user: "postgres",
    host: "localhost",
    password: "N89651t",
    database: "Pokemones",
    port: 5432,
}

const pool = new Pool(config);

module.exports = {
    query: (text, params) => pool.query(text, params),
}
