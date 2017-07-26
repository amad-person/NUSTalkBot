module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
        var IVLEToken= builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
        if (IVLEToken) {
            session.userData.token = IVLEToken.entity;
            //session.send(session.token);

            //getting username
            request.get('http://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=JWE5l4plZpPkhqENrgaVx&Token='+ session.userData.token, function(error,response,body){
                if(error){
                    console.log(error);
                } else{
                    console.log(JSON.parse(response.body));
                    // console.log(session.userData.name);
                    var name = JSON.parse(response.body);
                    session.userData.name = name;
                    session.save();

                }
            });

            // getting list of modules
            request.get('http://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=JWE5l4plZpPkhqENrgaVx&AuthToken='+ session.userData.token + '&Duration=0&IncludeAllInfo=false', function(error,response,body){
                if(error){
                    console.log(error);
                } else{
                    var modules = JSON.parse(response.body).Results;
                    session.userData.modules = modules;
                    // console.log(session.userData.modules);
                    session.save();

                    var moduleNames = [], moduleQueries = {};

                    for(var i = 0; i < Object.keys(modules).length; i++) {
                        moduleNames.push(modules[i].CourseCode);
                    }

                    session.userData.moduleNames = moduleNames;
                    session.save();

                    // console.log(session.userData.moduleNames.toString());
                    for(var j = 0; j < Object.keys(moduleNames).length; j++) {
                        moduleQueries[session.userData.moduleNames[j]] = {
                            'defaultQuery': 'hello world'
                        }
                    }

                    session.userData.moduleQueries = moduleQueries;
                    session.save();
                    // console.log(session.userData.moduleQueries);
                }
            });

            // getting timetable
            request.get('http://ivle.nus.edu.sg/api/Lapi.svc/Timetable_Student?APIKey=JWE5l4plZpPkhqENrgaVx&AuthToken=' + session.userData.token + '&AcadYear=2017/2018&Semester=1', function(error,response,body){
                if(error){
                    console.log(error);
                } else{
                    // console.log(JSON.parse(response.body).Results);
                    var timetable = JSON.parse(response.body).Results;
                    session.userData.timetable = timetable;
                    session.save();

                }
            });

        }
        else {
            session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.name);
            session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
        }
    }).triggerAction({
        matches: 'Greeting'
    });
};
