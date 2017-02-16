const MetaInspector = require('node-metainspector')

const moment = require('moment')
const rss = require('../models/rss')
const url = require('url')

const CATEGORY_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8]
const CATEGORY_MAP = {
  1: '資訊',
  2: '正妹',
  3: '生活',
  4: '研究',
  5: '資源',
  6: 'iphoneapp',
  7: '新聞',
  8: '其他議題',
}

const RSS_LIMIT = 200
const RSS_OFFSET = 0

const URL_LENGTH = 60

rss.readAll(RSS_LIMIT, RSS_OFFSET).then(
  result => {
    result.rows.forEach( item => {
      // console.log('item.id', item.id)
      const rssUrl = url.parse(item.rssurl).hostname
      const client = new MetaInspector(rssUrl, { timeout: 5000 })
      // client.prototype.itemId = item.id
      client.on('fetch', function(){
        // console.log('Description: ' + client.description)
        if(client.image === undefined) {
          // console.log('---Image:' + client.images[0])
          if(client.images[0] !== undefined) {
            var imageUrl = client.images[3]
          }
        } else {
          var imageUrl = client.image
          // console.log('ogImage: ' + client.image)
        }
        if(imageUrl !== undefined) {
          console.log(item.id, imageUrl)
          rss.updateRssImage(item.id, imageUrl).then( () => {
            console.log(item.id + 'updated success')
          })
        }

        // const imageLinks = client.images
        // for(var i = 0; i < imageLinks.length ; i++ ) {
        //   console.log(imageLinks[i])
        // }

          // console.log("Links: " + client.links);
      })

      client.on('error', function(err){
        console.log(err)
      })
      setTimeout(function() { client.fetch() }, 100)
    })
  }
)





