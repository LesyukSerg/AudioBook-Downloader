// ==UserScript==
// @name         Save AudioBook
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sript creates button download to download all files of one audiobook
// @author       Lesyuk Serg
// @match        https://audioknigi.club/*
//include        https://audioknigi.club/*
// @grant        none
// ==/UserScript==

(function() {
    var links = [];
    var src = '';
    var audio = $('.main-frame #jquery_jplayer_1 #jp_audio_0');
    var stop;
    var sleep = 10000;

    $('.player-side').append('<span style="cursor:pointer;float:left;background:#ff2d01;padding:4px 14px;color:#FFF;border-radius:3px;" class="collect_book">DOWNLOAD</span>');

    $('.player-side').delegate(".collect_book", "click", function() {
        $('.jp-playlist-item').first().click();
        $('.player-side').append('<span style="cursor:pointer;float:left;background:#ff2d01;padding:4px 14px;color:#FFF;border-radius:3px;margin-left:8px" class="pause_downloading">Pause</span>');
        $('.player-side').append('<span style="cursor:pointer;float:left;background:#ff2d01;padding:4px 14px;color:#FFF;border-radius:3px;margin-left:8px" class="next_file">NEXT</span>');

        getOneFile(audio);
        stop = setInterval(function() {
            getOneFile(audio, stop);
        }, sleep);
    });

    $('.player-side').delegate(".next_file", "click", function() {
        getOneFile(audio);
    });

    $('.player-side').delegate(".pause_downloading", "click", function() {
        if ($(this).data('onPause')) {
            stop = setInterval(function() { getOneFile(audio, stop); }, sleep);
            $(this).html("Pause");
            $(this).data('onPause', 0);
        } else {
            clearInterval(stop);
            $(this).html("Continue");
            $(this).data('onPause', 1);
        }
    });

    function getOneFile(audio, stop)
    {
        var total = $('.jp-playlist-item').length;
        var newSrc = audio.attr('src');

        if (src != newSrc && newSrc !== '') {
            src = newSrc;
            links.push(src);
            SaveToDisk(src, audio.attr('title')+'.mp3');

            $('.collect_book').html('DOWNLOADING [' + total + '/' + links.length + ']');
            var next = links.length + 1;
            var nextItem = $('.jp-playlist ul li:nth-child(' + next + ') .jp-playlist-item');

            if (nextItem.length) {
                nextItem.click();
                setTimeout(function(){ $('.jp-type-playlist .jp-pause').click(); }, 400);

            } else {
                $('.collect_book').html('DOWNLOAD COMPLETTE');
                $('.next_file').remove();
                clearInterval(stop);
            }
        }
    }

    function SaveToDisk(fileURL, fileName)
    {
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

        } else if (!!window.ActiveXObject && document.execCommand) { // for IE
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL);
            _window.close();
        }
    }
})();
