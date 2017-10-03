// ==UserScript==
// @name         Save AudioBook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lesyuk Serg
// @match        https://audioknigi.club/*
//include        https://audioknigi.club/*
// @updateURL    https://raw.githubusercontent.com/LesyukSerg/AudioBook-Downloade/master/downloader.meta.js
// @downloadURL  https://raw.githubusercontent.com/LesyukSerg/AudioBook-Downloade/master/downloader.user.js
// @grant        none
// ==/UserScript==

(function() {
    var start = 0;
    $('.player-side').append('<span style="cursor:pointer;float:left;background:#ff2d01;padding:4px 14px;color:#FFF;border-radius:3px;" class="collect_book">DOWNLOAD</span>');

    $('.player-side').delegate(".collect_book", "click", function() {
        start = 1;
        $('.jp-playlist-item').first().click();
    });

    var links = [];
    var src = '';
    var audio = $('.main-frame #jquery_jplayer_1 #jp_audio_0');

    var сrm = setInterval(function() {
        var total = $('.jp-playlist-item').length;

        if (start) {
            var newSrc = audio.attr('src');

            if (src != newSrc && newSrc !== '') {
                src = newSrc;
                //$('.player-side').append('<a style="border:1px solid;border-radius:3px;padding:0 8px;margin:4px" href="' + src + '">' + audio.attr('title') + '</a><br>');
                SaveToDisk(src, audio.attr('title')+'.mp3');
                links.push(src);

                $('.collect_book').html('DOWNLOADING [' + total + '/' + links.length + ']');
                var next = links.length + 1;
                var nextItem = $('.jp-playlist ul li:nth-child(' + next + ') .jp-playlist-item');

                if (nextItem.length) {
                    nextItem.click();
                } else {
                    clearInterval(crm);
                    $('.collect_book').html('DOWNLOAD COMPLETTE');
                }
            }
        }
    }, 60000);

    function SaveToDisk(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.download = fileName || 'unknown';
            save.style = 'display:none;opacity:0;color:transparent;';
            (document.body || document.documentElement).appendChild(save);

            if (typeof save.click === 'function') {
                save.click();
            } else {
                save.target = '_blank';
                var event = document.createEvent('Event');
                event.initEvent('click', true, true);
                save.dispatchEvent(event);
            }

            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }

        // for IE
        else if (!!window.ActiveXObject && document.execCommand) {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL);
            _window.close();
        }
    }
})();
