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
	pageTitle: function(){
		var title = 'Records';
		return ellipsis(title,27);
	},
	records: function(){
		return Records.find({},{sort: {createdAt: -1}});
	},
	listMode: function(){
		return Session.get('horizontalMode');
	}
});

Template.records.events({
	
	'click .image-hover i, click .card-title': function(){
		Router.go('record',{_id: this._id}); //voy a la pagina principal del record.
	},

	'click .display-option': function(e){
		var elem = e.currentTarget;
		$('.display-option').removeClass('active');
		$(elem).addClass('active');
		if (elem.id == 'list'){
			Session.set('horizontalMode',true);
		}else{
			Session.set('horizontalMode',false);
		}
	},
	'click .filter': function(e){
		var elem = e.currentTarget;
		$('.filter').removeClass('active');
		$(elem).addClass('active');
	},
	'click .button-circle': function(){
		Router.go('recordSubmit');
	},

	'click .card-author': function(){
		Router.go('profile',{_id: this.author});
	}
});

Template.records.rendered = function(){
	Session.set('horizontalMode',true);
	$('.button-circle').tooltip({placement: 'bottom', title: 'create a new Record'});
};

Template.records.created = function(){
	Session.set('search', null);
}


Template.recordItemHorizontal.helpers({
	shortDescription: function(description,max){
		return ellipsis(description,max);
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	authorName: function(){
		return Meteor.users.findOne(this.author).username;
	}
});

Template.recordItemHorizontal.rendered = function(){
	$('.file-count').tooltip({placement: 'bottom', title: 'documents'});
	$('.replies-count').tooltip({placement: 'top', title: 'replies'});
	$('.votes-count').tooltip({placement: 'top', title: 'votes'});
	$('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
};

Template.recordItemVertical.helpers({
	dateFrom: function(d){
		return smartDate(d);
	},
	authorName: function(){
		return Meteor.users.findOne(this.author).username;
	}
});

Template.recordItemVertical.rendered = function(){
	$('.file-count').tooltip({placement: 'bottom', title: 'documents'});
	$('.replies-count').tooltip({placement: 'top', title: 'replies'});
	$('.votes-count').tooltip({placement: 'top', title: 'votes'});
	$('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
}