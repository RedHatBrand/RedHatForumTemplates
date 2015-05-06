$(function() {
  $(window).scroll(function (event) {
    var scroll        = $(window).scrollTop();
    var heroHeight    = $(".hero").height();
    var nav           = $(".nav");

    if (scroll >= heroHeight) {
      nav.css({
        "position":"fixed",
        "top":"0"
      });
    } else {
      nav.css({
        "position":"initial"
      });
    }
  });
});
