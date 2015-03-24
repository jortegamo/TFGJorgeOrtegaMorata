Router.configure({
  layoutTemplate: 'layout',
});

Router.route('/', {name: 'mainPage'});

Router.route('/submit',{name: 'postSubmit'});

Router.route('/post',{name: 'post'});

Router.route('/redirect',{name: 'redirect'});