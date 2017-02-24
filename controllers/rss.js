const moment = require('moment')
const rssFeed = require('../models/rssFeed')
const rss = require('../models/rss')
const category = require('../models/category')

const URL_LENGTH = 60
const RSS_LIMIT = 40

const CATEGORY_LIMIT = 10
const CATEGORY_OFFSET = 0
var CATEGORY_ARRAY = [/*1, 2, 3, 4, 5, 6, 7, 8*/]
var CATEGORY_MAP = {}
category.readAll(CATEGORY_LIMIT, CATEGORY_OFFSET).then(function(categoryResult){
  categoryResult.rows.forEach(function(categoryItem){
    CATEGORY_MAP[categoryItem.id] = categoryItem.name
    CATEGORY_ARRAY.push(categoryItem.id)
  })
})

const getTimeAgo = date => (
  moment(date).fromNow()
)

const getTrimRssurl = rssfeedurl => (
  rssfeedurl.length > URL_LENGTH
  ? rssfeedurl.substring(0, URL_LENGTH - 3) + '...'
  : rssfeedurl
)

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
      rssFeed.readByRssId(req.params.rssId, RSS_LIMIT).then(function(result){
        result.rows.forEach( item => {
          // console.log('item', item)
          const re = /[' /]+$/
          const trimThumbnailString = getTrimThumbnail(item.thumbnail)

          item.timeago = getTimeAgo(item.releasedate)
          item.trimRssurl = getTrimRssurl(item.rssfeedurl)
          item.trimThumbnail = trimThumbnailString.replace(re, '')
        })
        // console.log('result.rows', result.rows)
        res.render('rss', {
          categoryName: categoryResult.rows[0].name,
          rssName: rssResult.rows[0].rssname,
          categoryId: req.params.categoryId,
          rssId: req.params.rssId,
          categoryArray: CATEGORY_ARRAY,
          categoryMap: CATEGORY_MAP,
          result: result.rows,
        })
      })
    })
  })
}
