DocumentsByRC = new Mongo.Collection ('documentsByRC');

Meteor.methods({
	insertDocs: function(arrayDocs,record_id,start){
		console.log('me han llamado a inserDocs');
		_(arrayDocs).each(function(doc){
			var docObj = {
				record: record_id,
				start: start,
				doc: doc
			}
			console.log('un documento a guardar');
			var id = DocumentsByRC.insert(docObj);
		});
	}
})