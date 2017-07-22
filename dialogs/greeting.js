module.exports = function () {
    bot.dialog('greetingDialog', function (session) {
        session.send("Hey %s! I'm the NUSTalkBot. Type something.", session.userData.about.name);
        session.send("If you're using this for the first time or want to see the welcome message again, type \'start\'.");
    }).triggerAction({
         matches: 'Greeting'
       });
};
