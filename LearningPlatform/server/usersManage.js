var validatePassword = function(password){
	//de momento que sea mayor o igual que 6 caracteres.
	return password.length >= 6;
};

var validateUserName = function(username){
	return !Meteor.users.findOne({username: username});
};

var validateCreateUser = function(user,errors){
	//debe de cumplir todas las condiciones de validación.
	if(!validateUserName(user.username)) errors.username = true;
	if (!validatePassword(user.password)) errors.password = true;
	if (user.password != user.repassword) errors.repassword = true;
	console.log(errors);
	return _(errors).keys().length == 0;
}

Meteor.methods({
	signUp: function(user){
		var errors = {};
		var result;
		if (validateCreateUser(user,errors)){
			var id = Accounts.createUser({
					username: user.username,
					password: user.password,
					email: user.email,
				});
			var params = {
				          avatar: '/usericon.png',
						  banner: '/banner.jpeg'
						};
			Meteor.users.update(id,{$set: params});

			result = [true];
		}else{
			result = [false, errors];
		}
		return result;
	},
	userUpdate: function(user_id,params){
		return Meteor.users.update(user_id,{$set: params});
	}
});