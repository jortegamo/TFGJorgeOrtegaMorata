Template.layout.events({
	'click #close-not': function(){
		$('.notification').removeClass('notification-in');
		$('.notification').addClass('notification-out');
	},
	'click #show': function(){
		$('.notification').removeClass('notification-out');
		$('.notification').addClass('notification-in');
	}
})