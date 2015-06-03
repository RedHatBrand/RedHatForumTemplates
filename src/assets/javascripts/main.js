$(document).ready(function () {
  $("#call-to-action").click(function() {
    $('html, body').animate({
        scrollTop: $("#form-section").offset().top
    }, 1000);
  });
});
