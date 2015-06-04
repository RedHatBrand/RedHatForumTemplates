$(function () {
  $('a.menu-link').on('click', function() {
    var target;
    unburger()
    $('.mobilenav').removeClass('menu-show');
    $('.nav-toggle').removeClass('active');
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

  function initCountdown (date) {
    var timeUntil = moment(date, ['D/M/YY', 'D/M/YYYY', 'D MMM YY', 'D MMM YYYY', 'MMM D YY', 'MMMM D YY']).format('X') - parseInt(Date.now() / 1000)

    $('#countdown').FlipClock(timeUntil, {
      clockFace: 'DailyCounter',
      clockFaceOptions: {
        autoPlay: false
      },
      countdown: true
    })
  }

  var date = countdownSettings.date

  if (date) {
    initCountdown(date)
  }
});
