// triggered after each item is loaded
function onProgress( imgLoad, image ) {
  // change class if the image is loaded or broken
  var $item = $( image.img ).parent();
  $item.removeClass('is-loading');
  if ( !image.isLoaded ) {
    $item.addClass('is-broken');
  }
};

$(document).ready(function() {
  var $container = $('.grid')
  $container.masonry({
    // options
    itemSelector: '.grid-item',
  });
  $container.imagesLoaded()
  .progress( onProgress )
});