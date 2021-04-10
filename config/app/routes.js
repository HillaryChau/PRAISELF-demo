const ObjectId = require('mongodb').ObjectId;  // finding records (records = mongodb objects) with a specific id//

module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('orders')
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);

        const pendingOrders = result.filter(({ pending }) => pending);  // results is all of the orders, this filters if pending key is true //
        const completedOrders = result.filter(({ completed }) => completed);

        res.render('profile.ejs', {
          user: req.user,
          pendingOrders,
          completedOrders,
        });
      });
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/orders', (req, res) => {
    const {
      barista,  //the keys are made from matching the name attribute of the input//
      customer,
      drink,
      milk,
      sweetener,
      temperature,
      note,
      size,
    } = req.body;

    db.collection('orders').save(
      {
        barista,
        customer,
        drink,
        milk,
        sweetener,
        temperature,
        note,
        size,
        pending: true,
        completed: false,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.redirect('/profile');
      },
    );
  });

  app.put('/orders', async (req, res) => {
    try {
      const { pending, completed, _id } = req.body;
      await db.collection('orders').findOneAndUpdate(
        { _id: ObjectId(_id) },
        {
          $set: {
            pending,
            completed,
          },
        },
      );
    } catch (e) {
      console.error(e);
    }

    res.redirect(303, '/profile');
  });

  app.delete('/orders', (req, res) => {
    db.collection('orders').findOneAndDelete(
      { _id: ObjectId(req.body._id) },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send('Message deleted!');
      },
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash order
    }),
  );

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash order
    }),
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
