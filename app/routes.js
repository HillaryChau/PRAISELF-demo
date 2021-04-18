const ObjectId = require('mongodb').ObjectId; // finding records (records = mongodb objects) with a specific id
const affirmations = require('./affirmations');

module.exports = function (app, passport, db) {
  // ========================== SEEDING ==========================

  // uncomment and visit route to reseed database
  // app.get('/seed', function (req, res) {
  //   affirmations.forEach((affirmation) => {
  //     db.collection('affirmations').save(affirmation);
  //   });
  //   res.render('nothing.ejs', {});
  // });

  // ========================== PAGES ==========================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs', {
      user: req.user,
    });
  });

  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {
      user: req.user,
    });
  });

  app.get('/customize', isLoggedIn, function (req, res) {
    res.render('customize.ejs', {
      user: req.user,
    });
  });

  // ========================== POST / PUT ==========================

  app.put('/favorites', isLoggedIn, function (req, res) {
    const query = {
      affirmationId: req.body._id,
      email: req.user.local.email,
    };
    const update = {
      $set: {
        affirmationId: req.body._id,
        email: req.user.local.email,
      },
    };
    const options = { upsert: true };

    db.collection('favorites').updateOne(query, update, options, (err, result) => {
      res.send({ favorites: result });
    });
  });

  app.post('/customAffirmations', isLoggedIn, function (req, res) {
    db.collection('customAffirmations').save(
      {
        author: req.user.local.email,
        negativeEmotion: req.body.negativeEmotion,
        positiveAffirmation: req.body.positiveAffirmation,
      },
      (err, result) => {
        if (err) return console.log(err);
        res.send('OK');
      },
    );
  });

  // ========================== GET ==========================

  app.get('/profile', function (req, res) {
    db.collection('affirmations')
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);

        res.render('profile.ejs', {
          user: req.user,
          affirmations: result,
        });
      });
  });

  app.get('/favorites', function (req, res) {
    db.collection('favorites')
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);

        if (req.user) {
          const favorites = result.filter((e) => e.email === req.user.local.email);

          res.send({ favorites });
        } else {
          res.send({ favorites: [] });
        }
      });
  });

  app.get('/affirmations', function (req, res) {
    db.collection('affirmations')
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);

        res.send({
          affirmations: result,
        });
      });
  });

  app.get('/customAffirmations', function (req, res) {
    db.collection('customAffirmations')
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);

        res.send({
          customAffirmations: result,
        });
      });
  });

  // ========================== DELETE ==========================

  app.delete('/favorites', (req, res) => {
    db.collection('favorites').findOneAndDelete(
      {
        _id: ObjectId(req.body._id),
        email: req.user.local.email,
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send('Favorite deleted!');
      },
    );
  });

  app.delete('/customAffirmations', (req, res) => {
    db.collection('customAffirmations').findOneAndDelete(
      {
        _id: ObjectId(req.body._id),
        author: req.user.local.email,
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send('Favorite deleted!');
      },
    );
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
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
