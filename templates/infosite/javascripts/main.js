$(function() {
  var body            = $("body");
  var nav             = $(".nav");
  var hero            = $(".hero");

  var BREAKPOINTS;

  updateBreakpoints = function() { 
    var heroHeight             = hero.height();
    var agendaTop              = sectionTop($(".section-agenda"));

    BREAKPOINTS = [heroHeight, heroHeight];

    $("ul.nav-list li").each(function() {
      if ($("ul.nav-list li").index(this) != 0){
        console.log(".section-"+$(this).data("slug"));
        var sectionItem = ".section-"+$(this).data("slug");
        var sectionItemTop = sectionTop(sectionItem);

        BREAKPOINTS.push(sectionItemTop);
      }
    });
  }

  updateBreakpoints();

  $(window).bind('resize', updateBreakpoints);

  $(window).scroll(function (e) {
    var scroll = $(window).scrollTop();

    updateNavPosition();
    updateNavActiveItem();

    function updateNavPosition() {

      if (scroll >= hero.height()) {
        nav.addClass("sticky-nav");
        body.css({ "margin-top": nav.height() });
      } else {
        nav.removeClass("sticky-nav");
        body.css({ "margin": 0 });
      }
    }

    function updateNavActiveItem() {

      if (scroll < BREAKPOINTS[0]) {
        $("ul.nav-list li").removeClass("active");
        return;
      }

      for (var i = BREAKPOINTS.length - 1; i >= 0; i--) {
        var y = BREAKPOINTS[i];

        if (scroll >= y) {
          $("ul.nav-list li").removeClass("active");
          $("ul.nav-list li:nth-child(" + i + ")").addClass("active");

          if (i == 1) { $(".agenda-session").addClass("animated fadeInUp"); }

          return;
        }
      };
    }
  });

  $("ul.nav-list li a").click(function(e) {
    e.preventDefault();

    i = $("ul.nav-list li a").index(this);
    var y = BREAKPOINTS[i + 1]
    body.animate({ scrollTop: y }, 1000);
  });

  function sectionTop(section) {
    var trueTop         = $(section).position().top;

    return trueTop - nav.height();
  }

  if ($("[name='active-day']").length > 0) {
    (function selectFirstDay() {

      $(".agenda-container-session").css({"display":"none"});
      $(".agenda-container-session#agenda-session-"+$("[name='active-day']").first().attr('id')).css({"display":"block"});
      return $("[name='active-day']").first().attr('checked', 'checked');
    })();
  }

  $(".agenda-input-day[type='radio']").click(function() {
    $(".agenda-container-session").css({"display":"none"});
    $(".agenda-container-session#agenda-session-"+$(this).attr('id')).css({"display":"block"});
  });
});
