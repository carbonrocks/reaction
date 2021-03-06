"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const shopUser = require("../../../../lib/user-shop-actions.js");
const userDo = require("../../../../lib/basic-user-actions.js");
const adminUser = require("../../../../lib/admin-order-actions.js");
const getTestConfig = require("../../../../lib/get-test-config.js");

beforeEach(function () {
  getTestConfig.init();
});


describe("paypal refund test", function () {
  const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
  it("verify user can refund with paypal", function () {
    userDo.UserActions.userLogin("admin");
    browser.pause("5000");
    userDo.UserActions.refreshShop();
    browser.click(eleMap.product);
    browser.waitForEnabled(eleMap.red_option, 5000);
    browser.click(eleMap.red_option);
    browser.waitForEnabled(eleMap.add_to_cart_logged_in, 5000);
    browser.click(eleMap.add_to_cart_logged_in);
    browser.waitForEnabled(eleMap.checkout_btn, 5000);
    browser.click(eleMap.checkout_btn);
    shopUser.checkForAddress();
    // free shipping option
    browser.click(eleMap.free_shipping);
    browser.waitForEnabled(eleMap.paypal, 5000);
    browser.click(eleMap.paypal);
    shopUser.paypalPaymentInfo();
    browser.click(eleMap.paypal_complete_order_btn);
    // paypal takes forever 45sec wait
    browser.pause("45000");
    browser.click(eleMap.orders_page_btn);
    browser.pause("5000");
    browser.click(eleMap.first_order_new_btn);
    browser.pause("2000");
    browser.click(eleMap.approve_btn);
    browser.waitForEnabled(eleMap.capture_payment_btn, 5000);
    browser.click(eleMap.capture_payment_btn);
    adminUser.refundAmount();
    browser.click(eleMap.apply_refund_btn);
    browser.pause("5000");
    browser.click(eleMap.apply_refund_pop_up_btn);
    browser.pause("2000");
  });
});
