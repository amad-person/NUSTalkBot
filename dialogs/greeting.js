module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
    	var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.token = IVLEToken.entity;
			//session.send(session.token);

			
			request.get('http://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.token,function(error,response,body){
         	  if(error){
		       	console.log(error);
		       } else{
		            console.log(JSON.parse(response.body));
		            session.userData.about.name = JSON.parse(response.body);
		        }
			});
			

			request.get('http://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=JWE5l4plZpPkhqENrgaVx&AuthToken='+ session.token+'&Duration=0&IncludeAllInfo=false',function(error,response,body){
         	  if(error){
		       	console.log(error);
		       } else{
		            console.log(response.body.Results);
		            session.userData.about.modules = JSON.parse(response.body.Results);
		            session.send("modules", session.userData.about.modules);
				}
			});
			
        }
        else {
        	session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name.substring(0, session.userData.about.name.indexOf(" ")));
        	session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
        }
    }).triggerAction({
         matches: 'Greeting'
       });
};
