module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
    	var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
   		if (IVLEToken) {
            session.token = IVLEToken.entity;
			session.send(session.token);

			
			request.get('https://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.token,function(error,response,body){
         	  if(error){
         	  	session.send('error');
		       	console.log(error);
		       } else{
		            console.log(JSON.parse(response.body));
		            var name = JSON.parse(response.body);
		            session.send('name', name);
		            session.userData.about.name = name.substring(0, name.indexOf(" "));
		            
		            //session.userData.about.moduleNames = [];
		        }
			});
			
			/*
			request.get('http://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=JWE5l4plZpPkhqENrgaVx&AuthToken='+ session.token+'&Duration=0&IncludeAllInfo=false',function(error,response,body){
         	  if(error){
		       	console.log(error);
		       } else{
		            console.log(JSON.parse(response.body).Results);
		            session.userData.about.modules = JSON.parse(JSON.parse(response.body).Results);
		            console.log(session.userData.about.modules);
		            
		            for(var i=0;i<session.userData.about.modules.length;++i){
		            	session.userData.about.moduleNames.push(session.userData.about.modules[i].CourseCode);
		            }
				}
			});
			*/
			
        }
        else {
        	session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name);
        	session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
        }
    }).triggerAction({
         matches: 'Greeting'
       });
};
