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
        }
    ]).triggerAction({
        matches: 'Timetable'
    }).beginDialogAction('timetableHelp', 'helpDialog', { matches: 'Help'});
};