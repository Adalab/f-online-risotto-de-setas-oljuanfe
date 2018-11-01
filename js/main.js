'use strict';

console.log('>> Ready :)');

let data;
const URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';



data = JSON.parse(localStorage.getItem('recipe'));
console.log('data after get', data);

if (data === null) {
  console.log('entrando if');
  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
      localStorage.setItem('recipe', JSON.stringify(json));
      return (data = json, console.log('data', data));
    });
}



console.log('data final', data);