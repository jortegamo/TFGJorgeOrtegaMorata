Template.forgotPasswordForm.events({
	"click #back": function(){
		Session.set("forgot",false);
	},
	"submit form": function(e){
		e.preventDefault();
		console.log("he hecho click en send");
		var username = $(e.target).find("[name=username]").val();
		var email = $(e.target).find("[name=email]").val();
		console.log(username);
		console.log(email);
	}
})