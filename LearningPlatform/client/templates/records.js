Template.records.helpers({
	records: function(){
		if (!Session.get("search")){
			return Records.find({},{sort: {createdAt: -1}});
		}else{
			console.log("he entrado en cond correcta");
			var search = Session.get('search');
			switch(search[0]){
				case 'most':
					console.log("es most y arg es: " );
					break;
				case 'author':
					console.log("es author y arg es: " + search[1]);
					break;
				case 'title':
					console.log("es title y arg es: ");
					break;
				case 'channel':
					console.log("es channel y arg es: " );
					break;
			}
		}
		return Records.find({});
	}
})

Template.records.events({
	
	'click .record-entry': function(e){
		Router.go('post',{_id: this._id});
	},

	'keydown input, click #search': function(e){
		if (e.keyCode == 13 | e.type == 'click'){
			var val = $('input').val();
			$('input').val("");
			var cmd = val.split(':')[0].replace(" ", "");
			var searchParam = val.split(':').slice(1);
			Session.set("search",[cmd,searchParam]);
			$('#search').popover('hide');
		}

	},

	'click input': function(){
		$('#search').popover('show');
	}
});

Template.records.rendered = function(){
	$('#file-count').tooltip({placement: 'bottom', title: 'documents'})
	$('#replies-count').tooltip({placement: 'top', title: 'replies'})
	$('#votes-count').tooltip({placement: 'top', title: 'votes'})
	$('#comments-count').tooltip({placement: 'bottom', title: 'comments'})
	$('h2 a').tooltip({placement: 'left', title: 'create a new Record'});
	$('#search').popover({
		placement: 'bottom',
		title: 'search comands',
		trigger: 'focus',
		content: 'aksdjfñalksjdfñlaksjdfñlaksdjñkdljfañlksjd',
		container: '#search'
	})

}

Template.records.created = function(){
	Session.set('search',null);
}