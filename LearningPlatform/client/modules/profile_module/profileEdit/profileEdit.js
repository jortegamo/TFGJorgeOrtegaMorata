Template.profileEdit.events({
    'submit form': function(e){
        e.preventDefault();
        Meteor.call('userUpdate',Meteor.userId(),Session.get('userObject'),function(err,res){
            if(res){
                Router.go('profile',{_id: Meteor.userId()});
            }
            if (err){
                console.log('error: ' + err);
            }
        });
    }
});

Template.profileEdit.created = function(){
    Session.set('formType','formProfileEdit');
    var user = Meteor.users.findOne(Meteor.userId());
    var userObject = {
        img: user.avatar || '/usericon.png',
        banner: user.banner || '/banner.jpeg',
        description: user.description,
        imgDefault: '/usericon.png',
        bannerDefault: '/banner.jpeg',
        tagsAllow: user.tagsAllow || false
    };
    Session.set('userObject',userObject);
};

Template.profileEdit.destroyed = function(){
    Session.set('userObject',null);
};

Template.profileEdit.rendered = function(){
    console.log('hey');
}