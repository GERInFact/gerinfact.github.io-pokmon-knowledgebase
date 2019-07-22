(function() {
  // DOM Elements
  var $pokemonList = $(".main-content_pokemon-list");

  // Container for storing pokemon relevant data
  function Pokemon(name, detailsUrl) {
    this.name = name;
    this.details = {};
    this.detailsUrl = detailsUrl;
  }

  var modalBox = (function() {
    var $modalContainer = $("#modal-container");

    // Function to hide pokemon details
    function hide() {
      $modalContainer.hide();
    }

    // Function to display pokemon details
    function show(pokemon) {
      if (!$modalContainer) return;

      $modalContainer.innerHTML = "";
      $modalContainer.show();
      addModal();
      var $modal = $(".modal");
      setModalContent($modal, pokemon);
      renderModal($modal);
    }

    // Function to create modal box for pokemon details
    function addModal() {
      requestAnimationFrame(() => {
        $modalContainer.append('<div class="modal"></div>');
      });
    }

    // Function to create modal box content
    function setModalContent($modal, pokemon) {
      if (!pokemon || !$modal) return;

      addHeader($modal, pokemon);
      // TODO REVISE WITH JQUERY
      $modal.appendChild(getImage(pokemon.details));
      $modal.appendChild(getInfos(pokemon.details));
    }

    // Function to create modal header
    function addHeader($modal, pokemon) {
      $modal.append('<div class="modal_header"></div>');
      setCloseButton($modal);
      addTitle($modal, pokemon);
    }

    // Function to create close button
    function setCloseButton($modal) {
      $modal.append('<button class="modal_close">Close</button>');
      var $closeButton = $(".modal_close");
      $closeButton.on("click", hide);
    }

    // Function to create modal box title
    function addTitle($modal, pokemon) {
      $modal.append(`<h2 class="modal_title">${pokemon.name}</h2>`);
    }

    // Function to get modal box image
    function getImage(pokemonDetails) {
      var image = document.createElement("img");
      image.setAttribute("src", pokemonDetails.sprites.front_default);
      image.setAttribute(
        "alt",
        `The front view of ${pokemonDetails.species.name}`
      );
      image.classList.add("modal_image");
      return image;
    }

    // Function to get modal box info text
    function getInfos(pokemonDetails) {
      var textContainer = document.createElement("div");
      textContainer.classList.add("modal_text-container");

      Object.keys(pokemonDetails).forEach(p => {
        if (!Array.isArray(pokemonDetails[p]) && !isObject(pokemonDetails[p])) {
          textContainer.appendChild(getInfoElement(pokemonDetails, p));
        }
      });

      return textContainer;
    }

    // Function to get info texts subtext
    function getInfoElement(pokemonDetails, property) {
      var info = document.createElement("p");
      info.classList.add("text-container_item");
      info.innerText = `${property}: ${pokemonDetails[property]}`;
      return info;
    }

    // Function to close modal on ESCAPE pressed
    window.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;

      hide();
    });

    // Function to close modal, if clicked around it
    $modalContainer.addEventListener("click", e => {
      e.preventDefault();

      if (e.target !== $modalContainer) return;

      hide();
    });

    return {
      show: show,
      hide: hide
    };
  })();

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

      $pokemonList.append(
        `<li class="pokemon-list_item-${pokemon.name}"></li>`
      );
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
    // Function to show pokemon details
    function showDetails(pokemon) {
      if (!isPokemon(pokemon)) return;

      loadDetails(pokemon).then(() => modalBox.show(pokemon));
    }

    // Function to load pokemon details form external server
    function loadDetails(pokemon) {
      return $.ajax(pokemon.detailsUrl, { dataType: "json" })
        .then(res => {
          pokemon.details = JSON.parse(JSON.stringify(res));
        })
        .catch(err => console.log(err));
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
