var postData = require("../data/data.js");

var app = getApp();
Page({
  data: {
    isPlayMusic: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    this.data.currentPostId = id;
    this.setData({
      post_key: postData.postList[id]
    });

    var postsCollected = wx.getStorageSync('posts_Collected');
    if (postsCollected) {
      var postCollected = postsCollected[id];
      this.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      postsCollected[id] = false;
      wx.setStorageSync('posts_Collected', postsCollected)
    };

    if(app.globalData.g_isPlayMusic && app.globalData.g_isCurrentMusicPostId===this.data.currentPostId){
      this.setData({
        isPlayMusic: true
      })
    }
    var that = this;
    wx.onBackgroundAudioPlay(function(){
       that.setData({
        isPlayMusic: true
      })
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_isCurrentMusicPostId = that.data.currentPostId 
    });
    wx.onBackgroundAudioPause(function(){
       that.setData({
        isPlayMusic: false
      })
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_isCurrentMusicPostId = null;
    });
  },
  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    wx.setStorageSync('posts_Collected', postsCollected);
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success",
      mask: true
    });
  },
  onShareTap: function () {
    wx.showActionSheet({
      itemList: [
        "分享给朋友",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
      ]
    })
  },
  onPlayMusic: function (event) {
    var currentPostId = this.data.currentPostId;
    var isPlayMusic = this.data.isPlayMusic;
    if (isPlayMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.postList[currentPostId].music.dataUrl,
        title: postData.postList[currentPostId].music.title,
        coverImgUrl: postData.postList[currentPostId].music.coverImgUrl
      })
      this.setData({
        isPlayMusic: true
      })
    }
  }
})