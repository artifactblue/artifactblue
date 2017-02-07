var rssFeed = require('../models/rssFeed.js');

var entity = {
	"rssId": 1,
	"rssFeedTitle": "test",
	"rssFeedUrl": "http://www.google.com",
	"releaseDate": "2017-02-06",
	"thumbnail": "",
	"rssFeedContent": "hi"
}
rssFeed.create(entity).then(function(result){
	console.log("insert success")
});
