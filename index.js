"use strict";
var Botkit = require("botkit");
var express = require("express");
var bodyParser = require("body-parser");
var routes_1 = require("./routes");
var bot_1 = require("./bot");
var PORT = process.env.PORT || 5000;
var CLIENT_ID = process.env.SLACK_CLIENT_ID;
var CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
var SLACKBOT_TOKEN = process.env.SLACKBOT_TOKEN;
var MONGODB_URI = process.env.MONGODB_URI;
var BOTS_RUNNING = {};
var CHANNELS = {};
var USERS = {};
var Store = require('botkit-storage-mongo')({ mongoUri: MONGODB_URI });
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var controller = Botkit.slackbot({
    debug: false,
    storage: Store,
});
controller.configureSlackApp({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scopes: ['bot'],
});
controller
    .createWebhookEndpoints(app)
    .createOauthEndpoints(app, function (err, req, res) {
    if (err)
        return res.status(500).send('ERROR: ' + err);
    res.send('Success!');
});
app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
});
controller.storage.teams.all(function (err, teams) {
    if (err)
        throw err;
    for (var _i = 0, teams_1 = teams; _i < teams_1.length; _i++) {
        var team = teams_1[_i];
        if (team.bot) {
            var bot = controller.spawn(team);
            initSlackbot(bot);
        }
    }
});
controller.on('create_bot', function (bot, teamConfig) {
    if (BOTS_RUNNING[bot.config.token])
        return console.log('=> Bot already running!');
    initSlackbot(bot, teamConfig);
});
function initSlackbot(BOT, team) {
    BOT
        .startRTM(function (err, bot, payload) {
        if (err)
            return console.error(err);
        trackBot(bot);
        if (team) {
            controller.saveTeam(team, function (e, id) {
                if (e) {
                    console.log('Error saving team');
                }
                else {
                    console.log("Team " + team.name + " saved");
                }
            });
        }
        payload.channels
            .filter(function (c) { return !c.is_archived; })
            .forEach(function (c) { return CHANNELS[c.name] = c; });
        payload.users
            .filter(function (u) { return !u.deleted; })
            .forEach(function (u) { return USERS[u.id] = u; });
        app.use('/', routes_1.default(bot));
        bot_1.default(controller, USERS);
        app.get('*', function (req, res) {
            res.send('Invalid Endpoint');
        });
    });
}
function trackBot(bot) {
    BOTS_RUNNING[bot.config.token] = bot;
}
