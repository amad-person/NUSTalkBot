module.exports = function () {
    bot.dialog('welcomeDialog', function (session, args) {
        session.sendTyping();
		
		var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.userData.token = IVLEToken.entity;
			session.send(session.userData.token);
        }
        session.send("%s, I have some information for you.", session.userData.about.name);
        session.send("Modules you've taken for this semester: %s", session.userData.about.moduleNames.toString());
        session.send("Commands you can type:  \nask: ask questions after selecting a module  \ntimetable: ask questions related to your lecture schedule  \nhistory: see a list of links you've visited today  \nrestart: restart your conversation");

        session.endDialog("That's it. Have fun!");
    }).triggerAction({
        matches: 'Welcome'
    });
};