$(function(){
  window.KinsokuView = Backbone.View.extend({
    el: $('#container'),
    paragraphTemplate: _.template($('#paragraph-template').html()),

    allText: "太史公曰吾闻之周生曰舜目盖重瞳子又闻项羽亦重瞳子羽岂其苗裔邪何兴之暴也夫秦失其政陈涉首难豪杰蜂起相与并争不可胜数然羽非有尺寸乘势起陇亩之中三年遂将五诸侯灭秦",
    oneLineText: "",
    allTextWithEn: "所谓希区柯克症候syndrome Hitchcock不是要谈希区柯克的电影而是希区柯克在迷影运动中所激发的一种特殊电影批评现象希区柯克在电影史上有着毋庸置疑的贡献对迷影文化史",
    oneLineTextWithEn: "",
    //the following rules are from http://en.wikipedia.org/wiki/Line_breaking_rules_in_East_Asian_language
    kinsokuNoHead: "\u0021\u0025\u0029\u002C\u002E\u003A\u003B\u003E\u003F\u005D\u007D\u00A2\u00A8\u00B0\u00B7\u02C7\u02C9\u2015\u2016\u2019\u201D\u201E\u201F\u2020\u2021\u203A\u2103\u2236\u3001\u3002\u3003\u3006\u3008\u300A\u300C\u300E\u3015\u3017\u301E\uFE35\uFE39\uFE3D\uFE3F\uFE43\uFE58\uFE5A\uFE5C\uFF01\uFF02\uFF05\uFF07\uFF09\uFF0C\uFF0E\uFF1A\uFF1B\uFF1F\uFF3D\uFF40\uFF5C\uFF5D\uFF5E".split(""),
    kinsokuNoTail: "\u0024\u0028\u002A\u002C\u00A3\u00A5\u00B7\u2018\u201C\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u301D\uFE57\uFE59\uFE5B\uFF04\uFF08\uFF0E\uFF3B\uFF5B\uFFE1\uFFE5".split(""),
    kinsokuNoBreak: ["……", "——"],

    initialize: function(){
      this.oneLineText = this.oneLineTest(this.allText);
      this.moreText = this.allText.substring(this.oneLineText.length, this.oneLineText.length+10);
      this.lastParagraph().detach();
      this.oneLineTextWithEn = this.oneLineTest(this.allTextWithEn);
      this.moreTextWithEn = this.allTextWithEn.substring(this.oneLineTextWithEn.length, this.oneLineTextWithEn.length+10);
      this.lastParagraph().detach();
      var i,mark,content;

      this.createHeadline("单行基准");
      this.createParagraph(this.oneLineText);
      this.createParagraph(this.oneLineTextWithEn);

      this.createHeadline("两端对齐");
      this.createKinsokuParagraph("……", this.oneLineText, this.moreText);
      this.createKinsokuParagraph("……", this.oneLineTextWithEn, this.moreTextWithEn);

      this.createHeadline("避头");
      for (i=0; i<this.kinsokuNoHead.length; ++i) 
        this.createKinsokuParagraph(this.kinsokuNoHead[i], this.oneLineText, this.moreText);

      this.createHeadline("避尾");
      for (i=0; i<this.kinsokuNoTail.length; ++i) {
        this.createKinsokuParagraph(this.kinsokuNoTail[i],
          this.oneLineText.substring(0, this.oneLineText.length-1),
          this.moreText);
      }

      this.createHeadline("不跨行");
      for (i=0; i<this.kinsokuNoBreak.length; ++i) {
        this.createKinsokuParagraph(this.kinsokuNoBreak[i],
          this.oneLineText.substring(0, this.oneLineText.length-1),
          this.moreText);
      }
    },
    createHeadline: function(title){
      this.$el.append("<h2>"+title+"</h2>");
    },
    createParagraph: function(content){
      this.$el.append(this.paragraphTemplate({content:content}));
    },
    createKinsokuParagraph: function(mark, firstLine, secondLine){
      content = firstLine;
      content += "<span class='mark'>"+mark+"</span>";
      content += secondLine;
      this.createParagraph(content);
    },
    lastParagraph: function(){
      return this.$el.find("p:last");
    },
    oneLineTest: function(text){
      this.$el.append(this.paragraphTemplate({content:text[0]}));
      for (var i=1;i<text.length;++i){
        var p = this.lastParagraph();
        var currentHeight = p.height();
        var currentText = p.text();
        p.text(currentText+text[i]);
        if (p.height() > currentHeight) return currentText;
      }
      return null;
    }
  });

  window.App = new window.KinsokuView;
});
