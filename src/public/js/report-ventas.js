const fecha1 = document.querySelector('#fecha1');
const fecha2 = document.querySelector('#fecha2');
const generateReport = document.querySelector('#generate-report');

// http://localhost:4001/reports/ventas/2020-11-03/2020-11-30
generateReport.addEventListener('click', (e) => {
    if(fecha1.value!='' && fecha2.value != ''){
        generateReport.href = `/reports/ventas/${fecha1.value}/${fecha2.value}`;
    }
    else{
        alert('Introduzca datos correctos.');
    }
});