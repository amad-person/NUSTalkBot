module.exports = function () {
    bot.dialog('restartDialog', [
        function (session, args) {
            if(args.action === 'notHome') {
                builder.Prompts.choice(session, "Are you sure you want to go back?", "Yes|No", builder.ListStyle.button);
            } else {
                session.send('You are already on the home page.');
                session.endDialog();
            }
        },
        function(session, results) {
            switch (results.response.entity.toLowerCase()) {
                case "yes":
                    session.send("Okay, taking you back...");
                    session.sendTyping();
                    session.replaceDialog('greetingDialog');
                    break;
                case "no":
                    session.send("Alright, staying in place...");
                    session.endDialog();
                    break;
            }
        }
    ]).triggerAction({
        matches: 'Restart'
    });
};