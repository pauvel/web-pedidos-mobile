const express = require('express');
const router = express.Router();
const fs = require('fs');
const { generateNote } = require('../lib/reports/notaventa');
const { 
    getOnAprovalOrders, 
    getOrderDetails, 
    getAprovedOrders, 
    getReadyOrders,
    getCancellatedOrders,
    getDoneOrders,
    aproveOrder,
    setReadyOrder,
    setDoneOrder,
    cancelOrder
} = require('../lib/db/orders-crud');

/**
 *          **** Order management *****
 *              ENDPOINT: /pedidos
 *          - Aprobar, declinar, establecer como listas, establecer como entregadas.
 *          - Manejo de las vistas y funcionalidad
 *                                                  * Pendientes
 *                                                  * Aprobadas
 *                                                  * Entregadas
 *                                                  * Canceladas
 *         - Renderizados de la seccion pedidos.
 */
router.get('/pendientes', async (req, res) => {
    const orders = await getOnAprovalOrders();
    res.render('orders/pendientes', { orders } );
});
 
router.get('/aprobados', async (req, res) => {
    const orders = await getAprovedOrders();

    res.render('orders/aprobados', { orders } )
});

router.get('/listos', async (req, res) => {
    const orders = await getReadyOrders();

    res.render('orders/listos', { orders } )
});

router.get('/entregados', async (req, res) => {
    const orders = await getDoneOrders();

    res.render('orders/entregados', { orders } )
});

router.get('/cancelados', async (req, res) => {
    const orders = await getCancellatedOrders();

    res.render('orders/cancelados', { orders } )
});

// /pedidos/pendientes/{{id}}/details?={{telefono}}
/**
 *   Genera la vista con todos los datos de los pedidos pendiente.
 */
router.get('/pendientes/:id/details', async (req, res) => {
    const { client } = req.query;
    const { id } = req.params;
    const { order, order_products } = await getOrderDetails(id, client);
    return res.render('orders/pendientes_details', { order, order_products });
});

/**
 *   Genera la vista con todos los datos de los pedidos aprobados.
 */
router.get('/aprobados/:id/details', async (req, res) => {
    const { client } = req.query;
    const { id } = req.params;
    const { order, order_products } = await getOrderDetails(id, client);
    return res.render('orders/aprobados_details', { order, order_products });
});

/**
 *   Genera la vista con todos los datos de los pedidos listos.
 */
router.get('/listos/:id/details', async (req, res) => {
    const { client } = req.query;
    const { id } = req.params;
    const { order, order_products } = await getOrderDetails(id, client);
    return res.render('orders/listos_details', { order, order_products });
});

/**
 *   Genera la vista con todos los datos de los pedidos entregados.
 */
router.get('/entregados/:id/details', async (req, res) => {
    const { client } = req.query;
    const { id } = req.params;
    const { order, order_products } = await getOrderDetails(id, client);
    return res.render('orders/entregados_details', { order, order_products });
});

/**
 *   Genera la vista con todos los datos de los pedidos cancelados.
 */
router.get('/cancelados/:id/details', async (req, res) => {
    const { client } = req.query;
    const { id } = req.params;
    const { order, order_products } = await getOrderDetails(id, client);
    return res.render('orders/cancelados_details', { order, order_products });
});

/**
 *  Aprueba un @pedido .
 */
router.put('/aprobar_pedido', async (req, res) => {
    const { pedido } = req.body;
    await aproveOrder( pedido )
                .then((r) => {
                    if(r.affectedRows > 0){
                        res.redirect('/pedidos/pendientes')
                    }
                }).catch((err) => {
                    return res.sendStatus(500);
                });
});

/**
 *  Establecer @pedido como listo.
 */
router.put('/pedido_listo', async (req, res) => {
    const { pedido } = req.body;
    await setReadyOrder( pedido )
                .then(async(r) => {
                    if(r.affectedRows > 0){
                        res.redirect('/pedidos/aprobados')
                    }
                }).catch((err) => {
                    return res.sendStatus(500);
                });
});

/**
 *  Establecer un @pedido como entregado.
 */
router.put('/pedido_entregado', async (req, res) => {
    const { pedido } = req.body;
    await setDoneOrder( pedido )
                .then((r) => {
                    if(r.affectedRows > 0){
                        res.redirect('/pedidos/listos')
                    }
                }).catch((err) => {
                    return res.sendStatus(500);
                });
});

/**
 *  Establecer un @pedido como declinado.
 */
router.put('/cancelar_pedido', async (req, res) => {
    const { pedido } = req.body;
    await cancelOrder( pedido )
                .then((r) => {
                    if(r.affectedRows > 0){
                        res.redirect('/pedidos/cancelados')
                    }
                }).catch((err) => {
                    return res.sendStatus(500);
                });
});

/**
 *  Imprimir ticket
 */
router.post('/imprimir_ticket', async (req, res) => {
    const { id, client } = req.body;
    const { order, order_products } = await getOrderDetails(id, client);
    await generateNote(order, order_products)
            .then((r) => {
                if(r == null) return sendStatus(404);
                var data = fs.readFileSync(r);
                res.contentType("application/pdf");
                return res.send(data);
                // return res.download(r, (err)=>{
                //     if(err) return res.sendStatus(500);
                // });
            }).catch((err) => {
                return res.sendStatus(500);
            });
});
module.exports = router;