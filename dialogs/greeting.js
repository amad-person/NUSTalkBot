module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
    	var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.token = IVLEToken.entity;
			//session.send(session.token);

			//getting username
			request.get('http://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.token,function(error,response,body){
         	  if(error){
         	  	session.send('error');
		       	console.log(error);
		       } else{
		            console.log(JSON.parse(response.body));
		            console.log(session.userData.name);
		            var name = JSON.parse(response.body);
		            session.userData.name = name.substring(0, name.indexOf(" "));
		            console.log(session.userData.name);

		        }
			});

        }
        else {
        	session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name);
        	session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
        }
    }).triggerAction({
         matches: 'Greeting'
       });
};
