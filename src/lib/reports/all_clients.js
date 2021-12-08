const pdf = require('html-pdf');

/**
 * 
 *  Obtiene todos los clientes y los muestra en pdf.
 * 
 */
const generateAllClientsReport = async ( clients = []) => {
    const cl = clients.map((v)=>{
       return `</tr>
        <tr class="item">
            <td>
                ${v.nombrecompleto}
                </td>
                <td>${v.id}</td>
                <td>
                ${v.cantcompras}
            </td>
        </tr>`;
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

            /** RTL **/
            .rtl {
                direction: rtl;
                font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }

            .rtl table {
                text-align: right;
            }

            .rtl table tr td:nth-child(2) {
                text-align: left;
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
                    
                    <tr class="information">
                        <td colspan="2">
                            <table>
                                <tr>
                                    <td>
                                        Nombre de la empresa<br>
                                        Direccion<br>
                                        Localidad & CP
                                    </td>
                                    <td>
                                        <h1>Todos los clientes</h1>
                                    </td>
                                </tr>
                            </table>
                        </td>

                    </tr>
                    <tr class="heading">
                        <td>
                            Nombre completo
                        </td>
                        
                        <td>
                            Telefono
                        </td>

                        <td>
                            Pedidos
                        </td>
                    </tr>
                    ${cl}
                </table>
            </div>
    `;

    return new Promise( async(resolve, reject) => {
       await pdf.create(content).toFile(`${__dirname}/archives/others/all_clients.pdf`, (err, res) => {
           return resolve(res.filename);
        });
    });
};

module.exports = {
    generateAllClientsReport
}