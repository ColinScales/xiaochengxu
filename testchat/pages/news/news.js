// pages/news/news.js
var postData = require("../data/data.js");

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      post_key: postData.postList
      });
  },
    newsTap: function(event){
        var newsid = event.currentTarget.dataset.newsid;
        wx.navigateTo({
            url: "../content/content?id="+newsid
        });
    }
})