var notificationsCreator = function(){

    //esto se hara directamente y se pasara como parametro en la entrada del metodo principal.
    var createBaseNotification = function(params){
        var obj = {
            to: params.to,
            createdAt: params.createdAt,
            from: params.from,
            parentContext_id: params.parentContext_id,
            urlParameters: params.urlParameters,
            type: params.type
        };
        return obj;
    };

    var createMessageRecord = function(){
        var message;
        switch(params.action){
            case 'newComment':
                message = 'has written a comment to your record';
                break;
            case 'replyComment':
                message = 'has written a reply for your comment';
            case 'like':
                message = 'likes your record';
                break;
            case 'removeLike':
                message = 'now does not like your record';
                break;
            case 'reply':
                message = 'has created a reply for your record';
                break;
        }
        return message;

    };
    var createMessageChannel = function(params){
        var message;
        switch(params.action){
            case 'newCommentChannel':
                message = 'has written a comment to your channel'
                break;
            case 'replyCommentChannel':
                message = 'has written a reply for your comment';
                break;
            case 'newCommentRecord':
                message = 'has written a comment for your record <span>' + params.context.title + '</span>'
                break;
            case 'replyCommentRecord':
                message = 'has writen a reply for your comment at the record <span>' + parent.context.title + '</span';
                break;
            case 'likeChannel':
                message = 'likes your channel';
                break;
            case 'removeLikeChannel':
                message = 'now does not like your channel';
                break;
            case 'likeRecord':
                message = 'likes your record <span>' + params.context.title + '</span>';
                break;
            case 'subscription':
                message = 'has been subscribed to your channel';
                break;
            case 'cancelSubscription':
                message = 'has canceled subscription to your channel';
                break;
            case 'newRecord':
                message = 'has created a new record <span>' + params.new.title + '</span>';
                break;
            case 'reply':
                message = 'has created a reply <span>' + params.new.title + '</span> for the record <span>' + params.new.parent.title+ '</span>'
                break;
        }
        return message;
    };

    var createMessageLesson = function(params){
        var message;
        switch(params.action){
            case 'newCommentLesson': //to lesson's creator.
                message = 'has written a comment to your lesson';
                break;
            case 'replyCommentLesson': //to lesson's creator.
                message = 'has written a reply for your comment';
                break;
            case 'newCommentRecord': //to lesson's creator.
                message = 'has written a comment for your record <span>' + params.context.title + '</span>';
                break;
            case 'replyCommentRecord': //to comment's creator.
                message = 'has writen a reply for your comment at the record <span>' + params.context.title + '</span';
                break;
            case 'likeLesson': //to lesson's creator.
                message = 'likes your lesson';
                break;
            case 'removeLikeLesson':
                message = 'now does not like your lesson';
                break;
            case 'likeRecord': //to lesson's creator.
                message = 'likes your record <span>' + params.context.title + '</span>';
                break;
            case 'removeLikeRecord':
                message = 'now does not like your record <span>' + params.context.title + '</span>';
                break;
            case 'subscription': //to lesson's creator.
                message = 'has been enrolled to your lesson';
                break;
            case 'cancelSubscription':
                message = 'has canceled subscription to your lesson';
                break;
            case 'newSection': //to enrolled users.
                message = 'has been created a new section <span>' + params.new.title + '</span>'
                break;
            case 'newRecord': //to enrolled users.
                message = 'exists a new record <span>' + params.new.title + '</span>';
                break;
            case 'reply': //to enrolled users.
                message = 'has been created a reply <span>' + params.new.title + '</span> for the record <span>' + params.new.parent.title+ '</span>'
                break;
        }
        return message;
    };

    var createMessageContact = function(params){
        var message;
        switch (params.action){
            case 'receivedRequest': //to requested
                message = 'wants to add you as a contact';
                break;
            case 'refusedRequest': //to applicant
                message = 'has refused your request';
                break;
            case 'acceptedRequest': //to applicant
                message = 'has accepted your request. Has been added to your contacts';
                break;
            case 'added': //to requested
                message = 'has been added to your contacts';
        }
        return message;
    };

    var createMessageConversation = function(params) {
        var message;
        switch (params.action) {
            case 'created': //to members conversation.
                message = 'has created a new conversation and you have been added!';
                break;
            case 'removed': //to member conversation.
                message = 'you have been removed from this conversation';
                break;
            case 'exit': //to memeber conversation.
                message = 'you have left the conversation';
                break;
        }
        return message;
    };

    this.createNotification = function(params,callback){
        var notificationObj = createBaseNotification(params);
        //notification message
        var message;
        switch(params.type){
            case 'record':
                message = createMessageRecord(params);
                break;
            case 'channel':
                message = createMessageChannel(params);
                break;
            case 'lesson':
                message = createMessageLesson(params);
                break;
            case 'contact':
                message = createMessageContact(params);
                break;
            case 'conversation':
                 message = createMessageConversation();
                break;
        }
        notificationObj.message = message;

        //notification saving process.
        Meteor.call('insertNotification',notificationObj,callback);
    };
};

NotificationsCreator = new notificationsCreator();