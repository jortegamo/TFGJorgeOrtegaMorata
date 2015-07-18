Template.channels.helpers({
	pageTitle: function(){
		var title = 'Channels';
		return (title.length > 27) ? title.slice(0,27) + '...' : title;
	},
	channels: function(){
		return Channels.find({});
	},
	results: function(){return false;}
});

Template.channels.events({
	'click .display-option': function(e){
		var elem = e.currentTarget;
		$('.display-option').removeClass('active');
		$(elem).addClass('active');
	},
	'click .filter': function(e){
		var elem = e.currentTarget;
		$('.filter').removeClass('active');
		$(elem).addClass('active');
	}
})

Template.channels.rendered = function(){
	$('#records-count').tooltip({placement: 'top', title: 'records'})
	$('#votes-count').tooltip({placement: 'bottom', title: 'votes'})
	$('#comments-count').tooltip({placement: 'top', title: 'comments'})
}