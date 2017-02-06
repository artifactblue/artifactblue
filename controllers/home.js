var category = require('../models/category');
var rssFeed = require('../models/rssFeed');
var rss = require('../models/rss');

category.readAll().then(function(result){
    // console.log('!!!', result.rowCount);
})

rssFeed.readAll().then(function(result){
    // console.log('???', result);
})


/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {

  rss.readAll(20, 3).then(function(result){
    console.log('+++', result)
    res.render('home', {
      title: 'Welcome to Artifactblue',
      data: [1, 2, 3, 4],
      result: result.rows,
    })
  })
}
