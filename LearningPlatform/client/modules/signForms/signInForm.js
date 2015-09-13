Template.signInForm.events({
	"click #signUp": function(){
		Session.set("formType",'signUpForm');
	},

	"click #forgot": function(){
		Session.set("formType", 'forgotPasswordForm');
	},

	"submit form": function(e){
		e.preventDefault();
		$("div").removeClass("has-error");
		$(".errormsg").remove();
		console.log("he hecho click en sign in");
		var username = $(e.target).find("[name=username]").val();
		var password = $(e.target).find("[name=password]").val();
		
		Meteor.loginWithPassword({username: username},password,function(err){
			if (err){
				switch(err.reason){
					case 'Incorrect password': 
						$("#inputPassword").addClass("has-error");
						$("#inputPassword").append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Incorrect Password</p>');
						break;
					case 'User not found':
						$("#inputUsername").addClass("has-error");
						$("#inputUsername").append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Incorrect Username</p>');
						break;
				}
			}else{
				$('#loginForm').modal('hide');
				console.log("usuario logueado");
			}
		});
	}
});