$(function() {
  var body           = $("body");

  var BREAKPOINTS = [200,400,600,800];

  $(window).scroll(function (event) {
    var scroll        = $(window).scrollTop();

    updateNavPosition();
    updateNavActiveItem();

    function updateNavPosition() {
      var heroHeight    = $(".hero").height();
      var nav           = $(".nav");

      if (scroll >= heroHeight) {
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
          return;
        }
      };
    }
  });

  $("ul.nav-list li a").click(function() {
    i = $("ul.nav-list li a").index(this);
    body.animate({ scrollTop: BREAKPOINTS[i + 1] }, 500);
  });
});
