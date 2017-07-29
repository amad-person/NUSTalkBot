module.exports = function () {
    bot.dialog('welcomeDialog', function (session) {
        session.sendTyping();
		
        session.send("I have some information for you.");
        session.send("Commands you can type:</br>ask: ask questions after selecting a module</br>timetable: ask questions related to your lecture schedule</br>history: see a list of links you've visited today</br>restart: restart your conversation");

        session.endDialog("That's it. Have fun!");
    }).triggerAction({
        matches: 'Welcome'
    });
};