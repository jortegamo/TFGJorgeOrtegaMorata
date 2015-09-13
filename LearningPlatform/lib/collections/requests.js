Requests = new Mongo.Collection('requests');

Meteor.methods({
    insertRequest: function(request){
        return Requests.insert(request);
    },
    acceptRequest: function(request){
        Requests.update(request._id,{$set: {status: 'accepted'}});
        var relation = {users: [request.requested.id, request.applicant.id], createAt: new Date()};
        return Relations.insert(relation);
    },
    refuseRequest: function(request){
        request.requested.deleted = true;
        request.status = 'refused';
        return Requests.update(request._id,request);
    },
    checkRequest: function(request,user_id){
        var userChecked = (request.requested.id === user_id)? request.requested : request.applicant;
        userChecked.deleted = true;

        if (request.requested.deleted && request.applicant.deleted){
            Requests.remove(request._id);
        }else{
            Requests.update(request._id, request);
        }
    },
    resendRequest: function(request){
        request.requested.deleted = false;
        request.status = 'pending';
        return Requests.update(request._id,request);
    }
});