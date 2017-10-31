"use strict";

function addSpace(BankNo) {
    if (BankNo.value == "") return;
    var account = new String(BankNo.value);
    account = account.substring(0, 23); /*帐号的总数, 包括空格在内 */
    if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
        /* 对照格式 */
        if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
            var accountNumeric = accountChar = "",
                i;
            for (i = 0; i < account.length; i++) {
                accountChar = account.substr(i, 1);
                if (!isNaN(accountChar) && accountChar != " ") accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for (i = 0; i < accountNumeric.length; i++) {
                /* 可将以下空格改为-,效果也不错 */
                if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
                if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
                if (i == 12) account = account + " "; /* 帐号第十二位后数后加空格 */
                if (i == 16) account = account + " ";
                if (i == 20) account = account + " ";
                account = account + accountNumeric.substr(i, 1);
            }
        }
    } else {
        account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) + "-" + account.substring(18, 25);
    }
    if (account != BankNo.value) BankNo.value = account;
}

function checkBankNo(BankNo) {
    if (BankNo.value == "") return;
    if (BankNo.value.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
        if (BankNo.value.match("[0-9]{19}") != null) addSpace(BankNo);
    }
}

function checkEnterForFindListing(e) {
    var characterCode;
    if (e && e.which) {
        e = e;
        characterCode = e.which;
    } else {
        e = event;
        characterCode = e.keyCode;
    }
    if (characterCode == 22) {
        document.forms[getNetuiTagName("findListingForm")].submit();
        return false;
    } else {
        return true;
    }
}