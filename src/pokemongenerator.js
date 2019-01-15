const pokedex = require('../data/pokemon.json');
var nanoid = require('nanoid');
const config = require('../config/config.json');
exports.createpokemon = function(owner = null)
{
	var data= {
		id: nanoid(),
		Pokemon: this.grabpokemon(),
		Shiny: this.isshiny(),
		IVs: this.grabstats(),
		OriginalOwner: this.grabOwner(owner),
		Gender: this.grabgender()
	}
	return JSON.stringify(data);
}

exports.grabpokemon = function()
{
	var pokemin = config.Pokemon.MinID;
	var pokemax = config.Pokemon.MaxID;
	var id = this.getRandomInt(pokemin, pokemax);
	var pokemon = this.getPokemonByID(id);
	pokemon = pokemon[0];
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

exports.grabOwner = function(owner = null)
{
	if (owner == null)
	{
		return 'Ash';
	}
	else
	{
		return owner;
	}
}

exports.grabgender = function()
{
	var gender = this.getRandomInt(2,1);
	if (gender == 1)
	{
		return 'male';
	}
	else
	{
		return 'female';
	}
}

exports.getRandomInt = function(max, min = 0) {
	return Math.floor(Math.random() * (max - min) + min);
}

exports.getPokemonByID = function(ID) {
  return pokedex.filter(
	function(pokedex){return pokedex.id == ID}
  );
}