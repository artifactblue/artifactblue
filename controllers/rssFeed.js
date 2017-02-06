// var category = require('../models/category');
// var rssFeed = require('../models/rssFeed');
// var rss = require('../models/rss');

// category.readAll().then(function(result){
//     // console.log('!!!', result.rowCount);
// })

// rssFeed.readAll().then(function(result){
//     console.log('???', result);
// })

// rss.readAll(2, 3, 0).then(function(result){
//     // console.log('+++', result);
// })
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('rssFeed', {
    title: 'rssFeed',
    categoryId: req.params.categoryId,
    rssFeedId: req.params.rssFeedId,
  });
};
