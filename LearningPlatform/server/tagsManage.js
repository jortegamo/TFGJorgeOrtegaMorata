var initializateTags = function(){
    var tagsNames = [
        'Framework',
        'MeteorJS',
        'AngularJS',
        'EmberJS',
        'ReactJS',
        'Django',
        'Python',
        'HTML',
        'HTML5',
        'CSS3',
        'Javascript',
        'Backend',
        'Frontend',
        'FullStack',
        'GitHub',
        'PivotalTracker',
        'WebService',
        'OpenSource'
    ];
    _(tagsNames).each(function(tagName){
        var tagObj = {name: tagName};
        Tags.insert(tagObj,function(err){if(err) console.log('insert Tag ERROR: ' + err.reason);})
    });
};

Meteor.startup(function(){
    if(!Tags.find().count()){
        initializateTags();
    }
});