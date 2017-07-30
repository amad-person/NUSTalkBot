module.exports = function () {
    bot.dialog('helpDialog', function (session, args) {
        switch (args.action) {
            default:
                session.endDialog("Commands you can type:  \nask: ask questions after selecting a module  \ntimetable: ask questions related to your lecture schedule  \nhistory: see a list of links you've visited today  \nrestart: restart your conversation  \nclear: clear the conversation screen");
                break;
            case 'askHelp':
                session.send("Choose a module and ask a question.");
                break;
            case 'timetableHelp':
                session.send("You can say things like \'what do I have next Tuesday\', \'classes today\', etc.");
                break;
            case 'historyHelp':
                session.send("You can view all the links you've found helpful while using this bot.");
                break;
        }
        session.endDialog("That's all. Hope this helped.");
    }).triggerAction({
        matches: 'Help'
    });
};
