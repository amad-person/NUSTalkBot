module.exports = function () {
    bot.dialog('askDialog', [
        function (session) {
            builder.Prompts.choice(session, "Choose a module:", session.userData.moduleNames, builder.ListStyle.button);
        },
        function(session, results) {
            session.sendTyping();
            if(results.response) {
                session.userData.currModule = results.response.entity;
                session.save();
                var promptText = "You chose " + session.userData.currModule + ". Ask me a question.";
                builder.Prompts.text(session, promptText);
            }
        },
        function(session, results) {
            session.sendTyping();
            if(results.response) {
                session.sendTyping();
                session.beginDialog('queryDialog', results.response);
            }
        },
        function(session, results) {
            // after user comes out of query dialog
            if(results.response.entity) {
                builder.Prompts.choice(session, "I knew I could do it. Do you have another question?", "Yes|No", builder.ListStyle.button);
            } else {
                builder.Prompts.choice(session, "Sorry...do you want to try again?", "Yes|No", builder.ListStyle.button);
            }
        },
        function (session, results) {
            switch (results.response.entity.toLowerCase()) {
                case "yes":
                    session.beginDialog('askDialog');
                    break;
                case "no":
                    // redirect prompt 'do you want to ask a friend or a tutor'
                    session.endDialog("Okay, see you!");
                    break;
            }
        }
    ]).triggerAction({
        matches: 'Ask'
    }).beginDialogAction('askHelp', 'helpDialog', { matches: 'Help'}).beginDialogAction('notHome', 'restartDialog', { matches: 'Restart'});

    bot.dialog('queryDialog', [
        function(session, args) {
            var searchQuery = args.toString(), currModule = session.userData.currModule;
            session.userData.searchQuery = searchQuery;
            session.save();

            if(!doesQueryExist(session, searchQuery, currModule)) {
                // if query doesn't already exist, make a new search

                session.userData.linksObj = doSearch(session, searchQuery);
                session.save();
                session.userData.moduleQueries[currModule][searchQuery] = session.userData.linksObj;
                session.save();
            } else {
                // query exists
                session.userData.linksObj = getExistingLinks(session, searchQuery, currModule);
                session.save();
            }

            // get first link
            var currLink = session.userData.linksObj[0];

            // show link card
            session.userData.currentLink = currLink;
            session.save();
            var card = createLinkCard(session, currLink);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            // ask if link is helpful
            builder.Prompts.choice(session, "Was the link helpful?", "Yes|No", builder.ListStyle.button);
        },
        function (session, results) {
            session.userData.success = false;
            switch (results.response.entity.toLowerCase()) {
                case "yes":
                    session.userData.currLink.helpful = true;
                    session.userData.success = true;
                    break;
                case "no":
                    session.userData.success = false;
                    deleteLink(session, session.userData.currModule, session.userData.searchQuery);
                    break;
            }
            session.save();
            session.endDialogWithResult(session.userData.success);
        }
    ]);

    function doSearch(session, searchQuery) {
        var linksObj = [];
        google.resultsPerPage = 20; // get the first 20 links
        google(searchQuery, function (err, res) {
                if(err) {
                    console.error(err);
                }

                res.links.splice(0, 1); // remove null object at index 0
                linksObj = res.links;
                console.log('linksObj inside request: ', linksObj);
            });

        for(var i = 0; i < Object.keys(linksObj).length; i++) {
            linksObj[i].helpful = false;
        }
        console.log('linksObj outside request ', linksObj);
        return linksObj;
    }

    function doesQueryExist(session, searchQuery, currModule) {
        var currModuleQueries = session.userData.moduleQueries[currModule];
        // console.log(session.userData.moduleQueries);
        return (searchQuery in currModuleQueries);
    }

    function getExistingLinks(session, searchQuery, currModule) {
        var currModuleQueries = session.userData.moduleQueries[currModule];
        // console.log(Object.keys(currModuleQueries));
        return currModuleQueries[searchQuery];
    }

    // create hero card to display results of search query
    function createLinkCard(session, currLink) {
        return new builder.HeroCard(session)
            .title(currLink.title)
            .text(currLink.description)
            .buttons([
                builder.CardAction.openUrl(session, currLink.link, 'Open URL')
            ]);
    }

    // delete link if not helpful
    // if links become 0 then delete the searchQuery
    function deleteLink(session, currModule, searchQuery) {
        if(Object.keys(session.userData.linksObj).length === 0) {
            delete session.userData.moduleQueries[currModule][searchQuery];
        } else {
            session.userData.linksObj.splice(0, 1);
        }
        session.save();
    }
};



