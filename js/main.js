'use strict';

console.log('>> Ready :)');

let data;
let originalData;
let totalNumberItems = 0;
let totalPriceItems = 0;
const URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
const onButton = document.querySelector('.selected-button');
const offButton = document.querySelector('.deselected-button');
const mainTitle = document.querySelector('.header-title');
const ingredientsList = document.querySelector('.ingredients-list');
const summaryList = document.querySelector('.summary-list');
const totalPurchase = document.querySelector('.total-container');


let summaryPrices = {
  Items: 0,
  Subtotal: 0,
  'Gastos de envio': undefined,
  Total: 0
};

// Recupero datos de LocalStorage si los hubiese
data = JSON.parse(localStorage.getItem('recipe'));
originalData = JSON.parse(localStorage.getItem('recipe'));
console.log('data after get', data);
console.log('data after get', originalData);


// Si en el localStorage no hubiese nada sería data = null, hago llamada a la API, si no, pinto html directamente
if (data === null) {
  console.log('entrando if');
  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
      localStorage.setItem('recipe', JSON.stringify(json));
      data = json;
      originalData = json;
      return (addHtml(), console.log('data', data));
    });
} else {
  addHtml();
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
  for (const ingredient of recipeIngredients) {
    let newListItem = document.createElement('li');
    newListItem.append(createCheckbox(ingredient), addIngredientNumberItems(ingredient), addIngredientInfo(ingredient), addIngredientPrice(ingredient));
    newListItem.setAttribute('class', 'ingredient-list-item list-group-item custom-control custom-checkbox d-flex');
    ingredientsList.appendChild(newListItem);
    // console.log('list completed', ingredientsList);
  }
}

// Creo input checkbox con su label
function createCheckbox(ingredient) {
  const ingredientName = ingredient.product;
  const newCheckboxWrapper = document.createElement('div');
  newCheckboxWrapper.setAttribute('class', 'custom-control custom-checkbox custom-control-inline');
  const newCheckboxLabel = document.createElement('label');
  newCheckboxLabel.setAttribute('for', ingredientName);
  newCheckboxLabel.setAttribute('class', 'custom-control-label');
  const newCheckbox = document.createElement('input');
  newCheckbox.setAttribute('type', 'checkbox');
  newCheckbox.setAttribute('name', 'ingredient');
  newCheckbox.setAttribute('class', 'checkbox custom-control-input');
  newCheckbox.setAttribute('id', ingredientName);
  // newCheckboxLabel.appendChild(newCheckbox);
  newCheckboxWrapper.append(newCheckbox, newCheckboxLabel);
  return newCheckboxWrapper;
}

// Añado el número de items del ingrediente en un input number
function addIngredientNumberItems(ingredient) {
  const ingredientItem = ingredient.items;
  const newItemLabel = document.createElement('label');
  newItemLabel.setAttribute('for', ingredient.product + '-number');
  const newIngredientItem = document.createElement('input');
  newIngredientItem.setAttribute('type', 'number');
  newIngredientItem.setAttribute('id', ingredient.product + '-number');
  newIngredientItem.setAttribute('class', 'item-number  form-control-sm ');
  newIngredientItem.setAttribute('max', 9);
  newIngredientItem.setAttribute('min', 0);
  newIngredientItem.setAttribute('value', ingredientItem);
  const newItemContent = document.createTextNode(ingredientItem);
  newIngredientItem.appendChild(newItemContent);
  return newIngredientItem;
}


// Añado la info del ingrediente: nombre, marca, cantidad
function addIngredientInfo(ingredient) {
  const ingredientInfo = ingredient;
  const newInfoWrapper = document.createElement('div');
  newInfoWrapper.setAttribute('class', 'info-ingredient-wrapper');

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
  newPrice.setAttribute('class','total-item-price text-success');
  newPrice.setAttribute('id',ingredientPrice);
  const newPriceContent = document.createTextNode(ingredientPrice + ' ' + currency);
  newPrice.appendChild(newPriceContent);
  return newPrice;
}


// Creo los items de la lista resumen de precios
function addSummaryList() {
  for (const itemList in summaryPrices) {
    let listContent = itemList + ': ' + summaryPrices[itemList] + ' ' + (itemList !=='Items'?data.recipe.currency:'');
    const newItemList = document.createElement('li');
    const newItemListContent = document.createTextNode(listContent);
    newItemList.appendChild(newItemListContent);
    summaryList.appendChild(newItemList);
  }
  console.log('summary final', summaryList);
}

// Creo el contenedor donde irá el precio final a pagar
function addTotalPurchase() {
  let purchaseContent = 'Comprar ingredientes: ' + summaryPrices['Total'] + ' ' + data.recipe.currency;
  const newPurchaseContent = document.createTextNode( purchaseContent);
  console.log(newPurchaseContent);
  console.log(totalPurchase);
  totalPurchase.appendChild(newPurchaseContent);
}

// Función crear elementos dinámicos
function addHtml() {
  // Sección 1
  addTitle();
  addIngredientsList();




  //Añado listener change input number para cantidad items
  const ingredientNumberItems = document.querySelectorAll('.item-number');
  for (const numberOfItems of ingredientNumberItems) {
    numberOfItems.addEventListener('change',function(){handleChangeNumber(pricePerItem);});
  }

  //Numero de items
  const itemNumber = document.querySelectorAll('.item-number');
  for(const number of itemNumber){
    totalNumberItems = totalNumberItems + parseInt(number.value);
  }


  // console.log('subtotal',totalPriceItems);

  // Añadir listener a los checkboxes evento click
  const checkboxes = document.querySelectorAll('.checkbox');
  for (const checkbox of checkboxes) {
    checkbox.addEventListener('click', selectItem);
  }

  // Añadir listeners a seleccionar y deseleccionar y pasar los checkboxes creados dinámicamente como argumento
  onButton.addEventListener('click', function() {selectedAll(checkboxes);});
  offButton.addEventListener('click',function(){ deselectedAll(checkboxes);});

  // Sección 2
  summaryPrices['Items'] = totalNumberItems;
  summaryPrices['Subtotal'] = totalPriceItems;
  summaryPrices['Gastos de envio'] = data.recipe['shipping-cost'];
  summaryPrices['Total'] = summaryPrices['Items'] + summaryPrices['Subtotal'] + summaryPrices['Gastos de envio'];
  console.log('resumen', summaryPrices);

  addSummaryList();

  // Precio total items
  const pricePerItem = document.querySelectorAll('.total-item-price');
  // updatePriceItem(pricePerItem);
  

  addTotalPurchase();
}

// Función para cambiar número items
function handleChangeNumber() {
  for(const ingredient of data.recipe.ingredients){
    if(ingredient.product + '-number' === event.currentTarget.id){
      ingredient.items = parseInt(event.currentTarget.value);
    }
  }
  console.log('new object', data.recipe.ingredients);
  updatePriceItem();
}

// Función para cambiar precio items TODO se cambia en el objeto data pero no se pinta
function updatePriceItem() {
  for (const ingredient of data.recipe.ingredients) {
    for (const originalIngredient of originalData.recipe.ingredients) {
      if (originalIngredient.product === ingredient.product) {
        console.log('originakprice', originalIngredient.price);
        ingredient.price = (parseFloat(originalIngredient.price) * ingredient.items);
        console.log('price', ingredient.price);
        addIngredientPrice(ingredient);
      }
    }
  }
  
  // for (const price of pricePerItem){
  //   // console.log('price', price.innerHTML);
  //   totalPriceItems = totalPriceItems + parseFloat( price.innerHTML);
  //   console.log('totalPrice', totalPriceItems);
  // }
  
}

// Función para seleccionar item
function selectItem(){
  !event.currentTarget.checked;
}

//Función para seleccionar todos los items
function selectedAll(checkboxes) {
  for (const checkbox of checkboxes) {
    checkbox.checked = true;
    checkbox.value = 'on';
  }
}

// Función para deseleccionar todos los items
function deselectedAll(checkboxes) {
  for (const checkbox of checkboxes) {
    checkbox.checked = false;
    checkbox.value = 'off';
  }
}


console.log('data final', data);
console.log('original', originalData);