const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database")
const session = require('express-session')

const categoriesControllers = require('./categories/CategoriesController')
const articlesControllers = require('./articles/articlesController')
const usersControllers = require('./users/usersControllers')

const Article = require('./articles/Article')
const Category = require("./categories/Category");
const User = require('./users/User');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));


// Redis


//Session na memoria 
app.use(session({
    secret: "yuiuuyuyfghh4564mfhgf5468845jhfh",
    cookie: {maxAge: 3000000000000}
}))


connection
    .authenticate()
    .then(() => {
        console.log("conexão realizada com sucesso no banco de dados");
    }).catch((erro) => {
        console.log(erro);
    })

app.use('/', categoriesControllers)    
app.use('/', articlesControllers)    
app.use('/', usersControllers)  
/*
app.get('/session', (req, res) => {
    req.session.treinamento = 'formação Node JS'
    req.session.nome = 'Elias Neto',
    req.session.user = {
        nome: "Aline Pereira",
        email: "aline@gmail.com",
        id: 10
    }

    res.send('Sessão Gerada!')
});

app.get('/leitura', (req, res)  => {
    res.json({
        treinamento: req.session.treinamento,
        Nome: req.session.nome,
        user: req.session.user
    })
});
*/
app.get('/', (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        })


    })

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    console.log('Entrando da Rota de Slug')
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(Article => {
        if(Article != undefined){

            Category.findAll().then(categories => {
                res.render('article', {articles: Article, categories: categories});
            });
        }else{
            res.redirect('/');
        }

    }).catch(erro => {
        res.redirect('/')
    })


})    

})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    console.log("Valor do slug passado: " + slug)
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]

    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});

            })
        }else{
            res.redirect('/')
        }
    }).catch(erro => {
        res.redirect('/')
    })
})

app.listen(8080, () => {
    console.log("Servidor está rodando")
})