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
		params.avatar = params.img;
		params.img = null;
		return Meteor.users.update(user_id,{$set: params});
	}
});

Meteor.startup(function(){
	UserStatus.events.on('connectionLogout',function(fields){
		//aquí cada vez que se desconecte un usuario se borraran los datos pertinentes.
	});
	Accounts.emailTemplates.siteName = "DuckFlight";
	Accounts.emailTemplates.from = "DuckFlight <accounts@example.com>";
	Accounts.emailTemplates.verifyEmail.subject = function (user) {
		return "Welcome to DuckFlight, " + user.profile.name;
	};
	Accounts.emailTemplates.resetPassword.subject = function(user){
		return "Hello " + user;
	};
	Accounts.emailTemplates.resetPassword.text = function(user,url){
		return "To reset your password, simply click the link below:\n\n"
			+ url;
	};
	Accounts.emailTemplates.verifyEmail.text = function (user, url) {
		return "To activate your account, simply click the link below:\n\n"
			+ url;
	};
});