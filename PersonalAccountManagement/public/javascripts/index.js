$(function () {
  $('#btn-auth-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/auth',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });
  
  $('#btn-user-info').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/user_info',
      method: 'get',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });

  $('#btn-lossid-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/loss_id',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });

  $('#btn-fogotpsw-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/forgot_psw',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });

  $('#btn-recharge-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/recharge',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });

  $('#btn-logout-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/logout',
      method: 'get',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });

  $('#btn-regi-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/register',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });

  $('#btn-update-submit').click(function (e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/update_acc_info',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  });
  $('#btn-findpsw-submit').click(function(e) {
    $frm = $(this).parents('form');
    $.ajax({
      url: '/api/reset_psw_from_email',
      method: 'post',
      data: $frm.serialize(),
      success: function(res) {
        $('#res').val(JSON.stringify(res));
      },
      error: function(e) {
        console.error(e);
      }
    });
  })
})