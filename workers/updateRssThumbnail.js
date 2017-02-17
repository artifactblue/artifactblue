const rss = require('../models/rss')

rss.all().then(function(rssResult){
	rssResult.rows.forEach(function(rssResultData){
		rss.rssCopyImageFromFeed(rssResultData.id).then(function(result){
			console.log("RSS: " + rssResultData.id + ", Thumbnail UPDATED")
		})
	})
})