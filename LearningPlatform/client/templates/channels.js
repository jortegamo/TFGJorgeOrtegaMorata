Template.channels.helpers({
	channels: function(){
		return Channels.find({});
	}
});

Template.channels.rendered = function(){
	$('#records-count').tooltip({placement: 'top', title: 'records'})
	$('#votes-count').tooltip({placement: 'bottom', title: 'votes'})
	$('#comments-count').tooltip({placement: 'top', title: 'comments'})
}