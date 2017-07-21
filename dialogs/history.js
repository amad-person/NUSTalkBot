module.exports = function () {
    bot.dialog('historyDialog', function (session) {
        var historyStr = "www.google.com";
        session.send("Here are all the links you've found helpful:");
        session.send(historyStr);
    }).triggerAction({
        matches: 'History'
    }).beginDialogAction('historyHelp', 'helpDialog', { matches: 'Help'});
};
