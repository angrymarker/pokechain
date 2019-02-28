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
		Gender: "male",
		Notechain: [],
		Nickname: ""
	}
	data.Nickname = data.Pokemon.name.english;
	data.Gender = this.grabgender(data.Pokemon.name.english);
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

exports.grabgender = function(name)
{
	if (getmaleonly().join(',').toLowerCase().indexOf(name.toLowerCase()) > -1)
	{
		return 'male';
	}
	if (getfemaleonly().join(',').toLowerCase().indexOf(name.toLowerCase()) > -1)
	{
		return 'female';
	}
	if (getnonbinary().join(',').toLowerCase().indexOf(name.toLowerCase()) > -1)
	{
		return 'non-binary';
	}
	var gender = Math.random() < 0.5;
	if (gender == 1)
	{
		return 'male';
	}
	else
	{
		return 'female';
	}
}

function getnonbinary()
{
	return ['Magnemite', 'Magneton', 'Voltorb', 'Electrode', 'Staryu', 'Starmie', 'Porygon', 'Porygon2', 'Shedinja', 'Lunatone', 'Solrock', 'Baltoy', 'Claydol', 'Beldum', 'Metang', 'Metagross', 'Bronzor', 'Bronzong', 'Magnezone', 'Porygon-Z', 'Rotom', 'Phione', 'Manaphy', 'Klink', 'Klang', 'Klinklang', 'Cryogonal', 'Golett', 'Golurk', 'Carbink', 'Minior', 'Dhelmise', 'Ditto', 'Articuno', 'Zapdos', 'Moltres', 'Mewtwo', 'Mew', 'Unown', 'Raikou', 'Entei', 'Suicune', 'Lugia', 'Ho-Oh', 'Celebi', 'Regirock', 'Regice', 'Registeel', 'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi', 'Deoxys', 'Uxie', 'Mesprit', 'Azelf', 'Dialga', 'Palkia', 'Regigigas', 'Giratina', 'Darkrai', 'Shaymin', 'Arceus', 'Victini', 'Cobalion', 'Terrakion', 'Virizion', 'Reshiram', 'Zekrom', 'Kyurem', 'Keldeo', 'Meloetta', 'Genesect', 'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa', 'Volcanion', 'Type:', 'Null', 'Silvally', 'Tapu', 'Koko', 'Tapu', 'Lele', 'Tapu', 'Bulu', 'Tapu', 'Fini', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Necrozma', 'Magearna', 'Marshadow', 'PoipolePo', 'Naganadel', 'Stakataka', 'Blacephalon', 'Zeraora', 'Meltan', 'Melmetal'];
}

function getfemaleonly()
{
	return ['Nidoran♀', 'Nidorina', 'Nidoqueen', 'Smoochum', 'Latias', 'Happiny', 'Cresselia', 'Chansey', 'Kangaskhan', 'Jynx', 'Miltank', 'Blissey', 'Illumise', 'Wormadam', 'Vespiquen', 'Froslass', 'Petilil', 'Liligant', 'Vullaby', 'Mandibuzz', 'Flabébé', 'Floette', 'Florges', 'Salazzle', 'Bounsweet', 'Steenee', 'Tsareena'];
}

function getmaleonly()
{
	return ['Nidoran♂', 'Nidorino', 'Nidoking', 'Hitmonlee', 'Hitmonchan', 'Tauros', 'Hitmontop', 'Volbeat', 'Mothim', 'Gallade', 'Throh', 'Sawk', 'Rufflet', 'Braviary', 'Tyrogue', 'Latios', 'Tornadus', 'Thundurus', 'Landorus'];
}

exports.getRandomInt = function(max, min = 0) {
	return Math.floor(Math.random() * (max - min) + min);
}

exports.getPokemonByID = function(ID) {
  return pokedex.filter(
	function(pokedex){return pokedex.id == ID}
  );
}