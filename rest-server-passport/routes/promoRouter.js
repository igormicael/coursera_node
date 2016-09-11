var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Promotions = require('../models/promotions');
var Verify = require('./verify');

var promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .get(function(req, res, next) {
        res.end('Will send all the promotions to you!');
    })
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Promotions.find({}, function(err, promotion) {
            if (err) next (err);
            res.json(promotion);
        });
    })  
    .post(Verify.verifyAdmin, function(req, res, next) {
        Promotions.create(req.body, function(err, promotion) {
            if (err) next (err);
            console.log('Promotion created!');
            var id = promotion._id;

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the promotion with id: ' + id);
        });
    })
    .delete(Verify.verifyAdmin, function(req, res, next) {
        Promotions.remove({}, function(err, resp) {
            if (err) next (err);
            res.json(resp);
        });
    });

//second router
promotionRouter.route('/:promotionId')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Promotions.findById(req.params.promotionId, function(err, promotion) {
            if (err) next (err);
            res.json(promotion);
        });
    })
    .put(Verify.verifyAdmin, function(req, res, next) {
        Promotions.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, {
            new: true
        }, function(err, promotion) {
            if (err) next (err);
            res.json(promotion);
        });
    })
    .delete(Verify.verifyAdmin, function(req, res, next) {
        Promotions.findByIdAndRemove(req.params.promotionId, function(err, resp) {
            if (err) next (err);
            res.json(resp);
        });
    });

module.exports = promotionRouter;
