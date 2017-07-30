module.exports = function () {
    bot.dialog('greetingDialog', function (session, args) {
        var IVLEToken = builder.EntityRecognizer.findEntity(args.intent.entities, 'IVLEtoken');
        if (args && IVLEToken) {
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

                    session.userData.timetableRaw = JSON.parse(response.body).Results;
                    session.save();
                    // console.log(session.userData.timetableRaw);

                    session.userData.timetable = getFinalTimetable(session.userData.timetableRaw);
                    session.save();
                    console.log(session.userData.timetable);
                }
            });
        }
        else {
            session.send("Hey %s! I\'m the NUSTalkBot. Type something.", session.userData.name);
            session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
        }
    }).triggerAction({
        matches: 'Greeting'
    }).beginDialogAction('alrHome', 'restartDialog', { matches: 'Restart'});

    function getFinalTimetable(timetableRaw) {
        var mon = [];
        var tue = [];
        var wed = [];
        var thurs = [];
        var fri = [];
        var sat = [];
        var sun = [];

        for(var k = 0; k < timetableRaw.length; k++) {
            var obj = timetableRaw[k];
            switch (obj.DayCode) {
                case '1':
                    mon.push(obj);
                    break;
                case '2':
                    tue.push(obj);
                    break;
                case '3':
                    wed.push(obj);
                    break;
                case '4':
                    thurs.push(obj);
                    break;
                case '5':
                    fri.push(obj);
                    break;
                case '6':
                    sat.push(obj);
                    break;
                case '7':
                    sun.push(obj);
                    break;
                default:
                    console.log("invalid DayCode");
                    break;
            }
        }

        var timetable = [];
        timetable.push(sun, mon, tue, wed, thurs, fri, sat); // Date object in JS starts the week with Sunday
        // console.log('in function');
        // console.log(timetable);
        return timetable;
    }
};
