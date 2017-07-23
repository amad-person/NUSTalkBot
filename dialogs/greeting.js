module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
    	var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.userData.token = IVLEToken.entity;
			session.send(session.userData.token);
        }
        session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name);
        session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
    }).triggerAction({
         matches: 'Greeting'
       });
};
