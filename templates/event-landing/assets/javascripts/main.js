$(function () {
  $('a.menu-link').on('click', function() {
    var target;
    unburger()
    $('.mobilenav').removeClass('menu-show');
    $('.nav-toggle').removeClass('active');
    $('.nav-menu li').removeClass('active');
    $(this).closest('li').addClass('active');
    target = $(this).attr('href');
    $.smoothScroll({
      scrollTarget: target,
      offset: -60
    });
    return false;
  });

  // HAMBURGLERv2

  $('.icon').click(function () {
    $('.mobilenav').toggleClass('menu-show');
    $('.top-menu').toggleClass('top-animate');
    $('body').toggleClass('noscroll');
    $('.mid-menu').toggleClass('mid-animate');
    $('.bottom-menu').toggleClass('bottom-animate');
  });

  // PUSH ESC KEY TO EXIT
  //
  function unburger () {
    $('.mobilenav').removeClass('menu-show');
    $('.top-menu').removeClass('top-animate');
    $('body').removeClass('noscroll');
    $('.mid-menu').removeClass('mid-animate');
    $('.bottom-menu').removeClass('bottom-animate');
  }

  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      unburger()
    }
  });
});
