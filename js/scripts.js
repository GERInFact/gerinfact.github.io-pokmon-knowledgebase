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

    // Function to display pokemon entries
    function renderPokemonCards() {
      loadList().then(() => {
        repository.forEach(p => {
          addListItem(p);
        });
      });
    }

    // Function to load pokemons from an external server
    function loadList() {
      return $.ajax(apiUrl, { dataType: "json" })
        .then(res => {
          res.results.forEach(r => add(new Pokemon(r.name, r.url)));
          //   addSearchFunctionality();
        })
        .catch(err => console.log(err));
    }

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

    // Function to validate an object as pokemon
    function isPokemon(item) {
      return isObject(item) && isObjectEqual(item, new Pokemon());
    }

    // Function to validate an item as object
    function isObject(item) {
      return item !== null && item !== undefined && typeof item === "object";
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

    // Function to add a pokemon entry
    function addListItem(pokemon) {
      if (!isPokemon(pokemon)) return;

      $pokemonList.append(`<li class="pokemon-list_item-${pokemon.name}"></li>`);
      addItemButton(pokemon);
    }

    // Function to add an interactable button for the pokemon entry
    function addItemButton(pokemon) {
      var $listItem = $(`.pokemon-list_item-${pokemon.name}`);
      $listItem.append(
        `<button id="${pokemon.name}" class="item_button">${
          pokemon.name
        }</button>`
      );
      addItemButtonEvent(pokemon);
    }

    // Function to add an action for the pokemon entry button
    function addItemButtonEvent(pokemon) {
      var $itemButton = $(`#${pokemon.name}`);
      $itemButton.on("click", e => {
        e.preventDefault();
        showDetails(pokemon);
      });
    }

    return {
      add: add,
      getAll: getAll,
      getFiltered: getFiltered,
      remove: remove,
      renderPokemonCards: renderPokemonCards
    };
  })();

  pokemonRepository.renderPokemonCards();
})();
