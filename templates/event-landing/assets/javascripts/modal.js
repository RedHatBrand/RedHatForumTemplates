$(function modalToggle() {
    var $modalButton = $('.modal-open'),
        $modalClose  = $('.modal-close'),
        $modalSubmit = $('.modal-submit'),
        $modalCancel = $('.modal-cancel'),
        $modal       = $('.modal'),
        $overLay     = $('#modal-overlay');

    function openModal(e) {
      var target = $(this).data('target-modal');
      e.preventDefault();
      $overLay.addClass('open');
      $('#' + target).addClass('open');
      $('body').addClass("noscroll");
    }

    $(document).on('click', '.modal-open', openModal);

    function closeModal () {
      $modal.removeClass('open');
      $overLay.removeClass('open');
      $('body').removeClass("noscroll");
    }

    $(document).on('click', '.modal-close', closeModal);
    $(document).on('click', '.modal-cancel', closeModal);
    $(document).on('click', '.modal-submit', closeModal);
    $overLay.on('click', closeModal);

    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        closeModal();
      }
    });
  });
