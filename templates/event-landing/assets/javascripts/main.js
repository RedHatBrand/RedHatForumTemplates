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

  function initCountdown (date, lang) {
    var parsedDate = moment(date, [
        'D/M/YYYY',
        'D/M/YY',
        'D MMMM YYYY',
        'D MMMM YY',
        'D MMM YYYY',
        'D MMM YY',
        'MMMM D YYYY',
        'MMMM D YY',
        'MMM D YYYY',
        'MMM D YY'
    ])
    var now = parseInt(Date.now() / 1000)

    if (!parsedDate.isValid()) { return }

    var timeUntil = parsedDate.format('X') - now

    if (timeUntil < 0) { return }

    $('#countdown').FlipClock(timeUntil, {
      clockFace: 'DailyCounter',
      clockFaceOptions: {
        autoPlay: false,
        countdown: true,
        language: lang
      },
    })
  }

  var date = countdownSettings.date
  var lang = countdownSettings.lang

  if (date) {
    initCountdown(date, lang)
  }
});
