const passport = require('passport');  //para hacer autenticaciones 
const LocalStrategy = require('passport-local').Strategy; // para hacer las autenticaciones locales, con mi db

const pool = require('../database');
const helper = require('../lib/helper') ;



passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, username, password, done) => {
        // console.log(req.body);
        // console.log(username);
        // console.log(password);
        const row = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
       if(row.length > 0) {  // si el ususario existe valido la constraseña
           const user = row[0];
           const validPassword = await helper.matchPassword(password, user.password); // se es válida, le paso el user y un msj
           if(validPassword) {
               done(null, user, req.flash('success', 'Bienvenido ' + user.username)); 

            } else {
                done(null, false, req.flash('message', 'Contraseña incorrecta'));
              }
            } else {
              return done(null, false, req.flash('message', 'El usuario no existe.'));
            }
          }));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passworField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //console.log(req.body);
    const { fullname } = req.body // solo quiero el fullname y viene desde el body por eso lo declaro así
    const newUser = {
        username, // esto es igual a username: username,
        password,
        fullname
    };
    try {
        newUser.password = await helper.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ?', [newUser]);
        console.log('The database New User insertion results in: ', result);
        newUser.id = result.insertId; // le agrego el id al newUser
        return done(null, newUser);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.log('Ya existe');
            req.flash('success', 'Ese usario ya se encuentra en uso.');  // flash toma 2 parámetros: el nombre del msj y el valor

           return done(null, false, req.flash('message', 'El ususario ya existe'));
        }
    }
}

));


// serializar y desserializar el pass

passport.serializeUser((user, done) => {
    done(null, user.id);
    
});



passport.deserializeUser( async (id, done) => {
    const row = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, row[0]);
});






