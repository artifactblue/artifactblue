const moment = require('moment')

const category = require('../models/category')
// const rssFeed = require('../models/rssFeed')
const rss = require('../models/rss')

const CATEGORY_LIMIT = 10
const CATEGORY_OFFSET = 0
const CATEGORY_ARRAY = [/*1, 2, 3, 4, 5, 6, 7, 8*/]
var CATEGORY_MAP = {
  // 1: '資訊',
  // 2: '正妹',
  // 3: '生活',
  // 4: '研究',
  // 5: '資源',
  // 6: 'iphoneapp',
  // 7: '新聞',
  // 8: '其他議題',
}

category.readAll(CATEGORY_LIMIT, CATEGORY_OFFSET).then(function(categoryResult){
  categoryResult.rows.forEach(function(categoryItem){
    CATEGORY_MAP[categoryItem.id] = categoryItem.name
    CATEGORY_ARRAY.push(categoryItem.id)
  })
})

const RSS_LIMIT = 100
const RSS_OFFSET = 0

// rssFeed.readAll().then(
//   function(result){
//     // console.log('???', result)
// })

// category.readAll(
//   CATEGORY_LIMIT,
//   CATEGORY_OFFSET
//   ).then(
//     result => {
//       // console.log('!!!', result.rows)
//       result.rows.forEach( item => {

//       })
//     }
//   )

const URL_LENGTH = 60

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {

  rss.readAll(RSS_LIMIT, RSS_OFFSET).then(
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
      res.render('home', {
        title: 'Welcome to Artifactblue',
        categoryArray: CATEGORY_ARRAY,
        categoryMap: CATEGORY_MAP,
        result: result.rows,
      })
    }
  )
}
