var _ = require('lodash');
var User = require('../models/User');
var Face = require('../models/Face');
var YammerAPIClient = require('yammer-rest-api-client');
var shuffle = require('shuffle-array');
var schedule = require('node-schedule');

/**
 * GET /faces
 * List Co-workers.
 */
function getColleges(req, res) {
    var user = req.user;
    var accessToken = _.pluck(_.filter(user.tokens, {'kind': 'yammer'}), 'accessToken');
    var client = new YammerAPIClient({baseUrl: "https://www.yammer.com/api/v1", token: accessToken});

    //var rule = new schedule.RecurrenceRule();
    //rule.minute = new schedule.Range(0, 59, 1);
    //schedule.scheduleJob(rule, function(){});

    client.users.list(function (error, data) {
        if (error)
            console.log("There was an error retrieving the data");
        else {
            console.log("** Saving Co-worker Data **");

            for (var i = 0; i < data.length; i++) {
                var user = data[i];

                Face.find({_id:user.id}, {_id:1}).limit(1).exec(function (err, found) {
                    if(found.length == 0){
                        var face = new Face({
                            _id: user.id,
                            yammer: user,
                            timesCorrect: 0
                        });

                        face.save(function (err, res) {
                            if (err)
                                console.log(err);
                        });
                    }
                });
            }

            Face.count(function (err, num) {
                var skip = Math.random() * num;

                Face.find().limit(3).skip(Math.random() * num).exec(function (err, found) {
                    res.render('faces', {
                        title: 'Discover Your Co-Workers!',
                        users: found,
                        name: shuffle.pick(found, { 'picks': 1 }).yammer.full_name
                    });
                });
            });
        }
    });
}

exports.getColleges = getColleges;