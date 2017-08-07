
const router = require('express').Router();
const models = require('../models');
const moment = require('moment');




// if user is not authenticated send back to login 
router.use(function (req, res, next) {
    if (req.session.isAuthenticated === false) {
        res.redirect('/login');
    } else {
        next();
    }
});




/************************************************
*                                               *
*                  home route                   *
*                                               *
************************************************/
router.get('/', async function (req, res) {



    // check in database for all messages
    try {
        var messages = await models.Message.findAll({
            order: [['updatedAt', 'DESC']],
            include: [{
                model: models.User,
                attributes: ['username']
            },
            {
                model: models.Like,
                attributes: ['like']
            }
            ]
        });

        // we have a id (message)
        // we have a userId

    } catch (e) {
        console.log("No messages found");
        next();
    }

 

    // if req.session.username === message[0].username;
    console.log(messages[0].User.username);

    var show = false;

   for(let message of messages) {
       if (message.User.username === req.session.username) {
           message.canDelete = true;
        
       }
   }

    // for (let i = 0; i < messages.length; i++) {

    //     if (messages[i].User.username === req.session.username) {
    //         messages[i].canDelete = true;
    //     }
    // }
    // var show = req.session.username === messages
  


    res.render('home', { isAuthenticated: req.session.isAuthenticated, username: req.session.username, messages });

});




/************************************************
*                                               *
*                  creatGab route               *
*                                               *
************************************************/
router.route('/createGab')
    .get(function (req, res) {
        res.render('createGab', { isAuthenticated: req.session.isAuthenticated, username: req.session.username });
    })
    .post(async function (req, res) {

        var message = req.body.message;
        var date = moment().format("MMM DD, YYYY h:mm a");

        try {
            const createMessage = await models.Message.create({ message: message, userId: req.session.userId, dateCreated: date });
        } catch (e) {
            console.log('error');
            next(e);
        }
        res.redirect('/user');
    });




/************************************************
*                                               *
*                  Message/:id route             *
*                                               *
************************************************/
// route to see individual message
router.route('/message/:id')
    .get(async function (req, res) {
    
    const messageId = req.params.id;
    const usersIdOnMessage = [];

 
      // check in database for all messages
    try {
        var messages = await models.Message.findOne({

            // get the message with this id
            where: { id: messageId } ,

            // and include these models with the following properites assciated with this message
            include: [{
                model: models.User,
                attributes: ['username']
            },
            {
                model: models.Like,
                // where: { messageId: messageId },
                attributes: ['like', 'userId']
            }
            ]
        });
        
        

    } catch (e) {
        console.log("No messages found");
        next(e);
    }

    for(let i = 0; i < messages.Likes.length; i++){
    usersIdOnMessage.push(messages.Likes[i].userId)
}

       // check in database for all messages
    try {
         var users = await models.User.findAll({ where:{ id: usersIdOnMessage }});
        

    } catch (e) {
        console.log("No messages found");
        next(e);
    }




    res.render('message', { isAuthenticated: req.session.isAuthenticated, username: req.session.username, messages, users });
})
.post(async function(req,res){

     const messageId = req.params.id;
     const userId = req.session.id;


        // check in database for all messages
    try {

        var deleteMessage = await models.Message.destroy({ where: { id: messageId, userId: req.session.id } });
        
        

    } catch (e) {
        console.log("No messages found");
        next(e);
    }

    res.redirect('/user');


});


/************************************************
*                                               *
*                  Likes post                   *
*                                               *
************************************************/
router.post('/likes/:id',async function (req, res) {
    const userId = req.session.userId;
    const messageId = req.params.id;

    console.log(userId + " is the user id for this specific user");
    console.log(messageId + " is the message id for this specific message");


    try {
        const user = await models.Like.create({ like: true, userId: userId, messageId: messageId });
    } catch (e) {
        console.log('error');
        next(e);
    }

    res.redirect('/user');
});





module.exports = router;