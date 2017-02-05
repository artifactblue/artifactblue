var category = require('../models/category');

category.readAll().then(function(result){
    console.log(result.rowCount);
})