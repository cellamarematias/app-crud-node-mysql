const { response } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../database'); // este pool hace referencia a la base de datos
const { isLoggedIn } = require('../lib/auth'); // para proteger las vista si está logueado



router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});


// declaro la funcion, la encapsulo para poder usar el async await
const insertLinks = async (newLink) => {
    return new Promise((resolve, reject) => {
        const queryString = 'INSERT INTO links set ?';
        pool.query(queryString, [newLink], (error, results, fields) => {
            if(error) return reject(error); // <= si el proceso falla llamamos a reject y le pasamos el objeto error como argumento
            const data = {results, fields};
            return resolve(data); // <= si el proceso es exitoso llamamos a resolve y le pasamos el objeto data como argumento
        });
    })
};



router.post('/add', isLoggedIn, async (req, res) => {  //esta ruta recibe los datos
   // console.log(req.body) // así traigo los datos del form
   const { title, url, description } = req.body;  // destucturing 
   const newLink = {
       title,
       url,
       description,
       user_id: req.user.id
   };   
   try {
    const data = await insertLinks(newLink); // almacenamos el resultado por si queremos trabajar con el mismo
    req.flash('success', 'Link guardado correctamente');  // flash toma 2 parámetros: el nombre del msj y el valor
    res.redirect('/links'); //reenvío a la ruta de raíz -> links} catch(err) 
} catch(err) {
    console.log(err);
    return res.status(500).send('error');
}
});



router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //console.log(links);
    res.render('links/list', {links: links}); // acá renderizamos el archivo list y le paso los datos

});



router.get('/delete/:id', isLoggedIn, async (req, res) => {
    // console.log(req.params.id);
    // res.send('Eliminado');
    const { id } = req.params; // traigo el id del enlace
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Enlace removido');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link:links[0]} );  // paso el sitio que renderiza y los datos
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body; // traigo los datos del form
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]); // actualizo links el conjunto de datos 'newlink' donde sea el
    req.flash('success', 'Enlace actualizado');
    res.redirect('/links');

});






module.exports = router;