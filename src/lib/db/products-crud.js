let request = require('request');
const axios = require('axios').default;



const getProducts = async( categoria ) => {
    const replier = await fetch(`http://localhost:4000/shop/make/show/products/?category=${categoria}`, {
        method: 'GET',
    });
    const products = await replier.json();
    return products;
};

const getProductDetails = async ( product ) => {
  const response = await axios.get(`http://localhost:4000/shop/make/show/${product}/product_info`)
  const producto = response.data;
  return producto.product;
};

const addProduct = async ( { txtdescripcion, txtnombre, txtprecio1 = 0, txtprecio2 = 0, imageUrl, categoria }, resolve = (r) => {} ) => {
    let unitario = (txtprecio1 == txtprecio2) ? 1 : 2;
    const formData = {
        nombre:       txtnombre,
        descripcion:  txtdescripcion,
        precioch:     txtprecio1,
        preciog:      txtprecio2,
        unitario,
        url:          imageUrl,
        categoria:    categoria
    }; 
    const options = {
      'method': 'POST',
      'url': 'http://localhost:4000/shop/make/add/product',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: formData
    };
    request(options, (error, response) => {
      if (error) throw new Error(error);
      return resolve(response.statusCode);
    }); 
};

const updateProduct = async (id, nombre, descripcion, precioch, preciog, url, categoria) => {
  const productData = {
    nombre,
    descripcion,
    precioch,
    preciog,
    unitario: (precioch == preciog) ? 1 : 2,
    url,
    categoria
  };
  const response = await axios.put(`http://localhost:4000/shop/make/update/product/${id}`, productData);
  const { data } = response;
  return data;
};

const deleteProduct = async ( id ) => {
  const response = await axios.delete(`http://localhost:4000/shop/make/delete/product/${id}`);
  const { data } = response;
  return data;
};

const getAllIngredients = async () => {
  const response = await axios.get('http://localhost:4000/shop/make/show/ingredients');
  const { data } = response;
  return data;
};

const createNewIngredient = async ( name ) => {
  const response = await axios.post('http://localhost:4000/shop/make/create/ingredient', { name });
  const { data } = response;
  return data;
};

const updateIngedient = async (id, name) => {
  const response = await axios.put(`http://localhost:4000/shop/make/edit/ingredient/${id}`, { name });
  const { data } = response;
  return data;
};

const deleteIngredient = async (id) => {
  const response = await axios.delete(`http://localhost:4000/shop/make/delete/ingredient/${id}`);
  const { data } = response;
  return data;
};

const addIngredientToProduct = async (productId, ingredientId) => {
  const response = await axios.post('http://localhost:4000/shop/make/add/product_to_ingredient', { productId, ingredientId });
  const { data } = response;
  return data;
};

const quitIngredientToProduct = async (productId, ingredientId) => {
  const response = await axios.post('http://localhost:4000/shop/make/quit/ingredient_to_product', { productId, ingredientId });
  const { data } = response;
  return data;
};

const getIngredientsOfProduct = async ( id ) => { 
  const response = await axios.get(`http://localhost:4000/shop/make/show/${id}/ingredients`);
  const { data } = response;
  return data;
}

module.exports = {
    getProducts,
    addProduct,
    getProductDetails,
    updateProduct,
    deleteProduct,
    getAllIngredients,
    createNewIngredient,
    updateIngedient,
    deleteIngredient,
    addIngredientToProduct,
    quitIngredientToProduct,
    getIngredientsOfProduct
}