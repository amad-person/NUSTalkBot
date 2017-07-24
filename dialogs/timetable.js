module.exports = function () {
    bot.dialog('timetableDialog', [
        function (session) {
            builder.Prompts.text(session, "Ask me anything about your schedule today.");
        },
        function (session, results) {
            if(results.response) {
                session.dialogData.timetableQuery = results.response;
            }
            session.send("You said: %s", session.dialogData.timetableQuery);
            builder.Prompts.choice(session, "Was I helpful?", "Yes|No", builder.ListStyle.button);
        },
        function (session, results) {
            switch (results.response.entity) {
            }
        }
    ]).triggerAction({
        matches: 'Timetable'
    }).beginDialogAction('timetableHelp', 'helpDialog', { matches: 'Help'});
};