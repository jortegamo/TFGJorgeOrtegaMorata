Template.sidebar.helpers({
	username: function(){
		var username = Meteor.user().username;
		return (username.length > 16) ? username.slice(0,16) + '...' : username;
	},
	menuTab: function(){
		return Session.get('menu-active');
	}
})

Template.sidebar.events({

	'click #logoutButton': function(){
		Meteor.logout();
	},

	'click .tab': function(e){
		$('.tab').removeClass('active');
		$(e.currentTarget).addClass('active');
		if (e.currentTarget.id == 'menu-tab'){
			Session.set('menu-active',true);
		}else{
			Session.set('menu-active',false);
		}
	},

	'click #close-sidebar': function(e){
		$(e.currentTarget).removeClass('active');
		$('#sidebar-wrapper').addClass('unactive');
	},
	'click .section-title': function(e){
		var elemId = e.currentTarget.id;

		switch(elemId){
			case 'sidebar-channels-browse':
				Router.go('channels')
				break;
			case 'sidebar-teams-browse':
				Router.go('teams')
				break;
			case 'sidebar-lessons-browse':
				Router.go('lessons')
				break;
			case 'sidebar-records-browse':
				Router.go('records')
				break;
		}
	}

});

Template.sidebar.rendered = function(){
	console.log('hola');
	Session.set('menu-active',true);
	console.log(Session.get('menu-active'))
	$('#sidebar-channels-browse span').tooltip({placement: 'top', title: 'browse all channels'});
	$('#sidebar-teams-browse span').tooltip({placement: 'top', title: 'browse all teams'});
	$('#sidebar-lessons-browse span').tooltip({placement: 'top', title: 'browse all lessons'});
	$('#sidebar-records-browse span').tooltip({placement: 'top', title: 'browse all records'});
	$('.more').tooltip({placement: 'right', title: 'browse in profile'});

	/* sidebar display events */
	function closeSidebar(){
		$('#sidebar-wrapper').addClass('unactive');
		$(window).off('resize');
		openHandler();
	}

	function openSidebar(){
		$('#sidebar-wrapper').removeClass('unactive');
		$('#close-sidebar').removeClass('active'); //if it was active and we do click on it sidebar will close (important!!)
		$(window).off('resize');
		closeHandler();
	}

	function openHandler(){
		$(window).resize(function(){
			if($(window).width() > 990) openSidebar();
		});
	}

	function closeHandler(){
		$(window).resize(function(){
			if($(window).width() <= 990) closeSidebar();
		});
	}

	function initialzeSidebar (){
		($(window).width()<= 990) ? closeSidebar() : openSidebar();
	}
	/* end sidebar display events */

	initialzeSidebar();
};
