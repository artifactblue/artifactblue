// RSS feed parser
const FeedParser = require('feedparser')
const request = require('request') // for fetching the feed

// const moment = require('moment')
// var util = require('util')

const rss = require('../models/rss')
const rssFeed = require('../models/rssFeed.js')

const DESCRIPTION_LENGTH = 60

const getRssFeeds = (rssInfo) => {
	// request rss link
  var req = request(rssInfo.rssurl)
  var feedparser = new FeedParser()
  var feedNumber = 0
  // var columns = []

  req.on('error', function (error) {
    // handle any request errors
  })

  req.on('response', function (res) {
    var stream = this // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'))
    }
    else {
      stream.pipe(feedparser)
    }
  })

  feedparser.on('error', function (error) {
    // always handle errors
  })

  feedparser.on('meta', function (meta) {
    console.log('===== %s =====', meta.title)
  })

  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this // `this` is `feedparser`, which is a stream
    var meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item, trimDescription
    let entity = {}

    while (item = stream.read()) {
      // console.log('Got article: %s', item.title || item.description)

      var description = item.description
      var imgUrl = 'http' + description.match(/:\/\/[^">]+/g)
      // remove html tag
      var clearDescription = description.replace(/<\/?[^>]+(>|$)/g, '')
      // substring by length
      if (clearDescription.length > DESCRIPTION_LENGTH) {
        trimDescription = clearDescription.substring(0, DESCRIPTION_LENGTH - 3) + '...'
      } else {
        trimDescription = clearDescription
      }

      var feedLink = item.link
      feedLink = feedLink.replace(/^http:\/\//i, 'https://')
      // console.log('Got clearDescription: %s', trimDescription)
      // Write feeds to DB
      if (imgUrl == 'httpnull') {
        imgUrl = 'https://i.imgur.com/l6rRHkX.jpg'
      }
      entity = {
        'rssId': rssInfo.id,
        'rssFeedTitle': item.title,
        'rssFeedUrl': item.link,
        'releaseDate': item.date,
        'thumbnail': imgUrl,
        'rssFeedContent': item,
        'description': clearDescription
      }
      rssFeed.create(entity).then( () => {
        console.log(entity.rssFeedTitle + ' insert success')
        // refresh lastUpdateTimestamp on RSS table
        rss.refreshUpdateTime(rssInfo.id).then( () => {
          console.log(rssInfo.id + ' update success')
        }).catch(function(err){
          console.log(rssInfo.id, err.message)
        })
      })
      // console.log('@@@@@@@@', entity)
      feedNumber++
    }
  })
}

const RSS_LIMIT = 100
const RSS_OFFSET = 0
const URL_LENGTH = 60

const getRssArray = () => {
  rss.readAll(RSS_LIMIT, RSS_OFFSET).then(
    result => {
      result.rows.forEach( rssInfo => {
        // console.log('item~~~~~~', rssInfo)
        getRssFeeds(rssInfo)
      })
    }
  )
}

const rssUrl = 'http://feeds.feedburner.com/engadget/cstb'


getRssArray()
// const columns = getRssFeeds(rssUrl, FEED_LIMIT, FEED_OFFSET)
// getRssFeeds(rssUrl, FEED_LIMIT, FEED_OFFSET)

// console.log('columns!!!!!', util.inspect(columns, false, null))
