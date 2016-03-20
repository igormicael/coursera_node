module.exports = (function() {
    'use strict';

    var express = require('express');
    var bodyParser = require('body-parser');

    var promotionRouter = express.Router();

    promotionRouter.use(bodyParser.json());

    promotionRouter.route('/')
        .all(function(req, res, next) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            next();
        })
        .get(function(req, res, next) {
            res.end('Will send all the promotions to you!');
        })
        .post(function(req, res, next) {
            res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
        })
        .delete(function(req, res, next) {
            res.end('Deleting all promotions');
        });

    //second router
    promotionRouter.route('/:promotionId')
        .all(function(req, res, next) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            next();
        })
        .get(function(req, res, next) {
            res.end('Will send details of the promotion: ' + req.params.promotionId + ' to you!');
        })
        .put(function(req, res, next) {
            res.write('Updating the promotion: ' + req.params.promotionId + '\n');
            res.end('Will update the promotion: ' + req.body.name +
                ' with details: ' + req.body.description);
        })
        .delete(function(req, res, next) {
            res.end('Deleting promotiion: ' + req.params.promotionId);
        });

        return promotionRouter;

})();