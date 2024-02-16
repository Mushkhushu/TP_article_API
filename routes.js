//exporter la fonction initRoutes() pour l'utiliser dans app.js
module.exports = function initRoutes(app) {
  // Middleware pour analyser les données JSON venant du body
  //app.use(express.json());

  //importer les articles en memoire
  //const articles = require("./articles");
//importer mongoose
const mongoose = require('mongoose');
//se connecter à la db mongodb
const url = "mongodb://127.0.0.1:27017/db_article"
//notre modèle correspondant à notre collection mongodb
//"persons" ===> le nom de la collection dans laquelle on veut l'enregistrer
const Article = mongoose.model('Article', {id: Number, author: String, title: String, content: String}, "articles");
//lancer la connexion à la db
mongoose.connect(url)


  //ROUTE EN GET SUR '/articles'
  app.get("/articles", async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
  });

  //ROUTE EN GET SUR '/article/:id
  app.get("/article/:id", async (req, res) => {
    const idToSelect = parseInt(req.params.id);
    const selectedArticle = await Article.findOne({id: idToSelect})
    if (!selectedArticle) {
      return res.status(404).json({ message: `Article introuvable` });
    }
    res.json(selectedArticle);
  });

  //ROUTE EN DELETE SUR '/article/:id
  app.delete("/article/:id", async (req, res) => {
    const idToDelete = parseInt(req.params.id);
    const deletedArticle = await Article.findOneAndDelete({id: idToDelete});
    if (!deletedArticle) {
      return res.json({ message: `suppression impossible` });
    }
    res.json({ message: `Article supprimé avec succès` });
  });

  //ROUTE EN POST SUR '/save-article' selon l'id
  app.post("/save-article", async (req, res) => {
    //récupérer les données JSON envoyées par la requête dans le body
    const data = req.body;
    //tester si l'article existe ou non (édition ou création)
    const foundArticle = await Article.findOne({id: data.id});
    //si l'article existe, c'est une mise à jour
    if (foundArticle) {
      res.json({message: `Article modifié avec succès`});
      const updatedArticle = await Article.findOneAndUpdate({id: data.id}, data);
      res.json(updatedArticle);
    }
    //si l'article n'existe pas, c'est une nouvelle creation
    const newArticle = new Article(data);
    const savedArticle = await newArticle.save();
    res.json({message: `Article sauvegardé avec succès`});
    res.json(savedArticle);



  });
};
