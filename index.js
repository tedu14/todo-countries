let tabCountries = selectElement('#tabCountries');
let tabFavorites = selectElement('#tabFavorite');
let countCountries = selectElement('#countCountries');
let countFavorites = selectElement("#countFavorites");
let totalPopulationList = selectElement("#totalPopulationList");
let totalPopulationFavorites = selectElement('#totalPopulationFavorite');
let allcountries = [];
let favoritesCountries = [];
let numberFormat = Intl.NumberFormat('pt-br');

function start() {
    fectCountries();
}

function selectElement(element) {
    return document.querySelector(element);
}

async function fectCountries() {
    let res = await fetch('http://restcountries.eu/rest/v2/all');
    let countries = await res.json();

    allcountries = countries.map((country) => {
        const { numericCode, translations, population, flag } = country;
        return {
            id: numericCode,
            name: translations.pt,
            population,
            formatedPopulation: formatNumber(population),
            flag,
        }
    })

    render();
}

function render() {
    renderCountrieList();
    renderFavorites();
    renderSummary();
    handleCountryButtons();
}

function renderCountrieList() {
    let countries = '';

    allcountries.forEach(country => {
        const { name, flag, id, formatedPopulation } = country;

        const content = `
            <div class="country">
                <div>
                    <a id="${id}" class="btn add">+</a>
                </div>
                <div>
                    <img src="${flag}" alt="${name}">
                </div>
                <div>
                    <ul>
                        <li>${name}</li>
                        <li>${formatedPopulation}</li>
                    </ul>
                </div>
            </div>
        `
        countries += content;
    });

    tabCountries.innerHTML = countries;
}

function renderFavorites() {
    let favorites = '';

    favoritesCountries.forEach(country => {
        const { name, flag, id, formatedPopulation } = country;

        const content = `
            <div class="favorite">
                <div>
                    <a id="${id}" class="btn remove">-</a>
                </div>
                <div>
                    <img src="${flag}" alt="${name}">
                </div>
                <div>
                    <ul>
                        <li>${name}</li>
                        <li>${formatedPopulation}</li>
                    </ul>
                </div>
            </div>
        `

        favorites += content;
    })

    tabFavorites.innerHTML = favorites;
}

function renderSummary() {
    let totalPeoples = allcountries.reduce((acc, crr) => {
        return acc + crr.population;
    }, 0);

    let totalFavorites = favoritesCountries.reduce((acc, crr) => {
        return acc + crr.population;
    }, 0);

    totalPopulationList.textContent = formatNumber(totalPeoples);
    totalPopulationFavorites.textContent = formatNumber(totalFavorites);
    countCountries.textContent = allcountries.length;
    countFavorites.textContent = favoritesCountries.length;

}

function handleCountryButtons() {
    const countryBtns = Array.from(tabCountries.querySelectorAll('.btn'));
    const favoriteBtns = Array.from(tabFavorites.querySelectorAll('.btn'));

    countryBtns.forEach(btn => {
        btn.addEventListener('click', () => addToFavorites(btn.id));
    });

    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', () => removeFromFavorites(btn.id));
    })
}

function addToFavorites(id) {
    const countryToAdd = allcountries.find(btn => btn.id === id);

    favoritesCountries = [...favoritesCountries, countryToAdd];

    favoritesCountries.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    allcountries = allcountries.filter(country => country.id !== id);

    render();
}

function removeFromFavorites(id) {
    const countryToRemove = favoritesCountries.find(btn => btn.id === id);

    allcountries = [...allcountries, countryToRemove];

    allcountries.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    favoritesCountries = favoritesCountries.filter(country => country.id !== id);

    render();
}

function formatNumber(number) {
    return numberFormat.format(number);
}


start();