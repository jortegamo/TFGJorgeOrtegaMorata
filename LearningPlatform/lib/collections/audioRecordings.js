AudioRecordings = new Mongo.Collection('audioRecordings');

var audioStorageRC = new FS.Store.GridFS('audioStorageRC');
AudioRCData = new FS.Collection ('audioRCData',{
    stores: [audioStorageRC]
});

Meteor.methods({
   insertAudioRecording: function(audioRecording){
       AudioRecordings.insert(audioRecording);
   }
});