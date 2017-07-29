module.exports = function () {
    bot.dialog('restartDialog', [
        function (session) {
            builder.Prompts.choice(session, "Are you sure you want to go back?", "Yes|No", builder.ListStyle.button);
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