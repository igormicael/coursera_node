var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
    .get(function(req, res, next) {

        Favorites.find({})
            .populate('postedBy')
            .populate('dishes')
            .exec(function(err, favorite) {
                if (err) next (err);

                res.json(favorite);
            })
    })
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Favorites.findOne({ "postedBy": req.decoded._doc._id }, function(err, favorite) {
            if (err) next (err);

            if (favorite) {

                var dishId = req.body._id;
                favorite.dishes.push(dishId);
                favorite.save(function(err, favorite) {
                    if (err) throw err;
                    res.json(favorite);
                });

            } else {
                Favorites.create(req.body, function(err, favorite) {
                    if (err) throw err;

                    var dishId = req.body._id;

                    favorite.postedBy = req.decoded._doc._id;
                    favorite.dishes.push(dishId);

                    favorite.save(function(err, favorite) {
                        if (err) throw err;
                        res.json(favorite);
                    });
                });
            }
        })

    })

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Favorites.findOneAndRemove({"postedBy": req.decoded._doc._id}, function(err, favorite) {
        if (err) next (err);
        res.json(favorite);
    });
});

favoritesRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        var dishId = req.params.dishId;
        var postedById = req.decoded._doc._id;

        Favorites.findOne({ "postedBy": postedById }, function(err, favorite) {
            if (err) next (err);

            for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                if (favorite.dishes[i] == dishId) {
                    favorite.dishes.pull(dishId);
                }
            }

            favorite.save(function(err, result) {
                if (err) next (err);
                res.json(favorite);
            });
        });

    });


module.exports = favoritesRouter;