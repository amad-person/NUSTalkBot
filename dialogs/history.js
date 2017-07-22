module.exports = function () {
    bot.dialog('historyDialog', function (session) {
        var historyStr = getHistory(session);
        session.send("Here are all the links you've found helpful:");
        session.send(historyStr);
    }).triggerAction({
        matches: 'History'
    }).beginDialogAction('historyHelp', 'helpDialog', { matches: 'Help'});

    function getHistory(session) {
        var historyStr = "";
        var moduleQueries = session.userData.about.moduleQueries;

        for(var module = 0; module < Object.keys(moduleQueries).length; module++) {
            for(var searchQuery = 0; searchQuery < Object.keys(moduleQueries[module]).length; searchQuery++) {
                for(var link = 0; link < Object.keys(moduleQueries[module][searchQuery]).length; link++) {
                    if(moduleQueries[module][searchQuery][link].helpful === true) {
                        historyStr = historyStr + moduleQueries[module][searchQuery][link].href + "  \n"
                    }
                }
            }
        }

        return historyStr;
    }
};