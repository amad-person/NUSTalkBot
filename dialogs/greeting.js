module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
    	var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.token = IVLEToken.entity;
			//session.send(session.token);
			http.get('https://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.token, { cache: true })
				.then(function(result){
					console.log(result);
					session.userData.about.name = result.data;
			});
        }
        session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name);
        session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
    }).triggerAction({
         matches: 'Greeting'
       });
};
