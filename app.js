// bot setup
require('./connectorSetup.js')();

// dialogs
require('./dialogs/greeting.js')();
require('./dialogs/ask.js')();
require('./dialogs/timetable.js')();
require('./dialogs/welcome.js')();
require('./dialogs/help.js')();

// root dialog
bot.dialog('rootDialog',
    function (session) {
        session.beginDialog('greetingDialog');
    },
    intents
).beginDialogAction('help', 'helpDialog', { matches: 'Help'});

bot.dialog('defaultDialog', function (session) {
    session.send("I'm sorry, I didn't understand that.");
}).triggerAction({
    matches: 'None'
});

// first time use
// bot.dialog('firstRun', function (session) {
//     session.userData.firstRun = true;
//     session.beginDialog('welcomeDialog');
//     session.replaceDialog('rootDialog');
// }).triggerAction({
//     onFindAction: function (context, callback) {
//         // trigger if we've never seen user before
//         if (!context.userData.firstRun) {
//             // return a score of 1.1 to ensure the first run dialog wins
//             callback(null, 1.1);
//         } else {
//             callback(null, 0.0);
//         }
//     }
// });