$(document).ready(function(){
	//inicializamos el cliente de SoundCloud.
	SC.initialize({
		client_id: "6d26d09039e9b5b4c86da7b3b8d932c0",
		redirect_uri: "http://localhost:3000/redirect"
	});
});