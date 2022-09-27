const axios = require("axios");
const express = require("express");

const app = express();

const pokeDate = []

const bgc = [
    {name: "rock",
    color: "#869E31"},
    {name: "ghost",
    color:"#70559B"},
    {name: "steel",
    color:"#8789D0"},
    {name: "water",
    color: "#6493EB"},
    {name: "grass",
    color:"#74CB4B"},
    {name: "psychic",
    color:"#FB5584"},
    {name: "ice",
    color: "#9AD6DF"},
    {name: "dark",
    color:"#75574C"},
    {name: "fairy",
    color:"#E69EAC"},
    {name: "normal",
    color: "#AAA67F"},
    {name: "fighting",
    color:"#C12239"},
    {name: "flying",
    color:"#A891EC"},
    {name: "poison",
    color: "#A43E9E"},
    {name: "ground",
    color:"#DEC16B"},
    {name: "bug",
    color:"#A78723"},
    {name: "fire",
    color: "#F57D31"},
    {name: "electric",
    color:"#F9CF30"},
    {name: "dragon",
    color:"#7037FF"},
]


app.get("/", async (req,res) => {
    
    //Hago un fetch dentro del array donde estan todos los poke con sus url

    const allPoke = await axios('https://pokeapi.co/api/v2/pokemon?offset=&limit=1000000');
    const allPokeResults = allPoke.data.results;

    
        for (let index = 0; index < allPoke.data.results.length
            ; index++) {
            
            //allPoke.data.results.length
        
    
   

        const pokemonsArray = await axios(allPokeResults[index].url);
        

        const pokemonsArrayData = pokemonsArray.data;
        const findFirstColor = bgc.find (n => n.name === pokemonsArrayData.types[0].type.name);
        const findSecondColor =  pokemonsArrayData.types.length > 1 ? bgc.find (n => n.name === pokemonsArrayData.types[1].type.name) : "";
       
        //La descripcion del pokemon se encontra en otra url po lo que hago otro fetch

        const goToDescription = await axios(pokemonsArray.data.species.url);

        const gotoDescriptionData = goToDescription.data.flavor_text_entries;

        const findSpanishDescriptionPoke = gotoDescriptionData.find(n => n.language.name === "es" )

    
        

        const data = 
        {
        id: pokemonsArrayData.id,
        name: pokemonsArrayData.name,
        img: pokemonsArrayData.sprites.other["official-artwork"].front_default,
        type: pokemonsArrayData.types[0].type.name,
        type2: pokemonsArrayData.types.length > 1 ? pokemonsArrayData.types[1].type.name : "",
        weight: pokemonsArrayData.weight,
        height: pokemonsArrayData.height,
        moves: [pokemonsArrayData.moves.length > 0 ? pokemonsArrayData.moves[0].move.name : "" , pokemonsArrayData.moves.length > 1 ? pokemonsArrayData.moves[1].move.name : "" ],
        description: findSpanishDescriptionPoke.flavor_text,
        hp: pokemonsArrayData.stats[0].base_stat,
        atk: pokemonsArrayData.stats[1].base_stat,
        def: pokemonsArrayData.stats[2].base_stat,
        satk: pokemonsArrayData.stats[3].base_stat,
        sdef: pokemonsArrayData.stats[4].base_stat,
        spd: pokemonsArrayData.stats[5].base_stat,
        bckcolor: findFirstColor.color,
        bckcolor2: pokemonsArrayData.types.length > 1 ? findSecondColor.color :""
        
        };

        pokeDate.push(data)
    
    };
        
    
    return res.json(pokeDate);
   

    // return res.json(allPokeResults)



});

app.listen (3002, () => {
    // return console.log("pokemonsArrayData")
});