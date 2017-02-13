const moment = require('moment')
const rssFeed = require('../models/rssFeed')
const rss = require('../models/rss')
const category = require('../models/category')

const URL_LENGTH = 60
// const RSS_LIMIT = 40

const getTimeAgo = date => (
  moment(date).fromNow()
)

const getTrimRssurl = rssfeedurl => {
  if(rssfeedurl.length > URL_LENGTH) {
    return rssfeedurl.substring(0, URL_LENGTH - 3) + '...'
  }
  return rssfeedurl
}

const getTrimThumbnail = thumbnail => {
  if(thumbnail && thumbnail.indexOf(',')>=0 ) {
    const thumbnailSplit = thumbnail.split(',')
    return thumbnailSplit[0]
  }
  return thumbnail
}

/**
 * GET /
 * RSS feeds page.
 */
exports.index = (req, res) => {
  category.read(req.params.categoryId).then(function(categoryResult){
    rss.read(req.params.rssId).then(function(rssResult){
      rssFeed.read(req.params.feedId).then(function(result){
        let item = result.rows[0]
        // console.log('result', result)
        const re = /[' /]+$/
        const trimThumbnailString = getTrimThumbnail(item.thumbnail)

        item.timeago = getTimeAgo(item.releasedate)
        item.trimRssurl = getTrimRssurl(item.rssfeedurl)
        item.trimThumbnail = trimThumbnailString.replace(re, '')

        const reImg = '/' + item.trimThumbnail + '/'
        const rssfeedJSON = JSON.parse(item.rssfeedcontent)
        const rssfeedDescription = rssfeedJSON.description
        const trimRssfeedDescription = rssfeedDescription.replace(reImg, '')

        res.render('feed', {
          categoryName: categoryResult.rows[0].name,
          rssName: rssResult.rows[0].rssname,
          categoryId: req.params.categoryId,
          rssId: req.params.rssId,
          rssfeedcontent: trimRssfeedDescription,
          item,
        })
      })
    })
  })
}
