/*METODO DE CONFIGURACION
/$ sudo apt-get update
/$ sudo apt-get install nodejs
/$ sudo apt-get install npm
/$ npm init
/$ npm install express --save
/$ npm install nodemon --save-dev
/$ npm install body-parser --save
/$ npm install mongodb --save
/$ npm install ejs --save
*/

//EXPRESS CORRE SOBRE NODE.JS
//NOS AYUDA PARA FACILITAR PETICIONES GET Y POST
const express = require('express');

//SE LLAMA A EXPRESS.JS
const app = express();

//EXTRAE DATOS DEL FORM
const bodyParser = require('body-parser')

//MONGODB PARA LA ADQUISICION DE DATOS
//MUCHO MAS UTIL QUE UTILIZAR SERVLETS Y UN APPLET JAVA JDBC QUE PUEDE COMPROMETER
//LA INTEGRIDAD DE LOS DATOS.
const ClienteMongo = require('mongodb').MongoClient

//DEFINICION DE LA LIBRERAIA PARA EL USO DE HTML DINAMICO (CON JS) EJS
app.set('view engine', 'ejs')

//VARIABLE DE LA BASE DE DATOS
var db

//PARA LLAMAR A UN ID Y USAR EL METODO update
//UTILIZAMOS LA DECLARACION DE OBJECTID
const ObjectId = require('mongodb').ObjectID;

//OBTIENE LOS DATOS DEL HTML QUE SE INGRESAN EN EL FORMULARIO
app.use(bodyParser.urlencoded({extended:true}))

//LEE LOS ARCHIVOS QUE SE ENCUENTRAN DENTRO DE LA CARPAETA
//PUBLIC (IMAGENES)
app.use(express.static('public'))

//INICIA EL SERVIDOR MONGO
ClienteMongo.connect('mongodb://Lazarus:afireinsi6@ds145188.mlab.com:45188/usuarios-prueba', function(err, database){
  if (err) return console.log(err)
  db = database
  app.listen(3000, function() {
    console.log('Listo en el puerto 3000')
  })
})

//BODY PARSER EN FUNCIONAMIENTO ESCUCHA LO QUE HAY DENTRO DE LA ACCION QUE LLEVA
//EL NOMBRE DENTRO DEL PARAMETRO REQUEST
app.post('/usuarios', function(req, res){
  //CREA UNA COLECCION DE USUARIOS DENTRO DE LA BASE DE DATOS DE MONGODB, TENIENDO COMO UNO DE LOS
  //PARAMETROS PRINCIPALES EL req.body EL CUAL ES EL OBJETO DE REGISTRO QUE SE INGRESA A MONGODB
  //A TRAVES DEL METODO POST DENTRO DEL CUERPO DEL DIALOGO
  db.collection('usuarios').save(req.body, function(err, result) {
      if (err) return console.log(err)

      console.log('Guardado en MongoDB')
      res.redirect('/')
    })
  })

//SE OBTIENE LA COLECCION DE MONGODB
//AQUI SE UTILIZA INDEX.EJS (SE RENDERIZA CON LA LIBRERIA EJS)
//CON LA CUAL SE PUEDE EJECUTAR DE MANERA DINAMICA JAVASCRIPT DENTRO DE HTML
//PARA CREAR UNA LISTA DE MANERA DINAMICA
app.get("/", function(req, res){
  db.collection('usuarios').find().toArray(function(err, result) {
    if (err) return console.log(err)

//EN ESTA PARTE SE RENDERIZA EL ARCHIVO EJS QUE FUNGE COMO HTML DINAMICO
    res.render('index.ejs', {usuario: result})
})
})

//INTENTO DE ACTUALIZACION DE REGISTRO CON PUT
/*
app.put("/actualiza", function(req, res){
  db.collection('usuarios').findOneAndUpdate({_id: ObjectId('585db6d97ce9f4a09fd05742')}, {$set:{name: "Mundo"}}, {upsert: true}, function(err, result) {
      if (err){}
          //do something.
      res.render('modif.ejs', {usuario: result})
  })
})*/


//ESTE METODO POST SIRVE PARA LA MODIFICACION DE
//DATOS DE REGISTRO DE USUARIO. SE TOMA EL ID DE LA URL
//DENTRO DE LA FUNCION Y SE PASA COMO PARAMETRO DENTRO DE
//DB.COLLECTION
app.post('/usuariosmodif:id', function(req, res){
  console.log(req.params.id);
  var _id = req.params.id;
  var fin = _id.toString();
  var restt = fin.replace(":", "");
  console.log(restt);

  db.collection('usuarios')
  .findOneAndUpdate({_id: ObjectId(restt)},
  {
    //PARAMETROS QUE HABRAN DE ACTUALIZARSE
    $set: {
    nombre: req.body.nombre,
    apellidop: req.body.apellidop,
    apellidom: req.body.apellidom,
    edad: req.body.edad,
    sexo: req.body.sexo,
    calle: req.body.calle,
    numint: req.body.numint,
    numext: req.body.numext,
    colonia: req.body.colonia,
    municipio: req.body.municipio,
    estado: req.body.estado,
    musica: req.body.musica,
    cine: req.body.cine,
    modelado: req.body.modelado,
    compras: req.body.compras,
    desierto: req.body.desierto,
    playa: req.body.playa,
    ciudad: req.body.ciudad,
    montana: req.body.montana,
    propiedad: req.body.propiedad,
    ingreso: req.body.ingreso,
    viajes: req.body.viajes
  }
  }, {
    upsert: true
  }, function(err, result){
    //NOS REDIRIGE A LOCALHOST:3000
    res.redirect('/');
  })
})

////NOS DIRIGE A UNA NUEVA PAGINA .EJS PARA VISUALIZAR
//EL FORMULARIO DE MODIFICACION DE REGISTROS QUE ESTAN
//ACTUALMENTE EN LA BASE DE DATOS
app.get("/modifica:id", function(req, res){
  console.log(req.params.id);
  var _id = req.params.id;
  var fin = _id.toString();
  var restt = fin.replace(":", "");
  console.log(restt);

  db.collection('usuarios').find({_id:ObjectId(restt)}).toArray(function (err, result) {
      //EN ESTA PARTE SE RENDERIZA EL ARCHIVO EJS QUE FUNGE COMO HTML DINAMICO
    res.render('modif.ejs', {usuario: result})
    });
})

//METODO GET PARA BORRAR REGISTROS QUE SE TIENEN DENTRO DE
//LA BASE DE DATOS DE MONGODB CON SOLO PRESIONAR EL BOTON "BORRAR"
//DEL REGISTRO QU SE DESEA ELIMINAR
app.get('/usuariosborra:id', function(req, res)  {
  console.log(req.params.id);
  var _id = req.params.id;
  var fin = _id.toString();
  var restt = fin.replace(":", "");
  console.log(restt);

  db.collection('usuarios').findOneAndDelete({_id:ObjectId(restt)},
  function(err, result) {

//REGIRIGE A LOCALHOST:3000
    res.redirect('/');
  })
})
