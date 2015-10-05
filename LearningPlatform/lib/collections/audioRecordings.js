AudioRecordings = new Mongo.Collection('audioRecordings');

Meteor.methods({
   insertAudioRecording: function(audioRecording){
       AudioRecordings.insert(audioRecording);
   }
});