var validatePassword = function(password){
	//de momento que sea mayor o igual que 6 caracteres.
	return password.length >= 6;
};

var validateCreateUser = function(user,errors){
	//debe de cumplir todas las condiciones de validación.
	if (!validatePassword(user.password)) errors.password = true;
	if (user.password != user.repassword) errors.repassword = true;
	return _(errors).keys().length == 0;
}

Meteor.methods({
	signUp: function(user){
		var errors = {};
		console.log("quieren crear un nuevo usuario!!");
		if (validateCreateUser(user,errors)){
			console.log("he validado el usuario!!");
			Accounts.createUser(
				{username: user.username, 
				password: user.password,
				email: user.email}
			);
			return [true];
		}else{
			return [false, errors];
		}
	}
});