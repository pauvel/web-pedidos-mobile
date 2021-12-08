const pdf = require('html-pdf');

/**
 *      Genera una nota de venta en pdf y retorna el nombre generado
 *      para posteriormente crear link de descarga.
 */
const generateNote = async ( order, orderDetails ) => {
    const fecha = new Date(order.fecha).toLocaleDateString('en-US');
    const products = orderDetails.map((v, i, a) => {
        return `
        <tr class="item">
            <td>
                ${v.nombre}
                </td>
                <td>${v.cantidad}</td>
                <td>
                    $${v.importe}
                </td>
            </tr>
        `;
    });

    const content = `
    <style>
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        font-size: 16px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
    }

    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
    }

    .invoice-box table td {
        padding: 5px;
        vertical-align: top;
    }

    .invoice-box table tr td:nth-child(2) {
        text-align: center;
    }

    .invoice-box table tr.top table td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }

    .invoice-box table tr.information table td {
        padding-bottom: 40px;
    }

    .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }

    .invoice-box table tr.details td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.item td{
        border-bottom: 1px solid #eee;
    }

    .invoice-box table tr.item.last td {
        border-bottom: none;
    }

    .invoice-box table tr.total td:nth-child(3) {
        border-top: 2px solid #eee;
        font-weight: bold;
    }
    </style>
    </head>

    <body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <img src="https://res.cloudinary.com/dlds4xwpk/image/upload/v1606442600/pedidos_mobile_data/logo_cvf1ok.png" style="width:100%; max-width:300px;">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr>
                <td colspan="2">
                    <table>
                        <tr>
                            <td>
                                Nombre de la empresa<br>
                                Direccion<br>
                                Localidad & CP
                            </td>
                            <td style="text-align: right;">
                                Folio #: ${order.id}<br>
                                Fecha: ${fecha}-${order.hora}<br>
                                ${order.cliente}<br>
                                ${order.telefono}
                             </td>
                        </tr>
                    </table>
                </td>

            </tr>
            
            <tr class="heading">
                <td>
                    Metodo de pago
                </td>

            </tr>
            
            <tr class="details">
                <td>
                    En efectivo
                </td>
            </tr>
            
            <tr class="heading">
                <td>
                    Producto
                </td>
                
                <td>
                    Cantidad
                </td>

                <td>
                    Importe
                </td>
            </tr>
            ${products}
            <tr class="total">
                <td></td>
                <td></td>
                
                <td>
                Total: $${order.importe}
                </td>
            </tr>
        </table>
    </div>
`;

    return new Promise( async(resolve, reject) => {
       await pdf.create(content).toFile(`${__dirname}/archives/tickets/notaventa_${order.id}.pdf`, (err, res) => {
           return resolve(res.filename);
        });
    });
};

module.exports = {
    generateNote
}