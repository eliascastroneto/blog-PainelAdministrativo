const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
    User.findAll().then( users => {
        res.render('admin/users/index', {users: users})
    })
} )

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
} )

//ROTA PARA SALVAR OS DADOS NO BANCO
router.post('/user/create', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then (user => {
        if(user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password);
        
            User.create({
                email: email,
                password: hash
            }).then( () => {
                res.redirect('/')
            }).catch( (err) => {
                res.redirect('/')
            })

        }else {
            console.log('Usuario já existe')
            res.redirect('/admin/users/create');
        }
    })



})

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})


router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            }else{
                res.redirect('/')
            }
        }else{
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
})

module.exports = router;