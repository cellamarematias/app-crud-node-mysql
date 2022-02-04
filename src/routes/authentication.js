const express = require('express');
const router = express.Router();
const passport = require('passport'); // acá tengo que traer toda la biblioteca
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const { route } = require('.');

router.get('/signup', isNotLoggedIn, (req, res) => {  //ruta para renderizar el form
    res.render('auth/signup');
});


// router.post('/signup', (req, res) => { // ruta para recibir los datos del form
//     // console.log(req.body);
//     passport.authenticate('local.signup', {
//         successRedirect: '/profile', 
//         failureRedirect: '/signup',
//         failereFlash: true
//     })
//     res.send('recibido');

// });

// lo mismo de arriba pero con otro enfoque

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next);

});


router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile', 
    failureRedirect: '/signup',
    failereFlash: true
}));


router.get('/profile', isLoggedIn, (req, res) => {  //ruta para renderizar el form // aal poner el isLoggedIn si está validado, sigue el resto del cód
    res.render('profile');
});

router.get('/logout', (req, res) => {  //ruta para renderizar el form
    req.logOut(); //metodo que tiene password para cerrar sesión
    res.redirect('/signin');
});

module.exports = router;