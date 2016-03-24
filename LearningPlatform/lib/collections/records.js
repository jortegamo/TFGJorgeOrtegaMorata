Records = new Mongo.Collection ('records');

Meteor.methods ({
	insertRecord: function(record){
		var id = Records.insert(record);
		if (record.channel_id){
			Meteor.call('incrementChannelRecord',record.channel_id);
		}
		if(record.lesson_id){
			Meteor.call('incrementSectionRecord',record.section_id);
		}
		return {_id: id};
	},
	incrementRecordComment: function(record_id){
		Records.update(record_id,{$inc: {comments_count: 1}});
	},
	changeTrackOrder: function(object){
		var toUpRecord,toDownRecord;
		var currentRecord = Records.findOne({_id: object.record_id});
		switch(object.mode){
			case 'up':
				toUpRecord = currentRecord;
				toDownRecord = Records.findOne({section_id: object.section_id, order: object.order -1});
				break;
			case 'down':
				toUpRecord = Records.findOne({section_id: object.section_id, order: object.order + 1});
				toDownRecord = currentRecord;
				break;
		}

		Records.update(toUpRecord._id,{$inc: {order: -1}},function(err,res){
			if(res){
				Records.update(toDownRecord._id,{$inc: {order: 1}});
			}
		});
	}
});