var pool = require(__dirname + '/dbConnectionPool.js')

function Rss() {}

Rss.prototype.read = function(id) {
    return pool.query('SELECT * FROM rss WHERE id = $1', [id])
}

Rss.prototype.readAll = function(limit = 3, offset = 0) {
    return pool.query('SELECT * FROM rss ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset)
}

Rss.prototype.readByCategoryId = function(categoryId, limit = 3, offset = 0) {
	return pool.query('SELECT * FROM rss WHERE categoryId = $1 ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset, [parseInt(categoryId, 10)])
}

Rss.prototype.create = function(entity) {
	return pool.query('INSERT INTO rss (CategoryId, RssName, RssUrl, Thumbnail, Description, CreateTimestamp) '
		+ ' VALUES ($1, $2, $3, $4, $5, now())', 
		[entity.categoryId, entity.rssName, entity.rssUrl, entity.description, entity.thumbnail]);
}

Rss.prototype.refreshUpdateTime = function(rssId) {
	return pool.query('UPDATE rss SET lastUpdateTimestamp = now() WHERE rssId = $1', [rssId]);
}

Rss.prototype.updateRssImage = function(rssId, url) {
  return pool.query('UPDATE rss SET thumbnail = $1 WHERE id = $2', [url, rssId] )
}

Rss.prototype.rssCopyImageFromFeed = function(rssId, rssFeedId) {
	var rssFeedSQL = ""
	if (rssFeedId) {
		rssFeedSQL += rssFeedId
	} else {
		rssFeedSQL += ' (SELECT max(id) FROM rssfeed WHERE rssid = ' + rssId + ' AND status = TRUE GROUP BY rssid) '
	}
	return pool.query('UPDATE rss SET thumbnail = (SELECT thumbnail FROM rssfeed WHERE id = ' + rssFeedSQL + ' ) WHERE id = $1', 
		[rssId])
}

exports = module.exports = new Rss()
