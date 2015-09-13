Template.signUpForm.events({
	'click a': function(){
		Session.set('formType','signInForm');
	},
	"submit form": function(e){
		e.preventDefault();
		$('div').removeClass("has-error"); //eliminamos el estado de error de los campos.
		$('.errormsg').remove();

		console.log("he hecho click en sign up");
		var username = $(e.target).find("[name=username]").val();
		var email = $(e.target).find("[name=email]").val();
		var password = $(e.target).find("[name=password]").val();
		var repassword = $(e.target).find("[name=repassword]").val();
		
		//de momento vamos a ver que las passwords sean iguales para validar.
		//El crear un nuevo usuario sería mejor llamar a un meteor method. Para que se encarge el server 
		//de crear el nuevo usuario.
		Meteor.call('signUp',
			{username: username,
			email: email,
			password: password,
			repassword: repassword},
			function(err,result){

				if (err){
					console.log("ha habido un error al crear el usuario");
				}else{
					if (result.length > 1){ //errores en el formulario.
						console.log("hay errores en el formulario");
						var errors = result[1];
						if (errors.username){
							$('#inputUsername').addClass('has-error');
							$('#inputUsername').append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i> username already exists!</p>")
						}
						if(errors.password){
							$("#inputPassword").addClass("has-error");
							$("#inputPassword").append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i> password be at least 6 chars!</p>");
						}
						if(errors.repassword){
							$("#inputRepassword").addClass('has-error');
							$("#inputRepassword").append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i>passwords do not match!</p>");
						}
					}else{//se ha creado satisfactoriamente el usuario.
						Meteor.loginWithPassword({username: username},password,function(err){
							console.log('error al logear al nuevo usuario');
						});
					}
				}
			});
	}
})