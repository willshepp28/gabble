const router = require('express').Router();
const models = require('../models');





/************************************************
*                                               *
*                  signup route               *
*                                               *
************************************************/
router.route('/')

    .get(function (req, res) {
        console.log('getting time')
      
      
        res.render('signup');
    })


    .post(async function (req, res) {

        // convert they string password into a integer
        const username = req.body.username;
        const password = parseInt(req.body.password);
        const confirm = parseInt(req.body.confirm);


        // check to see if confirm and password match
        if (confirm !== password){
            req.session.errors = "passwords dont match";
            console.log(req.session.errors);
            res.redirect('/');
        } else {
            
            try {
                const user = await models.User.create({ username: username, password: password });
            } catch(e) {
                console.log('error');
                next(e);
            }

            res.redirect('/login');
        }


       
    });


/************************************************
*                                               *
*                  login route               *
*                                               *
************************************************/
router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(async function (req, res) {

        // get username and password from body , and convert password string to integer
        const username = req.body.username;
        const password = req.body.password;
        console.log(password);

        // check in database if user with password matches
        try {
            const user = await models.User.findOne({ where: { username: username, password: password } });
             console.log(req.session.isAuthenticated);
             req.session.username = username;
             req.session.isAuthenticated = true;
             req.session.userId = user.id;
             
             

        } catch(e) {
            console.log("password and email dont match")
            next();
        }
       
        res.redirect('/user');
    });




/************************************************
*                                               *
*                  logout route               *
*                                               *
************************************************/
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});






module.exports = router;