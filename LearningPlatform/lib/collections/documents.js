Documents = new Mongo.Collection ('documents');

Meteor.methods({
	insertDocs: function(arrayDocs,record_id,start){
		_(arrayDocs).each(function(doc){
			var docObj = {
				record: record_id,
				start: start,
				doc: doc
			};
			Documents.insert(docObj);
		});
	}
})