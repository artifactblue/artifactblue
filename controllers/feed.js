const moment = require('moment')
const rssFeed = require('../models/rssFeed')
const rss = require('../models/rss')
const category = require('../models/category')

// crawer feed page
const MetaInspector = require('node-metainspector')

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

const getFeedImages = (feedUrl) => {
  const client = new MetaInspector(feedUrl, { timeout: 5000 })
  client.on('fetch', function(){
    const clientImages = client.images
    var Images = []
    for(var i = 0; i < clientImages.length ; i++ ) {
      Images.push(clientImages[i])
    }
    // console.log(Images)
    return Images
  })
  client.on('error', function(err){
    console.log(err)
  })
  client.fetch()
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
        var rssfeedDescription = rssfeedJSON.description
        const trimRssfeedDescription = rssfeedDescription.replace(reImg, '')


        var client = new MetaInspector(item.rssfeedurl, { timeout: 5000 })
        client.on('fetch', function(){
          const clientImages = client.images
          var Images = []
          for(var i = 0; i < clientImages.length ; i++ ) {
            Images.push(clientImages[i])
          }
          item.feedImages = Images
          res.render('feed', {
            categoryName: categoryResult.rows[0].name,
            rssName: rssResult.rows[0].rssname,
            categoryId: req.params.categoryId,
            rssId: req.params.rssId,
            rssfeedcontent: trimRssfeedDescription,
            item,
          })
        })
        client.on('error', function(err){
          console.log(err)
        })
        client.fetch()

        // var imagesArray = []
        // const feedImages = getFeedImages(item.rssfeedurl)
        // // for(var i = 0; i < feedImages.length ; i++ ) {
        // //   imagesArray.push(feedImages[i])
        // // }
        // console.log('test', feedImages)
        // item.feedImages = imagesArray

      })
    })
  })
}
