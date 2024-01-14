export const fetchCountries = searchText => {
  const url = `https://restcountries.com/v2/name/${searchText}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
};
