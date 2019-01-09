const pokedex = require('../data/pokemon.json');
var nanoid = require('nanoid');
const config = require('../config/config.json');
exports.createblockdata = function()
{
	var data= {
		id: nanoid(),
		Pokemon: this.grabpokemon(),
		Shiny: this.isshiny(),
		Stats: this.grabstats(),
		Owner: this.grabOwner()
	}
	return JSON.stringify(data);
}

exports.grabpokemon = function()
{
	var pokemin = config.Pokemon.MinID;
	var pokemax = config.Pokemon.MaxID;
	var id = this.getRandomInt(pokemin, pokemax);
	var pokemon = this.getPokemonByID(id);
	return pokemon;
}

exports.isshiny = function()
{
	var shinymax = config.Pokemon.ShinyMax;
	var shinymin = config.Pokemon.ShinyMin;
	var randonum = this.getRandomInt(shinymax, shinymin);
	if (randonum == 420)
	{
		return true;
	}
	else
	{
		return false;
	}
}

exports.grabstats = function()
{
	var statsmin = config.Pokemon.StatsMin;
	var statsmax = config.Pokemon.StatsMax;
	var stats = 
	{
		hp: this.getRandomInt(statsmax, statsmin),
		attack: this.getRandomInt(statsmax, statsmin),
		defense: this.getRandomInt(statsmax, statsmin),
		speed: this.getRandomInt(statsmax, statsmin),
		spatk: this.getRandomInt(statsmax, statsmin),
		spdef: this.getRandomInt(statsmax, statsmin)
	}
	return stats;
}

exports.grabOwner = function()
{
	return 'ash';
}

exports.getRandomInt = function(max, min = 0) {
	return Math.floor(Math.random() * (max - min) + min);
}

exports.getPokemonByID = function(ID) {
  return pokedex.filter(
	function(pokedex){return pokedex.id == ID}
  );
}