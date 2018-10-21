import express from "express";

import User from "../models/UserModel";
import passport from "passport";
const router = express.Router();

//Pour faire l'authentification d'utilisateur
router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return res.status(501).json(err);
    }
    if (!user) {
      return res.status(501).json(info);
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(501).json(err);
      }
      return res.status(200).json({ message: "Login Success" });
    });
  })(req, res, next);
});
// Pour deconnecter
router.get("/logout", isValidUser, function(req, res, next) {
  req.logout();
  return res.status(200).json({ message: "Logout Success" });
});
// verfier si l 'utlisateur est deja connecté ou non pour pouvoir faire la deconnection
function isValidUser(req, res, next) {
  if (req.isAuthenticated()) next();
  else return res.status(401).json({ message: "Unauthorized Request" });
}

//GET ALL Users
router.route("/").get((req, res) => {
  User.find((err, users) => {
    if (err) console.log(err);
    else res.json(users);
  });
});

//GET SPECIFIC USER
router.route("/:id").get((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) console.log(err);
    else res.json(user);
  });
});

// ADD NEW USER
router.route("/").post((req, res) => {
  let new_user = new User({
    nom: req.body.nom,
    username: req.body.username,
    //password est crypté avec bcrypt , on utilise la methode Hashpassword dans UserSchema
    password: User.hashPassword(req.body.password),
    race: req.body.race,
    nourriture: req.body.nourriture,
    age: req.body.age,
    famille: req.body.famille,
    friends: req.body.friends
  });
  new_user.save(function(err, user) {
    if (err) res.send(err);
    res.json(user);
  });
});
//UPDATE USER
router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user)
      return next(new Error("Could not load document , User not found"));
    else {
      user.race = req.body.race;
      user.nourriture = req.body.nourriture;
      user.age = req.body.age;
      user.famille = req.body.famille;
      user.nom = req.body.nom;

      user
        .save()
        .then(user => {
          res.json("Update done");
        })
        .catch(err => {
          res.status(400).send("Update failed");
        });
    }
  });
});

//ADD FRIEND
router.route("/addfriend/:id").post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user)
      return next(new Error("Could not load document , User not found"));
    else {
      user.friends = req.body.friends;
      user
        .save()
        .then(user => {
          res.json("Update done");
        })
        .catch(err => {
          res.status(400).send("Update failed");
        });
    }
  });
});

//DELETE USER
router.route("/delete/:id").get((req, res) => {
  User.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
    if (err) res.json(err);
    else res.json("Remove successfully");
  });
});

module.exports = router;
