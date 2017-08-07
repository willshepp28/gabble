// Require Modules ==================  /////
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const validator = require('express-validator');
const handlebars = require('express-handlebars');
const moment = require('moment');
const port = process.env.PORT || 3000;
const models = require('./models');



const index = require('./routes/index');
const user = require('./routes/user');



// create Express App
const app = express();





// Middleware ==================  /////
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use('/assets', express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// app.use(morgan('combined'))

// app.use(function(req,res,next){
//     console.log('LOGGED')
//   next()
// });

// app.use(function (req, res, next) {
//     console.log("Request at", new Date());
//     console.log("URL:", req.url);
//     console.log("Query:", req.query, "\n");
//     next();
// })


app.use(function(req,res, next){


  if (!req.session.isAuthenticated){
      req.session.isAuthenticated = false;


  }

  next();
});


// Route Handler ==================  /////
app.use('/user', user);
app.use('/', index);



// Start Server ==================  /////
app.listen(port, function(){
    console.log('Server listening on port 3000');
});