'use strict';

console.log('>> Ready :)');

let data;
let recipeName;
let recipeIngredients;
const URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
const onButton = document.querySelector('.selected-button');
const offButton = document.querySelector('.deselected-button');
const mainTitle = document.querySelector('.header-title');
const ingredientsList = document.querySelector('.ingredients-list');
const summaryList = document.querySelector('.summary-list');

let summaryPrices = {
  Items: 0,
  Subtotal: 0,
  'Gastos de envio': undefined,
  Total: 0
};

// Recupero datos de LocalStorage si los hubiese
data = JSON.parse(localStorage.getItem('recipe'));
console.log('data after get', data);


// Si en el localStorage no hubiese nada sería data = null, hago llamada a la API
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

if (data !== null) {
  recipeName = data.recipe.name;
  recipeIngredients = data.recipe.ingredients;
  console.log('name', recipeName);
  console.log('ingredients', recipeIngredients);
}


// Añadir título principal a la página
function addTitle() {
  const recipeTitle = data.recipe.name;
  let newTitleContent = document.createTextNode(recipeTitle);
  mainTitle.appendChild(newTitleContent);
}

// Creo la lista de todos los ingredientes de la receta, primera sección
function addIngredientsList() {
  const recipeIngredients = data.recipe.ingredients;
  console.log('allIr', recipeIngredients);
  for (const ingredient of recipeIngredients) {
    console.log('ingre', ingredient);
    let newListItem = document.createElement('li');
    newListItem.append(createCheckbox(ingredient), addIngredientNumberItems(ingredient), addIngredientInfo(ingredient), addIngredientPrice(ingredient));
    console.log('list', newListItem);
    ingredientsList.appendChild(newListItem);
    console.log('list completed', ingredientsList);
  }
}

// Creo input checkbox con su label
function createCheckbox(ingredient) {
  const ingredientName = ingredient.product;
  const newCheckboxLabel = document.createElement('label');
  newCheckboxLabel.setAttribute('for', ingredientName);
  const newCheckbox = document.createElement('input');
  newCheckbox.setAttribute('type', 'checkbox');
  newCheckbox.setAttribute('name', 'ingredient');
  newCheckbox.setAttribute('id', ingredientName);
  return newCheckboxLabel.appendChild(newCheckbox);
}

// Añado el número de items del ingrediente
function addIngredientNumberItems(ingredient) {
  const ingredientItem = ingredient.items;
  const newIngredientItem = document.createElement('div');
  const newItemContent = document.createTextNode(ingredientItem);
  newIngredientItem.appendChild(newItemContent);
  return newIngredientItem;
}


// Añado la info del ingrediente: nombre, marca, cantidad
function addIngredientInfo(ingredient) {
  const ingredientInfo = ingredient;
  const newInfoWrapper = document.createElement('div');

  const newIngredientTitle = document.createElement('h2');
  const newTitleContent = document.createTextNode(ingredientInfo.product);
  newIngredientTitle.appendChild(newTitleContent);

  const newBrand = document.createElement('p');
  const newBrandContent = document.createTextNode(ingredientInfo.brand || 'Sin marca');
  newBrand.appendChild(newBrandContent);

  const newQuantity = document.createElement('p');
  const newQuantityContent = document.createTextNode(ingredientInfo.quantity);
  newQuantity.appendChild(newQuantityContent);

  newInfoWrapper.append(newIngredientTitle, newBrand, newQuantity);
  return newInfoWrapper;
}

// Añado precio del ingrediente
function addIngredientPrice(ingredient) {
  const ingredientPrice = ingredient.price;
  const currency = data.recipe.currency;
  const newPrice = document.createElement('div');
  const newPriceContent = document.createTextNode(ingredientPrice + ' ' + currency);
  newPrice.appendChild(newPriceContent);
  return newPrice;
}

// Creo lista resumen precio productos



// Creo los items de la lista resumen
function addSummaryList() {
  for (const itemList in summaryPrices) {
    let listContent = itemList + ': ' + summaryPrices[itemList] + ' ' + data.recipe.currency;
    console.log(listContent);
    const newItemList = document.createElement('li');
    const newItemListContent = document.createTextNode(listContent);
    newItemList.appendChild(newItemListContent);
    summaryList.appendChild(newItemList);
  }
  console.log('summary final', summaryList);
  
}

addTitle();
addIngredientsList();

summaryPrices['Gastos de envio'] = data.recipe['shipping-cost'];
summaryPrices['Total'] = summaryPrices['Items'] + summaryPrices['Subtotal'] + summaryPrices['Gastos de envio'];
console.log('resumen', summaryPrices);

addSummaryList();


function selectedAll() {
  console.log('click seleccionar');
}

function deselectedAll() {
  console.log('click deseleccionar');
}

onButton.addEventListener('click', selectedAll);
offButton.addEventListener('click', deselectedAll);

console.log('data final', data);