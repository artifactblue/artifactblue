const moment = require('moment')
const rss = require('../models/rss')
const category = require('../models/category')

const RSS_LIMIT = 40
const RSS_OFFSET = 0
const URL_LENGTH = 60

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

/**
 * GET /i/categoryId/
 * category page.
 */
exports.index = (req, res) => {
  category.read(req.params.categoryId).then(
	categoryResult => {
  let categoryResultData = categoryResult.rows[0]
  rss.readByCategoryId(req.params.categoryId, RSS_LIMIT, RSS_OFFSET).then(
    result => {
      result.rows.forEach( item => {
        // console.log('item', item)
        // change time format
        item.timeago = moment(item.createtimestamp).fromNow()
        if (item.rssurl.length > URL_LENGTH) {
          item.trimRssurl = item.rssurl.substring(0, URL_LENGTH - 3) + '...'
        } else {
          item.trimRssurl = item.rssurl
        }
      })
      res.render('category', {
        categoryName: categoryResultData.name,
        categoryId: req.params.categoryId,
        categoryArray: CATEGORY_ARRAY,
        categoryMap: CATEGORY_MAP,
        result: result.rows,
      })
    })
})
}
