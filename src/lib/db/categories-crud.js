const axios = require('axios').default;


const getCategories = async() => {
    const replier = await fetch(`http://localhost:4000/shop/make/show/categories`, {
        method: 'GET',
    });
    const categories = await replier.json();
    return categories;
};

const getLastCategory = async() => {
    const replier = await fetch(`http://localhost:4000/shop/make/show/categories/last`, {
        method: 'GET',
    });
    const categories = await replier.json();
    return categories;
};

const addNewCategory = async( category = '') => {
    /**
     *  Peticion para agregar una nueva categoria.
     */
    const r = await axios.post(
        'http://localhost:4000/shop/make/add/category/', {
            nombre: category
         })
         .then(r => {
            if(r.status != 200) return false;
            return true;
        }).catch(r => null);
    return (r) ? r : false;
};

const updateCategory = async(id = 0, name = '') => {
    /**
     *  Peticion para actualizar una categoria.
     */
    const r = await axios.put(
        'http://localhost:4000/shop/make/update/category/', {
            id,
            nuevo: name
         })
         .then(r => {
            if(r.status != 200) return false;
            return true;
        }).catch(r => null);
    return (r) ? r : false;
};

const deleteCategory = async(id) => {
    /**
     *  Peticion para eliminar una categoria.
     */
    const r = await axios.delete(
        `http://localhost:4000/shop/make/delete/category/${id}`)
         .then(r => {
            if(r.status != 200) return false;
            return true;
        }).catch(r => null);
    return (r) ? r : false;
};


module.exports = {
    updateCategory,
    addNewCategory,
    getCategories,
    deleteCategory,
    getLastCategory
}