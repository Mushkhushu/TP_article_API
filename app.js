
//récupérer le module express en l'impotant dans un objet
const express = require("express");
//instancier un server express
const app = express();
//OBLIGATOIRE pour autoriser les post en JSON
app.use(express.json());

//importer la fonction initRoutes
const initRoutes = require("./routes");

//appeler la fonction initRoutes
initRoutes(app);

//démarrage du server
app.listen(3000);
