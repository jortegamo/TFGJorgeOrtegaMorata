Template.loginModal.events({

});

Template.loginModal.rendered = function(){
    $("#loginForm").modal('hide');
    Session.set('formType','signInForm');

    $('#loginForm').on('hidden.bs.modal', function (e){
        Session.set('formType','signInForm');
    });
};