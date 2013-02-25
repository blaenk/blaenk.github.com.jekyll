(function(e){function n(){var t=r(this);return isNaN(t.datetime)||e(this).text(i(t.datetime)),this}function r(n){n=e(n);if(!n.data("timeago")){n.data("timeago",{datetime:t.datetime(n)});var r=e.trim(n.text());r.length>0&&(!t.isTime(n)||!n.attr("title"))&&n.attr("title",r)}return n.data("timeago")}function i(e){return t.inWords(s(e))}function s(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){return t instanceof Date?i(t):typeof t=="string"?i(e.timeago.parse(t)):typeof t=="number"?i(new Date(t)):i(e.timeago.datetime(t))};var t=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowFuture:!1,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function l(r,i){var s=e.isFunction(r)?r(i,t):r,o=n.numbers&&n.numbers[i]||i;return s.replace(/%d/i,o)}var n=this.settings.strings,r=n.prefixAgo,i=n.suffixAgo;this.settings.allowFuture&&t<0&&(r=n.prefixFromNow,i=n.suffixFromNow);var s=Math.abs(t)/1e3,o=s/60,u=o/60,a=u/24,f=a/365,c=s<45&&l(n.seconds,Math.round(s))||s<90&&l(n.minute,1)||o<45&&l(n.minutes,Math.round(o))||o<90&&l(n.hour,1)||u<24&&l(n.hours,Math.round(u))||u<42&&l(n.day,1)||a<30&&l(n.days,Math.round(a))||a<45&&l(n.month,1)||a<365&&l(n.months,Math.round(a/30))||f<1.5&&l(n.year,1)||l(n.years,Math.round(f)),h=n.wordSeparator===undefined?" ":n.wordSeparator;return e.trim([r,c,i].join(h))},parse:function(t){var n=e.trim(t);return n=n.replace(/\.\d+/,""),n=n.replace(/-/,"/").replace(/-/,"/"),n=n.replace(/T/," ").replace(/Z/," UTC"),n=n.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(n)},datetime:function(n){var r=t.isTime(n)?e(n).attr("datetime"):e(n).attr("title");return t.parse(r)},isTime:function(t){return e(t).get(0).tagName.toLowerCase()==="time"}}),e.fn.timeago=function(){var e=this;e.each(n);var r=t.settings;return r.refreshMillis>0&&setInterval(function(){e.each(n)},r.refreshMillis),e},document.createElement("abbr"),document.createElement("time")})(jQuery),$(function(){var e=function(){var e=location.host;$("body").on("click","a",function(t){var n=this.href,r=n.replace(/https?:\/\/([^\/]+)(.*)/,"$1");r!=""&&r!=e&&!$(this).hasClass("fancybox")&&(window.open(n),t.preventDefault())})},t=function(){$(".entry-content").each(function(e){var t=e;$(this).find("img").each(function(){var e=this.alt;e!=""&&$(this).after('<span class="caption">'+e+"</span>"),$(this).wrap('<a href="'+this.src+'" title="'+e+'"/>')})})};e(),t();var n=$("#mobile-nav");$("html").click(function(){n.find(".on").each(function(){$(this).removeClass("on").next().hide()})}),n.on("click",".menu .button",function(){if(!$(this).hasClass("on")){var e=$(this).width()+42;$(this).addClass("on").next().show().css({width:e})}else $(this).removeClass("on").next().hide()}).on("click",".search .button",function(){if(!$(this).hasClass("on")){var e=n.width()-51;n.children(".menu").children().eq(0).removeClass("on").next().hide(),$(this).addClass("on").next().show().css({width:e}).children().children().eq(0).focus()}else $(this).removeClass("on").next().hide().children().children().eq(0).val("")}).click(function(e){e.stopPropagation()}),$("time.timeago").timeago();var r=$("#main-nav .main"),i=$(".desk_search"),s=function(){r.removeClass("searching"),i.hide()},o=function(){r.addClass("searching"),i.show().find('input[type="text"]').focus()};$("#search_btn").click(function(){r.hasClass("searching")?s():o()}),$('.desk_search input[type="text"]').keyup(function(e){e.keyCode==27&&s()}),$(".entry-content").find("h1, h2, h3, h4, h5").each(function(){var e=$(this).attr("id"),t=$(this).text();$(this).html("").prepend('<span class="hash">#</span>').append('<a href="#'+e+'">'+t+"</a>")})});