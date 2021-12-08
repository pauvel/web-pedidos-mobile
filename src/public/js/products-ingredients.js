import { DialogForm } from '/js/modal_form.js';
const ingredientIda = document.querySelector('#cboxingredients');
const addButton = document.querySelector('#add-ingredient-button');
const addIngredientEndpoint = '/products/add/ingredient_to_product/';
const productIda = document.querySelector('#productId');
var xhttp = new XMLHttpRequest();

addButton.addEventListener('click', async(e) => {
     await DialogForm.ShowQuestionAsync('Agregar', '¿Desea agregar el ingrediente?')
                        .then(async  r => {
                            if(r == 'OK'){
                                await addIngredient(productIda.value, ingredientIda.value);
                                DialogForm.ShowWaiting('Espere...', 'Agregando ingrediente al producto...');
                                setTimeout(function(){
                                    location.reload();
                                }, 2000)
                            }
                        });
});

const addIngredient = async ( productId, ingredientId ) => {
    xhttp.open("POST", addIngredientEndpoint, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`productId=${productId}&ingredientId=${ingredientId}`);
}