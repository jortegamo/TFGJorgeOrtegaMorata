Teams = new Mongo.Collection ('teams');

Meteor.methods ({
    insertTeam: function(team){
        var id = Teams.insert(team);
        return {_id: id};
    }
})