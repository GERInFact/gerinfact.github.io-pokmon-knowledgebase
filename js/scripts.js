(function() {
  // DOM Elements
  var $pokemonList = $(".main-content_pokemon-list");

  // Container for storing pokemon relevant data
  function Pokemon(name, detailsUrl) {
    this.name = name;
    this.details = {};
    this.detailsUrl = detailsUrl;
  }

  // List which contains all pokemons to display
  var pokemonRepository = (function() {
    var repository = [];
    var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

    // Function to add a new pokemon
    function add(pokemon) {
      if (!isPokemon(pokemon)) return;

      repository.push(pokemon);
    }

    // Function to get all pokemons listed
    function getAll() {
      return repository;
    }

    // Function to get all pokemons with the filter applied
    function getFiltered(filter) {
      if (!filter) return [];

      return repository.filter(c =>
        String(Object.values(c))
          .toLowerCase()
          .includes(String(filter).toLowerCase())
      );
    }

    // Function to remove a certain pokemon
    function remove(pokemon) {
      if (!isPokemon(pokemon)) return;

      repository.splice(repository.indexOf(pokemon), 1);
    }

    // Function to validate object equality
    function isObjectEqual(original, clone) {
      var originalProperties = Object.keys(original);
      var cloneProperties = Object.keys(clone);

      if (!isPropertyCountEqual(originalProperties, cloneProperties))
        return false;

      for (var i = 0; i < originalProperties.length; i++)
        if (originalProperties[i] !== cloneProperties[i]) return false;

      return true;
    }

    // Function to validate property count equality
    function isPropertyCountEqual(originalProperties, cloneProperties) {
      return originalProperties.length === cloneProperties.length;
    }

    return {
      add: add,
      getAll: getAll,
      getFiltered: getFiltered,
      remove: remove,
    };
  })();
})();
