var pool = require(__dirname + '/dbConnectionPool.js')

function ViewCount() {}

ViewCount.prototype.read = function(id) {
    return pool.query('SELECT * FROM ViewCount WHERE id = $1', [id])
}

ViewCount.prototype.create = function(entity) {
	if (!entity.rssId) {
		entity.rssId = 0;
	}
	if (!entity.rssFeedId) {
		entity.rssFeedId = 0;
	}
	return pool.query('INSERT INTO ViewCount (CategoryId, RssId, RssFeedId, Count) VALUES ($1, $2, $3, $4)',
		[entity.categoryId, entity.rssId, entity.rssFeedId, 0])
}

ViewCount.prototype.incr = function(entity) {
	if (!entity.rssId) {
		entity.rssId = 0;
	}
	if (!entity.rssFeedId) {
		entity.rssFeedId = 0;
	}
	return pool.query('UPDATE ViewCount SET count = count + 1 WHERE categoryId = $1 AND rssId = $2 AND $rssFeedId = $3',
		[entity.categoryId, entity.rssId, entity.rssFeedId])
}

exports = module.exports = new ViewCount()
