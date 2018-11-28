module.exports = function () {
    bot.dialog('welcomeDialog', function (session) {
        session.sendTyping();
		
        session.send("I have some information for you.");
        session.send("Commands you can type:  \nask: ask questions after selecting a module  \ntimetable: ask questions related to your lecture schedule  \nhistory: see a list of links you've visited today  \nrestart: restart your conversation  \nhelp: see information about commands");

        session.endDialog("That's it. Have fun!");
    }).triggerAction({
        matches: 'Welcome'
    });
};