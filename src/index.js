const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');



// inicializaciones 
const app = express();
require('./lib/passport');



// configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');


// middleware -- funciones para c/vez que el usuario hace un petición
app.use(session({
  secret: 'sesionNode',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));

app.use(flash());
 //flash es para poder enviar msjs entre las vistas
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // el extended false es para no aceptar imágenes ni formatos extensos 
app.use(express.json());
app.use(passport.initialize()); // lo iniciamos pero en la sig línea tenemos que decirlo dónde guardar los datos
app.use(passport.session());




// variables globales
app.use( (req, res, next) =>{  // esta funcion toma lo que el server quiere responder y con next mientras tanto toma el resto del código 
  app.locals.success = req.flash('success'); // asigno la variable global de success -> necesitamos una sesión con el mód express session
  app.locals.message = req.flash('message');
  app.locals.user = req.user;  // almacenamos el usuario a nivel global
  next();
});


// rutas - acá definmos las Urls del servidor
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// public - acá el código al que el navegador puede acceder
app.use(express.static(path.join(__dirname, 'public')));

// arrancando el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto ', app.get('port'));
});
