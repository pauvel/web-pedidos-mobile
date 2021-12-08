const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const { addNewCategory, updateCategory, getCategories, deleteCategory, getLastCategory } = require('../lib/db/categories-crud');
const { getIngredientsOfProduct, getProducts, addProduct, getProductDetails, updateProduct, deleteProduct, getAllIngredients, createNewIngredient, updateIngedient, deleteIngredient, addIngredientToProduct, quitIngredientToProduct } = require('../lib/db/products-crud');

// Settings
cloudinary.v2.config({ 
    cloud_name: 'dlds4xwpk', 
    api_key: '834812477524499', 
    api_secret: 'NkhBLCZBIopzm3BB0_ws_vj-238' 
  });

router.get('/', async(req, res)=>{
    // Enviamos a productos la ultima categoria agregada para mostrarla en la tabla.
    const { nombre } = await getLastCategory(); // Obtenemos la ultima categoria insertada.
    res.render('products/products', {
        lastCategory: nombre
    });
});

router.get('/categories', async(req, res)=>{
    // Muestra las categorias
    const categories = await getCategories();
    res.render('products/categories', {
        categorias: categories
    });
});

/**
 *  Agregar una categoria.
 */
router.post('/categories/add/new', async(req, res)=>{
    const {  txtcategory } = req.body;
    const result = await addNewCategory( txtcategory ) ? { 
        data : {
            response: true,
            image: 'star.png',
            category: txtcategory,
            action: 'Continuar...',
            actionUrl:  '/products/categories',
            description: 'La categoria fue agregada con exito!'
        }
        } : {
            data:{
                response: false,
                image: 'caution.png',
                category: txtcategory,
                action: 'Regresar...',
                actionUrl: '/products/categories',
                description: 'La categoria no pudo ser agregada, por favor verifique que no exista.'
            }
        };
    res.render('products/advise', result.data);
});

/**
 *  Vista para editar una categoria.
 */
router.get('/categories/edit/', async(req, res) => {
    // Carga informacion para editar una categoria.
    const { id, name } = req.query;
    res.render('products/editCategory', {
        category: {
            id,
            name
        }
    });
});

/**
 *  Request para editar una categoria.
 */
router.post('/categories/edit/category', async(req, res)=>{
    // ACTUALIZAR NOMBRE DE CATEGORIA.
    // TODO: PUT REQUEST.
    const { txtid, txtcategory} = req.body;
    const result = await updateCategory(txtid, txtcategory) ? {
        data: {
            response: true,
            image: 'star.png',
            category: txtcategory,
            action: 'Continuar...',
            actionUrl:  '/products/categories',
            description: 'La categoria fue editada con exito...'
        }
    } : {
        data:{
            response: false,
            image: 'caution.png',
            category: txtcategory,
            action: 'Regresar...',
            actionUrl: '/products/categories',
            description: 'Ocurrio un error intentando modificar la categoria, por favor intente de nuevo mas tarde.'
        }
    };
    res.render('products/advise', result.data);
});


/**
 *  Vista para eliminar una categoria.
 */
router.get('/categories/delete/', async(req, res) => {
    // carga informacion para borrar categoria.
    const { id, name } = req.query;
    res.render('products/deleteCategory', {
        category: {
            id,
            name
        }
    });
});

/**
 * request.
 *  Eliminar una categoria.
 */
router.post('/categories/delete/', async(req, res) => {
    // ELIMINAR CATEGORIA
    const { txtid, txtcategory } = req.body;
    const result = await deleteCategory(txtid) ? {
        data: {
            response: true,
            image: 'star.png',
            category: txtcategory,
            action: 'Continuar...',
            actionUrl:  '/products/categories',
            description: 'La categoria fue eliminada con exito!'
        }
    } : {
        data:{
            response: false,
            image: 'caution.png',
            category: txtcategory,
            action: 'Regresar...',
            actionUrl: '/products/categories',
            description: 'Ha ocurrido un error intentando eliminar la categoria, intente de nuevo mas tarde.'
        }
    };
    res.render('products/advise', result.data);
});

/**
 *  Mostrar los productos existentes acorde su categoria.
 */
router.get('/show/products', async(req, res) => {
    const { category } = req.query; // Obtener nombre de la ultima categoria obtenida desde products.
    const categories = await getCategories(); // Obtener todas las categorias.
    const products = await getProducts( category ); // Obtener todos los productos en base una categoria.
    const currentCategoryId = await categories.filter( categoria => categoria.nombre == category)[0].id;
    res.render('products/showProducts', {
        isFor: category,
        products,
        categories,
        currentCategoryId
    });
});

/**
 *  Eliminar imagen de un producto en base su @public_id
 */
router.get('/delete/product/image', async(req, res) => {
    const { public_id } = req.query;
    cloudinary.v2.uploader.destroy(public_id, (err, resp) => {
        return resp;
    }).then( r => {
        res.json(r);
    });
});

/**
 *  Obtener datos para actualizar un producto.
 */
router.get('/edit/product/:id', async(req, res) => {
    const { id } = req.params;
    const product = await getProductDetails(id);
    res.render('products/editProductDashboard', {product});
});

/**
 *  Actualizar datos de un producto.
 */
router.put('/edit/product/:id', async(req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precioch, preciog, url, categoria } = req.body;
    const { affectedRows } = await updateProduct(id, nombre, descripcion, precioch, preciog, url, categoria);
    const data = (affectedRows > 0) 
            ? {
                response: true,
                image: 'star.png',
                category: nombre,
                action: 'Continuar...',
                actionUrl:  `/products/edit/product/${id}`,
                description: 'El producto fue modificado con exito!'
            } : 
            {
                response: false,
                image: 'caution.png',
                category: nombre,
                action: 'Regresar...',
                actionUrl: `/products/edit/product/${id}`,
                description: 'Ha ocurrido un error intentando modificar el producto, intente de nuevo mas tarde.'
            };
        res.render('products/advise', data);
});

/**
 *  Eliminar un producto de la base de datos.
 * 
 */
router.delete('/delete/product/:id', async (req, res) => {
    const { id } = req.params;
    const { productName } = req.body;
    const { affectedRows } = await deleteProduct(id);
    const data = (affectedRows > 0) 
    ? {
        response: true,
        image: 'star.png',
        category: productName,
        action: 'Continuar...',
        actionUrl:  `/products`,
        description: 'El producto fue eliminado con exito!'
    } : 
    {
        response: false,
        image: 'caution.png',
        category: productName,
        action: 'Regresar...',
        actionUrl: `/products/edit/product/${id}`,
        description: 'Ha ocurrido un error intentando eliminar el producto, intente de nuevo mas tarde.'
    };
res.render('products/advise', data);
});

/**
 *  Agregar un nuevo producto.
 */
router.post('/add/product', async(req, res) => {
    const { categoriaName, txtnombre } = req.body;
    const backURL = req.header('Referer') || `/products/show/products/?category=${categoriaName}`;
   await addProduct(req.body, data => {
       if(data == 409){
            res.render('products/advise', {
                response: false,
                image: 'caution.png',
                category: txtnombre,
                action: 'Regresar...',
                actionUrl: backURL,
                description: 'Ocurrio un error intentando agregar el producto, por favor intente de nuevo mas tarde, o verifique que este no exista en el sistema.'
            });
       }else if(data == 201){
           res.render('products/advise', {
            response: true,
            image: 'star.png',
            category: txtnombre,
            action: 'Continuar...',
            actionUrl:  `/products/show/products/?category=${categoriaName}`,
            description: 'El producto fue agregado con exito...'
        })
       }
   });
});

/**
 *  Obtener todos los ingredientes y mostrarlos en ingredients.hbs
 */
router.get('/ingredients', async(req, res) => {
    await getAllIngredients()
            .then((r) => {
                res.render('products/ingredients', r);
            }).catch((err) => {
                res.sendStatus(404);
                console.log('err :>> ', err);
            });
});

/**
 *  Agregar un nuevo ingrediente
 */
router.post('/ingredients/add', async (req, res) => {
    const { ingrediente } = req.body;
    console.log('ingrediente :>> ', ingrediente);
    await createNewIngredient(ingrediente)
            .then((r) => {
                const { affectedRows } = r.ingredient; 
                const data = (affectedRows > 0) 
                ? {
                    response: true,
                    image: 'star.png',
                    category: ingrediente,
                    action: 'Continuar...',
                    actionUrl:  `/products/ingredients`,
                    description: 'El ingrediente fue agregado con exito!'
                } : 
                {
                    response: false,
                    image: 'caution.png',
                    category: ingrediente,
                    action: 'Regresar...',
                    actionUrl: `/products/ingredients`,
                    description: 'Ha ocurrido un error intentando agregar el ingrediente, intente de nuevo mas tarde.'
                };
                res.render('products/advise', data);
            }).catch((err) => {
                res.sendStatus(404);
            });
});

/**
 *  Cargar vista para editar un ingrediente.
 */
router.get('/ingredients/edit', (req, res) => {
    const { id, ingredient } = req.query;
    res.render('products/editIngredient', {
        ingredient: {
            id,
            name: ingredient
        }
    });
});

/**
 *  Request para editar un ingrediente.
 */
router.put('/ingredients/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { ingredient } = req.body;
    await updateIngedient(id, ingredient)
            .then((r) => {
                const { affectedRows } = r.ingredient; 
                const data = (affectedRows > 0) 
                ? {
                    response: true,
                    image: 'star.png',
                    category: ingredient,
                    action: 'Continuar...',
                    actionUrl:  `/products/ingredients`,
                    description: 'El ingrediente fue modificado con exito!'
                } : 
                {
                    response: false,
                    image: 'caution.png',
                    category: ingredient,
                    action: 'Regresar...',
                    actionUrl: `/products/ingredients`,
                    description: 'Ha ocurrido un error intentando modificar el ingrediente, intente de nuevo mas tarde.'
                };
                res.render('products/advise', data);
            }).catch((e) => {
                res.sendStatus(500);
            });
});

/**
 *  Cargar vista para eliminar un ingrediente.
 */
router.get('/ingredients/delete', (req, res) => {
    const { id, ingredient } = req.query;
    res.render('products/deleteIngredient', {
        ingredient: {
            id,
            name: ingredient
        }
    });
});

/**
 *  Request para eliminar un ingrediente.
 */
router.delete('/ingredients/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { ingredient } = req.body;
    await deleteIngredient(id)
            .then((r) => {
                const { affectedRows } = r.deleted_ingredient; 
                const data = (affectedRows > 0) 
                    ? {
                        response: true,
                        image: 'star.png',
                        category: ingredient,
                        action: 'Continuar...',
                        actionUrl:  `/products/ingredients`,
                        description: 'El ingrediente fue eliminado con exito!'
                    } : 
                    {
                        response: false,
                        image: 'caution.png',
                        category: ingredient,
                        action: 'Regresar...',
                        actionUrl: `/products/ingredients`,
                        description: 'Ha ocurrido un error intentando eliminar el ingrediente, intente de nuevo mas tarde.'
                    };
                    res.render('products/advise', data);
            }).catch((e) => {
                res.sendStatus(500);
            });
});

/**
 *  Vista para Agregar / Quitar ingredientes a un producto.
 */
router.get('/add/ingredient_to_product/:id', async (req, res) => {
    const { id } = req.params;
    const { product, url } = req.query;
    await getIngredientsOfProduct(id)
            .then(async(r) => {
                const actualIngredients = await getAllIngredients();
                res.render('products/productIngredients', { 
                    ingredients: r.ingredients,
                    actualIngredients: actualIngredients.ingredients,
                    productData:{
                        id,
                        name: product,
                        url
                    },
                    product_complete_url: `/products/add/ingredient_to_product/${id}?product=${product}&url=${url}`
                });
            }).catch((e) => {
                res.sendStatus(404);
            });
});

/**
 *  Agregar ingrediente a producto.
 */
router.post('/add/ingredient_to_product/', async (req, res) => {
    const { productId, ingredientId } = req.body;
    await addIngredientToProduct(productId, ingredientId);
});

/**
 *  Eliminar ingrediente de un producto.
 */
router.delete('/quit/ingredient_to_product/', async (req, res) => {
    const { productId, ingredientId, url } = req.body;
    await quitIngredientToProduct(productId, ingredientId)
            .then((r) => {

                const { affectedRows } = r.result;
                const data = ( affectedRows  > 0) 
                    ? {
                        response: true,
                        image: 'star.png',
                        category: 'Eliminado',
                        action: 'Continuar...',
                        actionUrl:  url,
                        description: 'El ingrediente fue eliminado con exito!'
                    } : 
                    {
                        response: false,
                        image: 'caution.png',
                        category: 'Error',
                        action: 'Regresar...',
                        actionUrl: url,
                        description: 'Ha ocurrido un error intentando eliminar el ingrediente, intente de nuevo mas tarde.'
                    };
                res.render('products/advise', data);
            }).catch((err) => {
                console.log('err :>> ', err);
            });
});

/**
 *  Vista para eliminar un ingrediente de un producto.
 */
router.get('/quit/ingredient_to_product/', (req, res) => {
    const { productId, ingredientId, ingredientName, urlToProduct } = req.query;
    const data = {
        ingrediente:{
            id: ingredientId,
            name: ingredientName,
            producto: productId
        },
        urlToProduct,
    }
    res.render('products/deleteIngredientOfProduct', data);
});

module.exports = router;