Template.signInForm.events({
	"click #signUp": function(){
		Session.set("signUp",true);
	},

	"click #forgot": function(){
		Session.set("forgot", true)
	},

	"submit form": function(e){
		e.preventDefault();
		console.log("he hecho click en sign in");
		var username = $(e.target).find("[name=username]").val();
		var password = $(e.target).find("[name=password]").val();
		console.log(username);
		console.log(password);
	}
});