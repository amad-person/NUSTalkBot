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

// bot.on('conversationUpdate', function (message) {
//     if (message.membersAdded) {
//         message.membersAdded.forEach(function (identity) {
//             if (identity.id === message.address.bot.id) {
//                 bot.beginDialog('welcomeDialog');
//             }
//         });
//     }
// });