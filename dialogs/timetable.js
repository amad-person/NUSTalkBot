module.exports = function () {
    bot.dialog('timetableDialog', [
        function (session) {
            builder.Prompts.text(session, "Ask me anything about your schedule.");
        },
        function(session, results) {
            if(results.response) {
                var day;

                if(day = builder.EntityRecognizer.findEntity(results.response.entity, 'Date')) {
                    day = entityRecognized.entity;
                    console.log(day);
                } else {
                    day = results.response.toString();
                }

                var dayCode = getDayCode(session, day);

                if(dayCode === -1) { // invalid day code
                    session.send("I'm sorry, I didn't understand. Try saying something like \'classes [day]\' or \'what do I have on [day]\'");
                } else {
                    var currHours = getHours();
                    var daySchedule = session.userData.timetable[dayCode];

                    if(daySchedule.length > 0) {
                        if(day.toLowerCase() === 'today' || day.toLowerCase() === 'classes today' || day.toLowerCase() === 'schedule today' || day.toLowerCase() === 'what do i have today') {
                            session.send("Here are your classes for today.");
                            var start, end, sTime, eTime, venue = '';
                            for(var i = 0; i < Object.keys(daySchedule).length; i++) {
                                if(daySchedule[i].StartTime >= currHours) {
                                    start = daySchedule[i].StartTime/100;
                                    end = daySchedule[i].EndTime/100;
                                    sTime = getStartTime(start);
                                    eTime = getEndTime(end);

                                    if(!(daySchedule[i].Venue === ''))
                                        venue = ' at ' + daySchedule[i].Venue;

                                    var msg = daySchedule[i].ModuleCode + " " + daySchedule[i].LessonType + " from " + sTime + " to " + eTime  + venue;
                                    session.send(msg);
                                }
                            }
                        } else {
                            session.send("Here are your classes:");
                            for(var j = 0; j < Object.keys(daySchedule).length; j++) {
                                start = daySchedule[j].StartTime/100;
                                end = daySchedule[j].EndTime/100;
                                sTime = getStartTime(start);
                                eTime = getEndTime(end);

                                if(!(daySchedule[j].Venue === ''))
                                    venue = ' at ' + daySchedule[j].Venue;

                                var msg = daySchedule[j].ModuleCode + " " + daySchedule[j].LessonType + " from " + sTime + " to " + eTime + venue;
                                session.send(msg);
                                session.send()
                            }
                        }
                    } else {
                        session.send("Looks like you have no classes.");
                    }
                }
                builder.Prompts.choice(session, "Do you want to ask another query", "Yes|No", builder.ListStyle.button);
            }
        },
        function (session, results) {
            if(results.response) {
                switch (results.response.entity.toLowerCase()) {
                    case "yes":
                        session.send("Okay, starting over...");
                        session.beginDialog('timetableDialog');
                        break;
                    case "no":
                        session.endDialog("Okay, see you!");
                        break;
                }
            }
        }
    ]).triggerAction({
        matches: 'Timetable'
    }).beginDialogAction('timetableHelp', 'helpDialog', { matches: 'Help'});


    function getDayCode(session, day) {
        var currDay = new Date().getDay() - 1; // index starts at 0

        // remove unnecessary punctuation
        if(day[day.length - 1]=== '?' || day[day.length - 1] === '.') {
            day = day.substring(0, (day.length - 1));
        }

        switch (day.toLowerCase()) {
            case 'tomorrow':
            case 'what do i have tomorrow':
            case 'classes tomorrow':
            case 'schedule tomorrow':
                currDay = (currDay + 1)%7;
                break;
            case 'classes day after tomorrow':
            case 'classes two days later':
            case 'schedule day after tomorrow':
            case 'schedule two days later':
            case 'day after tomorrow':
            case 'two days later':
            case 'what do i have day after tomorrow':
            case 'what do i have two days later':
                currDay = (currDay + 2)%7;
                break;
            case 'monday':
            case 'what do i have on monday':
            case 'what do i have next monday':
            case 'classes next monday':
            case 'classes monday':
                currDay = 0;
                break;
            case 'tuesday':
            case 'what do i have on tuesday':
            case 'what do i have next tuesday':
            case 'classes next tuesday':
            case 'classes tuesday':
                currDay = 1;
                break;
            case 'wednesday':
            case 'what do i have on wednesday':
            case 'what do i have next wednesday':
            case 'classes next wednesday':
            case 'classes wednesday':
                currDay = 2;
                break;
            case 'thursday':
            case 'what do i have on thursday':
            case 'what do i have next thursday':
            case 'classes next thursday':
            case 'classes thursday':
                currDay = 3;
                break;
            case 'friday':
            case 'what do i have on friday':
            case 'what do i have next friday':
            case 'classes next friday':
            case 'classes friday':
                currDay = 4;
                break;
            case 'saturday':
            case 'what do i have on saturday':
            case 'what do i have next saturday':
            case 'classes next saturday':
            case 'classes saturday':
                currDay = 5;
                break;
            case 'sunday':
            case 'what do i have on sunday':
            case 'what do i have next sunday':
            case 'classes next sunday':
            case 'classes sunday':
                currDay = 6;
                break;
            case 'classes next week':
            case 'what do i have next week':
                break;
            default:
                currDay = -1;
                break;
        }
        console.log("currDay: ", currDay);
        return currDay;
    }

    function getHours() {
        var currHours = new Date().getHours();
        return currHours*100;
    }

    function getStartTime(start) {
        var sTime = "";
        if(start > 12) {
            start = start - 12;
            sTime =  start + " pm";
        } else {
            sTime = start + " am";
        }
        return sTime;
    }

    function getEndTime(end) {
        var eTime = "";
        if(end > 12) {
            end = end - 12;
            eTime = end + " pm"
        } else {
            eTime = end + " am"
        }
        return eTime;
    }
};