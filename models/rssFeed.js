var pool = require(__dirname + '/dbConnectionPool.js')

function RssFeed() {}

RssFeed.prototype.read = function(id) {
    return pool.query('SELECT * FROM RssFeed WHERE id = $1', [id])
}

RssFeed.prototype.readAll = function(limit = 3, offset = 0) {
    return pool.query('SELECT * FROM RssFeed ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset)
}

RssFeed.prototype.create = function(entity) {
	// TODO should check if exists
	return pool.query('INSERT INTO RssFeed (RssId, RssFeedTitle, RssFeedUrl, ReleaseDate, Thumbnail, RssFeedContent, CreateTimestamp) '
		+ ' VALUES ($1, $2, $3, $4, $5, $6, now())',
		[entity.rssId, entity.rssFeedTitle, entity.rssFeedUrl, entity.releaseDate, entity.thumbnail, entity.rssFeedContent]);
}

RssFeed.prototype.update = function(entity) {

}

RssFeed.prototype.delete = function(id) {
	return pool.query('DELETE FROM RssFeed WHERE id = $1', [id])
};

exports = module.exports = new RssFeed()
