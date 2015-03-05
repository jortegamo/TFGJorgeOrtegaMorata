Router.configure({
  layoutTemplate: 'layout',
});

Router.route('/', {name: 'mainPage'});

Router.route('/submit',{name: 'postSubmit'});