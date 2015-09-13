Template.profileEdit.events({
    'click #avatar-section .save': function(e){

        var avatar = '/usericon.png';

        function setAvatar (avatar){
            var obj = Session.get('userObject');
            obj.avatar = avatar;
            Session.set('userObject',obj);
            $('#avatar-section .discard').click();
        };

        var cbs = $('#avatar-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');

            switch($(input).attr('type')) {
                case 'text':
                    setAvatar($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setAvatar(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setAvatar(avatar);
        }

    },

    'click #banner-section .save': function(e){
        var banner = '/banner.jpeg';

        function setBanner(banner){
            var obj = Session.get('userObject');
            obj.banner = banner;
            Session.set('userObject',obj);
            $('#banner-section .discard').click();
        }

        var cbs = $('#banner-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');
            switch($(input).attr('type')) {
                case 'text':
                    setBanner($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setBanner(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setBanner (banner);
        }
    },

    'click #description-section .save': function(e){
        var obj = Session.get('userObject');
        obj.description = $('#description-section').find('textarea').val();
        Session.set('userObject',obj);
        $('#description-section .discard').click();
    },
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
        avatar: user.avatar || '/usericon.png',
        banner: user.banner || '/banner.jpeg',
        description: user.description
    };
    Session.set('userObject',userObject);
};

Template.profileEdit.destroyed = function(){
    Session.set('userObject',null);
};

Template.profileEdit.rendered = function(){
    console.log('hey');
}