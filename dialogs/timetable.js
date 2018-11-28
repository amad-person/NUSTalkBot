module.exports = function () {
    bot.dialog('timetableDialog', [
        function (session) {
            builder.Prompts.text(session, "Ask me anything about your schedule.");
        },
        function(session, results) {
            if(results.response) {
                var day;

                if(day = builder.EntityRecognizer.findEntity(results.response, 'Date')) {
                    day = entityRecognized.entity;
                    console.log("entity recognised", day);
                } else {
                    day = results.response.toString();
                }

                day = day.toLowerCase().trim();
                var dayCode = getDayCode(session, day);

                if(dayCode === -999) { // invalid day code
                    session.send("I'm sorry, I didn't understand. Try saying something like \'classes [day]\' or \'what do I have on [day]\'");
                    session.beginDialog('timetableDialog');
                } else {
                    var currHours = getHours();
                    var daySchedule = session.userData.timetable[dayCode];
                    console.log(daySchedule);

                    if(daySchedule.length > 0) {
                        var start, end, sTime, eTime, venue = '';
                        if(dayCode === (new Date().getDay() - 1)) {
                            session.send("Here are your classes for today.");
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
                    builder.Prompts.choice(session, "Do you want to ask another query", "Yes|No", builder.ListStyle.button);
                }
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
    }).beginDialogAction('timetableHelp', 'helpDialog', { matches: 'Help'}).beginDialogAction('restartDialog', { matches: 'Restart'});


    function getDayCode(session, day) {
        var currDay = new Date().getDay(); // index starts at 0

        // remove unnecessary punctuation
        if(day[day.length - 1]=== '?' || day[day.length - 1] === '.') {
            day = day.substring(0, (day.length - 1));
        }

        console.log('query', day);

        switch (day) {
            case 'classes today':
            case 'classes now':
            case 'classes next week':
            case 'what do i have next week':
            case 'what do i have today':
            case 'schedule today':
                dayCode = currDay;
                break;
            case 'tomorrow':
            case 'what do i have tomorrow':
            case 'classes tomorrow':
            case 'schedule tomorrow':
                dayCode = (currDay + 1)%7;
                break;
            case 'classes day after tomorrow':
            case 'classes two days later':
            case 'schedule day after tomorrow':
            case 'schedule two days later':
            case 'day after tomorrow':
            case 'two days later':
            case 'what do i have day after tomorrow':
            case 'what do i have two days later':
                dayCode = (currDay + 2)%7;
                break;
            case 'sunday':
            case 'what do i have on sunday':
            case 'what do i have next sunday':
            case 'classes next sunday':
            case 'classes sunday':
                dayCode = 0;
                break;
            case 'monday':
            case 'what do i have on monday':
            case 'what do i have next monday':
            case 'classes next monday':
            case 'classes monday':
                dayCode = 1;
                break;
            case 'tuesday':
            case 'what do i have on tuesday':
            case 'what do i have next tuesday':
            case 'classes next tuesday':
            case 'classes tuesday':
                dayCode = 2;
                break;
            case 'wednesday':
            case 'what do i have on wednesday':
            case 'what do i have next wednesday':
            case 'classes next wednesday':
            case 'classes wednesday':
                dayCode = 3;
                break;
            case 'thursday':
            case 'what do i have on thursday':
            case 'what do i have next thursday':
            case 'classes next thursday':
            case 'classes thursday':
                dayCode = 4;
                break;
            case 'friday':
            case 'what do i have on friday':
            case 'what do i have next friday':
            case 'classes next friday':
            case 'classes friday':
                dayCode = 5;
                break;
            case 'saturday':
            case 'what do i have on saturday':
            case 'what do i have next saturday':
            case 'classes next saturday':
            case 'classes saturday':
                dayCode = 6;
                break;
            default:
                dayCode = -999;
                break;
        }

        return dayCode;
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
        } else if(start === 12) {
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
            eTime = end + " pm";
        } else if(end === 12) {
            eTime = end + " pm";
        } else {
            eTime = end + " am";
        }
        return eTime;
    }
};