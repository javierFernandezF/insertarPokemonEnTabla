const axios = require("axios");
const express = require("express");
const db = require("./db/index");

const app = express();

const bgc = [
  { name: "rock", color: "#869E31" },
  { name: "ghost", color: "#70559B" },
  { name: "steel", color: "#8789D0" },
  { name: "water", color: "#6493EB" },
  { name: "grass", color: "#74CB4B" },
  { name: "psychic", color: "#FB5584" },
  { name: "ice", color: "#9AD6DF" },
  { name: "dark", color: "#75574C" },
  { name: "fairy", color: "#E69EAC" },
  { name: "normal", color: "#AAA67F" },
  { name: "fighting", color: "#C12239" },
  { name: "flying", color: "#A891EC" },
  { name: "poison", color: "#A43E9E" },
  { name: "ground", color: "#DEC16B" },
  { name: "bug", color: "#A78723" },
  { name: "fire", color: "#F57D31" },
  { name: "electric", color: "#F9CF30" },
  { name: "dragon", color: "#7037FF" },
];

app.get("/", async (req, res) => {
  //Hago un fetch dentro del array donde estan todos los poke con sus url

  const allPoke = await axios(
    "https://pokeapi.co/api/v2/pokemon?offset=&limit=1000000"
  );
  const allPokeResults = allPoke.data.results;

  for (let index = 0; index < 151; index++) {
    // Por si se necesita completar con todos los pokemons del array copiar en el for: allPoke.data.results.length

    const pokemonsArray = await axios(allPokeResults[index].url);

    const pokemonsArrayData = pokemonsArray.data;
    const findFirstColor = bgc.find(
      (n) => n.name === pokemonsArrayData.types[0].type.name
    );
    const findSecondColor =
      pokemonsArrayData.types.length > 1
        ? bgc.find((n) => n.name === pokemonsArrayData.types[1].type.name)
        : "";

    //La descripcion del pokemon se encontra en otra url po lo que hago otro fetch

    const goToDescription = await axios(pokemonsArray.data.species.url);

    const gotoDescriptionData = goToDescription.data.flavor_text_entries;

    const findSpanishDescriptionPoke = gotoDescriptionData.find(
      (n) => n.language.name === "en"
    );

    let pokeTabla = {
      idPokemon: pokemonsArrayData.id,
      name: pokemonsArrayData.name,
      img: pokemonsArrayData.sprites.other["official-artwork"].front_default,
      type: pokemonsArrayData.types[0].type.name,
      type2:
        pokemonsArrayData.types.length > 1
          ? pokemonsArrayData.types[1].type.name
          : "",
      weight: pokemonsArrayData.weight,
      height: pokemonsArrayData.height,
      description: findSpanishDescriptionPoke.flavor_text,
      hp: pokemonsArrayData.stats[0].base_stat,
      atk: pokemonsArrayData.stats[1].base_stat,
      def: pokemonsArrayData.stats[2].base_stat,
      satk: pokemonsArrayData.stats[3].base_stat,
      sdef: pokemonsArrayData.stats[4].base_stat,
      spd: pokemonsArrayData.stats[5].base_stat,
      bckcolor: findFirstColor.color,
      bckcolor2:
        pokemonsArrayData.types.length > 1 ? findSecondColor.color : "",
    };

    let dataMoves = {
      idPokemon: pokemonsArrayData.id,
      move1:
        pokemonsArrayData.moves.length > 0
          ? pokemonsArrayData.moves[0].move.name
          : "",
      move2:
        pokemonsArrayData.moves.length > 1
          ? pokemonsArrayData.moves[1].move.name
          : "",
    };
    console.log(pokeTabla);
    await db.query(
      "insert into poketabla (idPokemon, name, img, type, type2, weight, height, description, hp, atk, def ,satk, sdef, spd, bckcolor, bckcolor2) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
      [
        pokeTabla.idPokemon,
        pokeTabla.name,
        pokeTabla.img,
        pokeTabla.type,
        pokeTabla.type2,
        pokeTabla.weight,
        pokeTabla.height,
        pokeTabla.description,
        pokeTabla.hp,
        pokeTabla.atk,
        pokeTabla.def,
        pokeTabla.satk,
        pokeTabla.sdef,
        pokeTabla.spd,
        pokeTabla.bckcolor,
        pokeTabla.bckcolor2,
      ]
    );

    await db.query(
      "insert into datamoves (idPokemondatamoves, move1, move2) values($1, $2, $3)",
      [dataMoves.idPokemon, dataMoves.move1, dataMoves.move2]
    );
  }
  res.status(200).send("Termino.");
});

app.listen(3002, () => {
  console.log("corriendo en port 3002");
});
