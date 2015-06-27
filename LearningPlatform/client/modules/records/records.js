var searchParser = function(search){
	var reg = new RegExp ('^author|title|channel:.*$');
	if (reg.test(search)){ //nos aseguramos de que el comando es valido.
		var ps = search.split(':');
		cmd = ps[0]; 
		if (ps.length > 2){ //hay ':' en el argumento. vuelvo a construir todo el argumento.
			var args = ps.slice(1);
			arg = _(args).join(":");
		}else{
			arg = ps[1];
		}
		return [cmd,arg];
	}
	return null;
};


Template.records.helpers({
	records: function(){
		if (Session.get("search")){
			var search = Session.get('search');
			switch (search[0]){
				case 'author':
				return Records.find({author: search[1]},{sort: {createdAt: -1}});
				break;
				case 'title':
				return Records.find({title: search[1]},{sort: {createdAt: -1}});
				break;
				case 'channel':
				return Records.find({channel: search[1]},{sort: {createdAt: -1}});
				break;
			}
		}
		return Records.find({},{sort: {createdAt: -1}});
	}
})

Template.records.events({
	
	'click .record-entry': function(){
		Router.go('post',{_id: this._id}); //voy a la pagina principal del post.
	},

	'keydown input, click #search': function(e){ //se ha realizado alguna busqueda.
		if (e.keyCode == 13 | e.type == 'click'){
			var sParsed = searchParser ($('input').val());
			if (sParsed){
				Session.set('search',sParsed);
			}else{
				Session.set('search',null);
			}
			$('input').val("");
			$('#search').popover('hide');
		}
	},

	'click input': function(){ //al intentar buscar se muestra al ayudante.
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
	});
}

Template.records.created = function(){
	Session.set('search', null);
}