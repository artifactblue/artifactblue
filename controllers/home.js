const moment = require('moment')

const category = require('../models/category')
const rssFeed = require('../models/rssFeed')
const rss = require('../models/rss')

category.readAll().then(function(result){
    // console.log('!!!', result.rowCount)
})

rssFeed.readAll().then(function(result){
    // console.log('???', result)
})

const URL_LENGTH = 60

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  rss.readAll(20, 3).then(function(result){
    result.rows.forEach(function(item) {
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
      data: [1, 2, 3, 4],
      result: result.rows,
    })
  })
}
