var pool = require(__dirname + '/dbConnectionPool.js')

function RssFeed() {}

RssFeed.prototype.read = function(id) {
    return pool.query('SELECT * FROM RssFeed WHERE id = $1', [id])
}

RssFeed.prototype.readAll = function(limit = 3, offset = 0) {
    return pool.query('SELECT * FROM RssFeed ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset)
}

RssFeed.prototype.readByRssId = function(rssId, limit = 3, offset = 0) {
	return pool.query('SELECT * FROM RssFeed WHERE rssId = $1 ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset, [rssId])
}

RssFeed.prototype.create = function(entity) {
	// TODO should check if exists
	return pool.query('INSERT INTO RssFeed (RssId, RssFeedTitle, RssFeedUrl, ReleaseDate, Thumbnail, RssFeedContent, CreateTimestamp) '
		+ ' SELECT $1, $2, $3, $4, $5, $6, now() WHERE NOT EXISTS '
		+ ' (SELECT 1 FROM RssFeed WHERE RssId = $7 AND RssFeedTitle = $8 AND RssFeedUrl = $9 AND RssFeedContent = $10)',
		[entity.rssId, entity.rssFeedTitle, entity.rssFeedUrl, entity.releaseDate, entity.thumbnail, entity.rssFeedContent, 
		entity.rssId, entity.rssFeedTitle, entity.rssFeedUrl, entity.rssFeedContent]);
}

RssFeed.prototype.update = function(entity) {

}

RssFeed.prototype.deleteAll = function() {
	return pool.query('DELETE FROM RssFeed')
}

RssFeed.prototype.delete = function(id) {
	return pool.query('DELETE FROM RssFeed WHERE id = $1', [id])
};

exports = module.exports = new RssFeed()
