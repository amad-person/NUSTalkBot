module.exports = function () {
    bot.dialog('timetableDialog', [
        function (session) {
            builder.Prompts.text(session, "Ask me anything about your schedule.");
        },
        function (session, results) {
            if(results.response) {
                var day = builder.EntityRecognizer.findEntity(args.intent.entities, 'datetimeV2');
                var dayCode = getDayCode(day);
                var currHours = getHours();
                var daySchedule = session.userData.timetable[dayCode];
                if(day === 'today') {
                    session.send("Here are your classes for today.");
                    for(var i = 0; i < Object.keys(daySchedule).length; i++) {
                        if(daySchedule[i].StartTime >= currHours) {
                            var start = daySchedule[i].StartTime/100;
                            var end = daySchedule[i].EndTime/100;
                            var sTime = getStartTime(start), eTime = getEndTime(end);
                            var msg = daySchedule[i].CourseCode + " " + daySchedule[i].LessonType + " from " + sTime + " to " + eTime + " at " + daySchedule[i].Venue;
                            session.send(msg);
                        }
                    }
                } else {
                    session.send("Here are your classes for ", day);
                    for(var j = 0; j < Object.keys((daySchedule).length; j++) {
                        var start = daySchedule[j].StartTime/100;
                        var end = daySchedule[j].EndTime/100;
                        var sTime = getStartTime(start), eTime = getEndTime(end);
                        var msg = daySchedule[j].CourseCode + " " + daySchedule[j].LessonType + " from " + sTime + " to " + eTime + " at " + daySchedule[j].Venue;
                        session.send(msg);
                        session.send()
                    }
                }
            }
            builder.Prompts.choice(session, "Do you want to ask another query", "Yes|No", builder.ListStyle.button);
        },
        function (session, results) {
            switch (results.response.entity.toLowerCase()) {
                case "yes":
                    session.beginDialog('timetableDialog');
                    break;
                case "no":
                    session.endDialog("Okay, see you!");
                    break;
            }
         }
    ]).triggerAction({
        matches: 'Timetable'
    }).beginDialogAction('timetableHelp', 'helpDialog', { matches: 'Help'});

    function getDayCode(day) {
        var currDay = new Date().getDay();
        switch (day.toLowerCase()) {
            case 'tomorrow':
                currDay = (currDay + 1)%7;
                break;
            case 'day after tomorrow':
            case 'two days later':
                currDay = (currDay + 2)%7;
                break;
            default:
                break;
        }
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