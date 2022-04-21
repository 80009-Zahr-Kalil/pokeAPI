const pokeAPI = 'https://pokeapi.co/api/v2/pokemon';

let currentPage = 1;
const paginationPages = 5;

let items = [];
for (let i = 1; i <= 22; i++) {
  let str = `Item ${i}`;
  items.push(str);
}

async function fetchData(url) {
  const data = await fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));

  return data;
}

function capitalizeName(name) {
  const res = name.charAt(0).toUpperCase() + name.slice(1);

  return res;
}

function getPokemonTypes(types) {
  let res = 'Types: ';
  for (let i = 0; i < types.length; i++) {
    let type = types[i].type.name;
    type = capitalizeName(type);

    res += type;

    if (i !== types.length - 1) {
      res += ', ';
    }
  }

  return res;
}

function getPokemonHeight(height) {
  let res = 'Height: ';
  height *= 10;

  res += height + ' cm';

  return res;
}

function getPokemonWeight(weight) {
  let res = 'Weight: ';
  weight /= 10;

  res += weight + ' kg';

  return res;
}

function getPokemonNumber(id) {
  let str = id.toString();
  let res = '#';
  if (str.length === 1) res += `00${id}`;
  if (str.length === 2) res += `0${id}`;
  if (str.length === 3) res += `${id}`;

  return res;
}

function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemonCard');

  const pokemonImage = document.createElement('img');
  pokemonImage.classList.add('pokemonImage');
  pokemonImage.setAttribute('src', pokemon.sprites.front_default);

  const pokemonName = document.createElement('p');
  pokemonName.classList.add('pokemonName');
  pokemonName.innerHTML = capitalizeName(pokemon.name);

  const pokemonTypes = document.createElement('p');
  pokemonTypes.classList.add('pokemonTypes');
  pokemonTypes.innerHTML = getPokemonTypes(pokemon.types);

  const pokemonHeight = document.createElement('h6');
  pokemonHeight.classList.add('pokemonHeight');
  pokemonHeight.innerHTML = getPokemonHeight(pokemon.height);

  const pokemonWeight = document.createElement('h6');
  pokemonWeight.classList.add('pokemonWeight');
  pokemonWeight.innerHTML = getPokemonWeight(pokemon.weight);

  const pokemonNumber = document.createElement('p');
  pokemonNumber.classList.add('pokemonNumber');
  pokemonNumber.innerHTML = getPokemonNumber(pokemon.id);

  pokemonCard.appendChild(pokemonImage);
  pokemonCard.appendChild(pokemonNumber);
  pokemonCard.appendChild(pokemonName);
  pokemonCard.appendChild(pokemonTypes);
  pokemonCard.appendChild(pokemonHeight);
  pokemonCard.appendChild(pokemonWeight);

  document.getElementById('container').appendChild(pokemonCard);
}

async function renderCards(pokemonList) {
  for (const pokemon of pokemonList) {
    const pokemonData = await fetchData(pokemon.url);

    createPokemonCard(pokemonData);
  }
}

async function getPokemons(pageNumber) {
  document.getElementById('container').innerHTML = '';
  pageNumber--;

  let limit = 20;
  let offset = limit * pageNumber;

  let queryParams = `?offset=${offset}&limit=${limit}`;
  let data = await fetchData(pokeAPI + queryParams);

  const listedPokemons = data.results;
  renderCards(listedPokemons);
}

function createPaginationButton(page) {
  let button = document.createElement('button');
  button.classList.add('paginationButton');
  button.innerHTML = page;

  if (page === currentPage) button.classList.add('active');

  button.addEventListener('click', () => {
    // if (page === '$laquo;' && currentPage > 1) currentPage--;
    // else if (page === '$raquo;' && currentPage < 5) currentPage++;
    // else currentPage = page;
    currentPage = page;
    getPokemons(currentPage);

    let currentButton = document.querySelector('#pagination button.active');
    currentButton.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

function setupPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  // let previousButton = createPaginationButton('&laquo;');
  // pagination.appendChild(previousButton);

  for (let i = 1; i < paginationPages + 1; i++) {
    let button = createPaginationButton(i);
    pagination.appendChild(button);
  }

  // let nextButton = createPaginationButton('&raquo;');
  // pagination.appendChild(nextButton);
}

async function getCountPokemons() {
  let data = await fetchData(pokeAPI);
  return data.count;
}

async function getPokemonNames() {
  let countPokemon = await getCountPokemons();

  let data = await fetchData(
    `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${countPokemon}`
  );
  let arrPokemonNames = [];

  data.results.forEach((pokemon) => {
    arrPokemonNames.push(pokemon.name);
  });

  return arrPokemonNames.sort();
}

function filterPokemonNames(arrPokemonNames, filter) {
  let arrFilterPokemonNames = [];

  arrPokemonNames.forEach((pokemon) => {
    if (pokemon.startsWith(filter)) arrFilterPokemonNames.push(pokemon);
  });

  return arrFilterPokemonNames;
}

async function loadPokemonOptions(dataList, limit) {
  let filter = document.getElementById('searchInput').value;
  let arrPokemonNames = await getPokemonNames();

  let arrFilterPokemonNames = filterPokemonNames(arrPokemonNames, filter);

  for (let i = 0; i < arrFilterPokemonNames.length; i++) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', capitalizeName(arrFilterPokemonNames[i]));

    dataList.appendChild(newOption);
  }
}

function searchPokemon() {
  let limit = 10;
  let dataList = document.getElementById('pokemonOptions');
  dataList.innerHTML = '';
  loadPokemonOptions(dataList, limit);
}

getPokemons(currentPage);
setupPagination();
