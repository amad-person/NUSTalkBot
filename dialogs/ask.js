module.exports = function () {
    bot.dialog('askDialog', [
        function (session) {
            builder.Prompts.choice(session, "Choose a module:", session.userData.about.moduleNames, builder.ListStyle.button);
        },
        function(session, results) {
            session.sendTyping();
            if(results.response) {
                session.dialogData.currModule = results.response.entity;
                var promptText = "You chose " + results.response.entity + ". Ask me a question.";
                builder.Prompts.text(session, promptText);
            }
        },
        function(session, results) {
            session.sendTyping();
            if(results.response) {
                session.beginDialog('queryDialog', results.response);
            }
        },
        function(session, results) {
            // after user comes out of query dialog
        }
    ]).triggerAction({
        matches: 'Ask'
    }).beginDialogAction('askHelp', 'helpDialog', { matches: 'Help'});

    bot.dialog('queryDialog', [
        function(session, args) {
            google.resultsPerPage = 20;
            var searchQuery = args;

            if(!doesQueryExistFunc(session, searchQuery, session.dialogData.currModule)) {
                // if query doesn't already exist, make a new search
                google(searchQuery,
                    function (err, res) {
                        if(err) {
                            console.error(err);
                        }

                        for(var i = 0; i < res.links.length; ++i) {
                            var link = res.links[i];
                            allLinks.push(link);
                            console.log("Link " + i + " " + link.href);
                        }
                })
            } else {
                // query exists

            }
        }
    ]);

    function doesQueryExistFunc(session, searchQuery, currModule) {
        return (searchQuery in session.userData.about.moduleQueries[currModule]);
    }

    function getExistingLinks(session, searchQuery, currModule) {
        return session.userData.about.moduleQueries[currModule][searchQuery];
    }

    function createLinkCard(session, linkObj) {

    }

    function linkHelpful(session, currModule, searchQuery, linkText) {

    }

    function linkUnhelpful(session, currModule, searchQuery, linkText) {

    }
};



