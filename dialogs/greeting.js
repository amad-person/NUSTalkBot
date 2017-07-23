module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
    	var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.token = IVLEToken.entity;
			session.send(session.token);
			/*
			http.get('http://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.token, { cache: true })
				.(function(result){
					console.log(result);
					session.userData.about.name = result.data;
					session.send(session.userData.about.name);
			});
			*/
			request.get('http://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.token,function(error,response,body){
         	  if(error){
		       	console.log(error);
		       } else{
		            console.log(response.body);
		            session.userData.about.name = response.body;
					session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name);
        			session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
		        }
			});
        }
    }).triggerAction({
         matches: 'Greeting'
       });
};
