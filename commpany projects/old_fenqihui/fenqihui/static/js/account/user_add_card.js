"use strict";controllerFunc("userAddCard","userAddCardController",function(r,t,e){r.cardCorrect=!1,r.card="",r.prompt_text="",r.cardisName=!1,r.next=function(){var t=r.checkName();if(t||r.myPrompt(r.prompt_text),r.cardisName&&r.cardCorrect||r.myPrompt(r.prompt_text),r.cardCorrect){var e="bankCode="+r.card+"&name="+r.name,a=Encrypt(e,"333"),c="../../pages/account/user_bind_bank_card.html?"+a;$(".travel-card-samebg2").attr("href",c)}},r.myPrompt=function(t){e(function(){r.$apply(function(){r.pro_text="亲，"+t})},200),$("#layer").css("display","block"),$(".close_btn").click(function(){$("#layer").css("display","none")})},r.checkName=function(){var t=/^\d{16,19}$/;if(void 0==r.name||void 0==r.cardNum)return r.prompt_text="请输入",!1;if(0!=r.name.length)if(r.name.match(/^[\u4e00-\u9fa5]+$/)){if(r.cardisName=!0,r.card=r.cardNum.replace(/\s/g,""),t.test(r.card))return r.cardCorrect=!0,!0;r.prompt_text="卡号输入错误"}else r.prompt_text="请输入中文";else r.prompt_text="请输入"}});