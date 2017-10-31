var flag = true;
var paid_type = localStorage.getItem('paid_type');
var data = {};
  var payObj = {
    id: "",
    rId: "",
    init: function () {
      this.initData();
    },
    //初始化数据
    initData: function () {
      var that = this;
      if(paid_type == 1) {
        that.id = localStorage.getItem('id');
        data = {
          'paidType': 1,
          'rid': that.id
        }
      } else {
        that.rId = localStorage.getItem('rId');
        data = {
          'paidType': paid_type,
          'rId': that.rId
        }
      }
    },

    //支付成功
    promptSuccess: function () {
      var that = this;
      $('.success_close').click(function() {
        $('.layer').css('display', 'none');
        if(flag) {
          that.successNavive();
          flag = false;
        }
      });
    },
    //支付失败
    promptFail: function () {
      var that = this;
      $('.fail_close').click(function() {
        $('.layer').css('display', 'none');
        if(flag) {
          that.failNavive();
          flag = false;
        }
      });
    },

    failNavive: function () {
      var naviveType = getTypeNative();
      if(naviveType == 'ios') {
        payBackToAccount();

      } else if(naviveType == 'android') {
        android.backAccount();
      } else {
        go_page('../travel/tracel_myStages.html');
      }

      flag = true;
    },
    successNavive: function () {
      $.ajax({
        type: "POST",
        url: BaseUrl + 'fqhrepaymentlog/saveFqhRepaymentPlanLog',
        data: data,
        success: function(res) {
          if(res.result == SUCCESS_CODE) {
            go_page('../travel/tracel_myStages.html');
          }
        },
        error: function() {
          alert("网络异常");
          console.error('网络异常');
        }
      })
      flag = true;
    }
  };
$(function() {
  payObj.init();
})