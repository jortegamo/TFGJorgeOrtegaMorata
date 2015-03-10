Template.signUpForm.events({
	"click #back": function(){
		Session.set("signUp",false);
	},
	"submit form": function(e){
		e.preventDefault();
		console.log("he hecho click en sign up");
		var username = $(e.target).find("[name=username]").val();
		var email = $(e.target).find("[name=email]").val();
		var password = $(e.target).find("[name=password]").val();
		var repassword = $(e.target).find("[name=repassword]").val();
		console.log(username);
		console.log(email);
		console.log(password);
		console.log(repassword);
	}
})