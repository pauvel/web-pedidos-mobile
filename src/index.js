const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const methodOverride = require("method-override")
global.fetch = require('node-fetch');

// Settings
app.set('port', process.env.PORT || 4001); // Port.
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"))
// Global variables
app.use((req, res, next) => {
    next();
});

// Routes
app.use('/', require('./routes'));
app.use('/home', require('./routes/home'));
app.use('/products', require('./routes/products'));
app.use('/tools', require('./routes/navigation'));
app.use('/pedidos', require('./routes/orders'));
app.use('/reports', require('./routes/reports'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
});