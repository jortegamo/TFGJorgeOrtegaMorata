Template.mainPage.rendered = function(){
	Session.set('notMainPage',false);
}

Template.mainPage.destroyed = function(){
	Session.set('notMainPage',true);
}

Template.loginForm.helpers({
	"signUp": function(){
		return Session.get("signUp");
	},
	"forgotPassword": function(){
		return Session.get("forgot");
	}
});

Template.loginForm.rendered = function(){
	$("#loginForm").modal('hide');
	Session.set("signUp",false);
	Session.set("forgot",false);

	$('#loginForm').on('hidden.bs.modal', function (e) {
		//siempre que se intente entrar debe mostrarse el formulario de sign In.
  		Session.set("signUp",false);
		Session.set("forgot",false);
	});
}
