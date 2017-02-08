const moment = require('moment')
const rssFeed = require('../models/rssFeed')

const URL_LENGTH = 60
const RSS_LIMIT = 40
/**
 * GET /
 * RSS feeds page.
 */
exports.index = (req, res) => {
  // console.log('????', req.params.rssFeedId)
  rssFeed.readByRssId(req.params.rssFeedId, RSS_LIMIT).then(function(result){
    // console.log('result', result)
    result.rows.forEach( item => {
      // console.log('item', item)
      item.timeago = moment(item.releasedate).fromNow()
      if (item.rssfeedurl.length > URL_LENGTH) {
        item.trimRssurl = item.rssfeedurl.substring(0, URL_LENGTH - 3) + '...'
      } else {
        item.trimRssurl = item.rssfeedurl
      }
      let thumbnailString = item.thumbnail
      if(thumbnailString && thumbnailString.indexOf(',')>=0 ) {
        let thumbnailSplit = thumbnailString.split(',')
        item.trimThumbnail = thumbnailSplit[0]
      } else {
        item.trimThumbnail = thumbnailString
      }
      item.trimThumbnail = item.trimThumbnail.replace(/[' /]+$/,'')
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
