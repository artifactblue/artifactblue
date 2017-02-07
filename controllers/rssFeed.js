const moment = require('moment')
const rssFeed = require('../models/rssFeed')

const URL_LENGTH = 60
/**
 * GET /
 * RSS feeds page.
 */
exports.index = (req, res) => {
  // console.log('????', req.params.rssFeedId)
  rssFeed.read(req.params.rssFeedId).then(function(result){
    // console.log('result', result)
    result.rows.forEach( item => {
      // console.log('item', item)
      item.timeago = moment(item.createtimestamp).fromNow()
      if (item.rssurl.length > URL_LENGTH) {
        item.trimRssurl = item.rssurl.substring(0, URL_LENGTH - 3) + '...'
      } else {
        item.trimRssurl = item.rssurl
      }
    })
    // console.log('result.rows', result.rows)
    res.render('rssFeed', {
      title: 'rssFeed',
      categoryId: req.params.categoryId,
      rssFeedId: req.params.rssFeedId,
      result: result.rows,
    })
  })
}
