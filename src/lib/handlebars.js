const { format, register } = require('timeago.js');

const helpers = {};

helpers.getLat = ( latlong ) => {
    return latlong.split(',')[0];
};

helpers.getLong = ( latlong ) => {
    return latlong.split(',')[1];
};

/**
 * retorna el estado de un pedido en letra.
 */
helpers.orderStatus = ( status ) => {
    switch (status) {
        case 0:
            return 'En aprobación';
        case 1:
            return 'Aprobado';
        case 2:
            return 'Esta listo';
        case 3:
            return 'Entregado';
        case 4:
            return 'Cancelado';
        default:
            return 'Indefinido';
    }
};

/**
 *  Da formato a una fecha.
 */
helpers.dateFormat = ( date ) => {
    return (new Date(date)).toLocaleDateString('en-US');
};

/**
 *  Muestra el timestamp de hace cuanto tiempo.
 */
helpers.timeago = (timestamp) => {
    return format(timestamp, 'es_ES');
};

const localeFunc = (number, index, total_sec) => {
    return [
        ['justo ahora', 'ahora mismo'],
        ['hace %s segundos', 'en %s segundos'],
        ['Hace 1 minuto', 'en 1 minuto'],
        ['hace %s minutos', 'en %s minutos'],
        ['Hace 1 hora', 'en 1 hora'],
        ['hace %s horas', 'en %s horas'],
        ['Hace 1 día', 'en 1 día'],
        ['hace %s días', 'en %s días'],
        ['Hace 1 semana', 'en 1 semana'],
        ['hace %s semanas', 'en %s semanas'],
        ['Hace 1 mes', 'en 1 mes'],
        ['hace %s meses', 'en %s meses'],
        ['Hace 1 año', 'en 1 año'],
        ['hace %s años', 'en %s años']
    ][index];
  };
  register('es_ES', localeFunc);
module.exports = helpers;