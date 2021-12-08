const express = require('express');
const router = express.Router();
const fs = require('fs');
const { getAllClients, getClientById } = require('../lib/db/clients-crud');
const { generateAllClientsReport } = require('../lib/reports/all_clients');
const { generateClientReport } = require('../lib/reports/client_by_id');
const { generateVentasReport } = require('../lib/reports/orders_by_date');
const { getDoneOrdersByDate } = require('../lib/db/orders-crud');


router.get('/clientes', (req, res) => {
    res.render('reports/clients');
});

router.get('/clientes/all_clients', async(req, res) => {
    const clientes = await getAllClients();
    await generateAllClientsReport(clientes)
            .then((r) => {
                if(r == null) return sendStatus(404);
                var data = fs.readFileSync(r);
                res.contentType("application/pdf");
                return res.send(data);
            }).catch((err) => {
                return sendStatus(500);
            });
});

router.get('/cliente/:id', async (req, res) => {
    const { id } = req.params;
    const client = await getClientById(id);
    await generateClientReport(client)
            .then((r) => {
                if(r == null) return sendStatus(404);
                var data = fs.readFileSync(r);
                res.contentType("application/pdf");
                return res.send(data);
            }).catch((err) => {
                return sendStatus(500);
            });
});

router.get('/ventas', (req, res) => {
    res.render('reports/ventas')
});

router.get('/ventas/:from/:to', async (req, res) => {
    const{ from, to } = req.params;
    const orders = await getDoneOrdersByDate(from, to);
    await generateVentasReport(orders, from, to)
            .then((r) => {
                if(r == null) return sendStatus(404);
                var data = fs.readFileSync(r);
                res.contentType("application/pdf");
                return res.send(data);
            }).catch((err) => {
                return sendStatus(500);
            });
});


module.exports = router;