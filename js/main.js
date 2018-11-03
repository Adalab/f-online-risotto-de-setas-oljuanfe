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

if (data !== null){
  recipeName = data.recipe.name;
  recipeIngredients = data.recipe.ingredients;
  console.log('name', recipeName);
console.log('ingredients', recipeIngredients);
}

function addTitle() {
  const recipeTitle = data.recipe.name;
  let newTitleContent = document.createTextNode(recipeTitle);
  mainTitle.appendChild(newTitleContent);
}

function addIngredientsList() {
  let newListItem = document.createElement('li');
  newListItem.append(createCheckbox(), addIngredientQuantity(), addIngredientInfo());
  console.log('list',newListItem);
}

function createCheckbox() {
  const ingredientName = data.recipe.ingredients[0].product;
  const newCheckboxLabel = document.createElement('label');
  newCheckboxLabel.setAttribute('for', ingredientName);
  const newCheckbox = document.createElement('input');
  newCheckbox.setAttribute('type','checkbox');
  newCheckbox.setAttribute('name', 'ingredient');
  newCheckbox.setAttribute('id', ingredientName);
  return newCheckboxLabel.appendChild(newCheckbox);
}

function addIngredientQuantity() {
  const ingredientItem = data.recipe.ingredients[0].items;
  const newIngredientItem = document.createElement('div');
  const newItemContent = document.createTextNode(ingredientItem);
  newIngredientItem.appendChild(newItemContent);
  return newIngredientItem;
}

function addIngredientInfo() {
  const ingredientInfo = data.recipe.ingredients[0];
  const newInfoWrapper = document.createElement('div');

  const newIngredientTitle = document.createElement('h2');
  const newTitleContent = document.createTextNode(ingredientInfo.product);
  newIngredientTitle.appendChild(newTitleContent);

  const newBrand = document.createElement('p');
  const newBrandContent = document.createTextNode(ingredientInfo.brand);
  newBrand.appendChild(newBrandContent);

  const newQuantity = document.createElement('p');
  const newQuantityContent = document.createTextNode(ingredientInfo.quantity);
  newQuantity.appendChild(newQuantityContent);

  newInfoWrapper.append(newIngredientTitle, newBrand, newQuantity);
  return newInfoWrapper;
}

addTitle();
createCheckbox();
addIngredientQuantity();
addIngredientInfo();
addIngredientsList();

function selectedAll(){
  console.log('click seleccionar');
}

function deselectedAll() {
  console.log('click deseleccionar');
}

onButton.addEventListener('click', selectedAll);
offButton.addEventListener('click', deselectedAll);

console.log('data final', data);