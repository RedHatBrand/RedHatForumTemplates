$(function() {
  $(".main").fitVids();

  $('.nav-toggle').on('click', function() {
    $(this).toggleClass('active');
    $('.nav-menu').toggleClass('nav-hide');
  });

  $('a.menu-link').on('click', function() {
    var target;
    $('.nav-menu').addClass('nav-hide');
    $('.nav-toggle').removeClass('active');
    $('.menu-link').removeClass('active');
    $(this).addClass('active');
    target = $(this).attr('href');
    $.smoothScroll({
      offset: -50,
      scrollTarget: target
    });
    return false;
  });

  function scaleHero() {
    if (document.getElementById('heroImage').height > window.innerHeight) {
      return fullHeight('.hero');
    }
  }

  function fullHeight(elem) {
    if (!$(elem).get(0)) {
      return;
    } else {
      $(elem).css('height', 'auto');
      if ($(elem).outerHeight() < window.innerHeight) {
        return $(elem).outerHeight(Math.ceil(window.innerHeight));
      }
    }
  }

  if ($("[name='active-day']").length > 0) {
    (function selectFirstDay() {
      return $("[name='active-day']").first().attr('checked', 'checked');
    })();
  }

  (function countDays() {
    return $(".section-agenda").addClass("agenda-" + ($("[name='active-day']").length));
  })();

  (function initAgenda () {
    var $radios = $('#agenda input[type="radio"]');
    var $labels = $('#agenda input[type="radio"] + label');
    var $timeTables = $('.js-agenda-day');

    $radios.each(function (index, radio) {
      $(radio).attr('id', 'day-' + index);
    });

    $labels.each(function (index, label) {
      $(label).attr('for', 'day-' + index);
    });

    $timeTables.each(function (index, table) {
      $(table).addClass('agenda-day-' + index);
    });
  })();
});
