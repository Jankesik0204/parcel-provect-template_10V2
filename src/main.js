// main.js
import { fetchCountries } from './fetchCountries.js';

// Konfiguracja Notyf z niestandardowym kolorem dla powiadomień o błędzie
const notyf = new Notyf({
  types: [
    {
      type: 'error',
      background: 'lightblue',
      duration: 4000,
      dismissible: true,
    },
  ],
});

const searchBox = document.getElementById('search-box');
const resultsContainer = document.getElementById('results-container');
let debounceTimer;

const displayCountryItem = country => {
  const countryElement = document.createElement('div');
  countryElement.classList.add('country-item');

  const flagImg = document.createElement('img');
  flagImg.src = country.flags.svg;
  flagImg.alt = `Flag of ${country.name}`;
  flagImg.classList.add('country-flag');

  const countryName = document.createElement('span');
  countryName.textContent = country.name;
  countryName.classList.add('country-name');

  countryElement.appendChild(flagImg);
  countryElement.appendChild(countryName);

  return countryElement;
};

const displaySingleCountry = country => {
  const countryElement = document.createElement('div');
  countryElement.classList.add('country-detail');

  const flagImg = document.createElement('img');
  flagImg.src = country.flags.svg;
  flagImg.alt = `Flag of ${country.name}`;
  flagImg.classList.add('country-flag-large');

  const countryName = document.createElement('h1');
  countryName.textContent = country.name;
  countryName.classList.add('country-name-large');

  countryElement.appendChild(flagImg);
  countryElement.appendChild(countryName);

  const details = ['capital', 'population', 'languages'].map(detail => {
    const detailElement = document.createElement('p');
    detailElement.textContent = `${
      detail.charAt(0).toUpperCase() + detail.slice(1)
    }: ${
      detail === 'languages'
        ? country[detail].map(lang => lang.name).join(', ')
        : country[detail]
    }`;
    detailElement.classList.add('country-detail-info');
    return detailElement;
  });

  details.forEach(detail => countryElement.appendChild(detail));

  resultsContainer.appendChild(countryElement);
};

const displayResults = countries => {
  resultsContainer.innerHTML = '';

  if (countries.length === 1) {
    // Wyświetla pojedynczy kraj z dużą flagą i informacjami
    displaySingleCountry(countries[0]);
  } else if (countries.length > 10) {
    // Wyświetla powiadomienie Notyf, gdy jest więcej niż 10 krajów
    notyf.error('Too many matches found. Please enter a more specific name.');
  } else {
    // Wyświetla listę krajów, gdy jest ich od 2 do 10
    countries.forEach(country => {
      const countryElement = displayCountryItem(country);
      resultsContainer.appendChild(countryElement);
    });
  }
};

searchBox.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const searchText = searchBox.value.trim();
    if (searchText) {
      fetchCountries(searchText)
        .then(data => {
          if (data.status === 404) {
            notyf.error('No matches found.');
          } else {
            displayResults(data);
          }
        })
        .catch(error => {
          console.error(error);
          notyf.error('Error fetching data.');
        });
    } else {
      resultsContainer.innerHTML = '';
    }
  }, 300);
});
