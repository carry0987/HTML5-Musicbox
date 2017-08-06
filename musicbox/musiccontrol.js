jQuery(document).ready(function () {
    jQuery('#mejs').mediaelementplayer({
        loop: true,
        shuffle: false,
        playlist: true,
        audioHeight: 80,
        audioVolume: "vertical",
        playlistposition: 'bottom',
        features: ['playlistfeature', 'prevtrack', 'playpause', 'stop', 'nexttrack', 'current', 'progress', 'duration', 'volume', 'playlist'],
        keyActions: []
    });

    var $ofweidht = innerWidth;
    var $div_mejs = '#footer'; //Please set the div's ID here which is under this player
    var $mobile_height = 90; //Set playlist height in mobile
    var $desktop_height = 5; //Set playlist height in computer

    if ($ofweidht < 700 && $ofweidht >= 310) {
        jQuery(".mejs-hide-playlist, .mejs-show-playlist").click(function () {
            if (jQuery(".mejs-playlist").is(":visible")) {
                jQuery($div_mejs).css('margin-top', jQuery(".mejs-playlist").height() + $mobile_height);
            }
            else {
                jQuery($div_mejs).css('margin-top', 0);
            }
        });
        jQuery($div_mejs).css('margin-top', jQuery(".mejs-playlist").height() + $mobile_height);
    }

    if ($ofweidht >= 700 && $ofweidht < 2000) {
        jQuery(".mejs-hide-playlist, .mejs-show-playlist").click(function () {
            if (jQuery(".mejs-playlist").is(":visible")) {
                jQuery($div_mejs).css('margin-top', jQuery(".mejs-playlist").height() + $desktop_height);
            }
            else {
                jQuery($div_mejs).css('margin-top', 0);
            }
        });
        jQuery($div_mejs).css('margin-top', jQuery(".mejs-playlist").height() +$desktop_height);
    }
    
    if (jQuery('#mejs').attr("width") < 250) {
        jQuery('.mejs-prevtrack-button, .mejs-nexttrack-button').css({ 'display': 'none' });
    }
    if (jQuery('#mejs').attr("width") < 10000) {
        jQuery('.mejs-stop-button').css({ 'display': 'none' });
    }
    // remove a suspicious element that causes the page content to be smaller on iPhone and iPad
    jQuery('.mejs-offscreen').remove();

    jQuery('.mejs-playlist').mCustomScrollbar({
        theme: "minimal"
    });
});
jQuery.noConflict();