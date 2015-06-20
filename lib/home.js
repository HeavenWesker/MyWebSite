$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    loadMorePosts();
  }
});
