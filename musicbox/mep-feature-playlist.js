/**
 * modified by txgz999@yahoo.com on 4/29/2016 as follows
 * 1) add support to display current poster, copied from Rocco Georgi, https://github.com/rocco/mediaelement-playlist-plugin
 * 2) add support to display current title 
 * 3) modified to allow attaching scrollbar to playlist
 *
 * @file MediaElement Playlist Feature (plugin).
 * @author Andrew Berezovsky <andrew.berezovsky@gmail.com>
 * Twitter handle: duozersk
 * @author Original author: Junaid Qadir Baloch <shekhanzai.baloch@gmail.com>
 * Twitter handle: jeykeu
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

(function ($) {
    $.extend(mejs.MepDefaults, {
        loopText: 'Repeat On/Off',
        shuffleText: 'Shuffle On/Off',
        nextText: 'Next Track',
        prevText: 'Previous Track',
        playlistText: 'Show/Hide Playlist'
    });

    $.extend(MediaElementPlayer.prototype, {
        // LOOP TOGGLE
        buildloop: function (player, controls, layers, media) {
            var t = this;

            var loop = $('<div class="mejs-button mejs-loop-button ' + ((player.options.loop) ? 'mejs-loop-on' : 'mejs-loop-off') + '">' +
              '<button type="button" aria-controls="' + player.id + '" title="' + player.options.loopText + '"></button>' +
              '</div>')
              // append it to the toolbar
              .appendTo(controls)
              // add a click toggle event
              .click(function (e) {
                  player.options.loop = !player.options.loop;
                  $(media).trigger('mep-looptoggle', [player.options.loop]);
                  if (player.options.loop) {
                      loop.removeClass('mejs-loop-off').addClass('mejs-loop-on');
                      //media.setAttribute('loop', 'loop');
                  }
                  else {
                      loop.removeClass('mejs-loop-on').addClass('mejs-loop-off');
                      //media.removeAttribute('loop');
                  }
              });

            t.loopToggle = t.controls.find('.mejs-loop-button');
        },
        loopToggleClick: function () {
            var t = this;
            t.loopToggle.trigger('click');
        },
        // SHUFFLE TOGGLE
        buildshuffle: function (player, controls, layers, media) {
            var t = this;

            var shuffle = $('<div class="mejs-button mejs-shuffle-button ' + ((player.options.shuffle) ? 'mejs-shuffle-on' : 'mejs-shuffle-off') + '">' +
              '<button type="button" aria-controls="' + player.id + '" title="' + player.options.shuffleText + '"></button>' +
              '</div>')
              // append it to the toolbar
              .appendTo(controls)
              // add a click toggle event
              .click(function (e) {
                  player.options.shuffle = !player.options.shuffle;
                  $(media).trigger('mep-shuffletoggle', [player.options.shuffle]);
                  if (player.options.shuffle) {
                      shuffle.removeClass('mejs-shuffle-off').addClass('mejs-shuffle-on');
                  }
                  else {
                      shuffle.removeClass('mejs-shuffle-on').addClass('mejs-shuffle-off');
                  }
              });

            t.shuffleToggle = t.controls.find('.mejs-shuffle-button');
        },
        shuffleToggleClick: function () {
            var t = this;
            t.shuffleToggle.trigger('click');
        },
        // PREVIOUS TRACK BUTTON
        buildprevtrack: function (player, controls, layers, media) {
            var t = this;

            var prevTrack = $('<div class="mejs-button mejs-prevtrack-button mejs-prevtrack">' +
              '<button type="button" aria-controls="' + player.id + '" title="' + player.options.prevText + '"></button>' +
              '</div>')
              .appendTo(controls)
              .click(function (e) {
                  $(media).trigger('mep-playprevtrack');
                  player.playPrevTrack();
              });

            t.prevTrack = t.controls.find('.mejs-prevtrack-button');
        },
        prevTrackClick: function () {
            var t = this;
            t.prevTrack.trigger('click');
        },
        // NEXT TRACK BUTTON
        buildnexttrack: function (player, controls, layers, media) {
            var t = this;

            var nextTrack = $('<div class="mejs-button mejs-nexttrack-button mejs-nexttrack">' +
              '<button type="button" aria-controls="' + player.id + '" title="' + player.options.nextText + '"></button>' +
              '</div>')
              .appendTo(controls)
              .click(function (e) {
                  $(media).trigger('mep-playnexttrack');
                  player.playNextTrack();
              });

            t.nextTrack = t.controls.find('.mejs-nexttrack-button');
        },
        nextTrackClick: function () {
            var t = this;
            t.nextTrack.trigger('click');
        },
        // PLAYLIST TOGGLE
        buildplaylist: function (player, controls, layers, media) {
            var t = this;

            var playlistToggle = $('<div class="mejs-button mejs-playlist-button ' + ((player.options.playlist) ? 'mejs-hide-playlist' : 'mejs-show-playlist') + '">' +
              '<button type="button" aria-controls="' + player.id + '" title="' + player.options.playlistText + '"></button>' +
              '</div>')
              .appendTo(controls)
              .click(function (e) {
                  player.options.playlist = !player.options.playlist;
                  $(media).trigger('mep-playlisttoggle', [player.options.playlist]);
                  if (player.options.playlist) {
                      layers.children('.mejs-playlist').show();
                      playlistToggle.removeClass('mejs-show-playlist').addClass('mejs-hide-playlist');
                  }
                  else {
                      layers.children('.mejs-playlist').hide();
                      playlistToggle.removeClass('mejs-hide-playlist').addClass('mejs-show-playlist');
                  }
              });

            t.playlistToggle = t.controls.find('.mejs-playlist-button');
        },
        playlistToggleClick: function () {
            var t = this;
            t.playlistToggle.trigger('click');
        },
        // PLAYLIST WINDOW
        buildplaylistfeature: function (player, controls, layers, media) {
            var playlist = $('<div class="mejs-playlist mejs-layer">' +
              '<ul class="mejs"></ul>' +
              '</div>')
              .appendTo(layers);
            if (!player.options.playlist) {
                playlist.hide();
            }
            if (player.options.playlistposition == 'bottom') {
                playlist.css('top', player.options.audioHeight + 'px');
            }
            else {
                playlist.css('bottom', player.options.audioHeight + 'px');
            }
            var getTrackName = function (trackUrl) {
                var trackUrlParts = trackUrl.split("/");
                if (trackUrlParts.length > 0) {
                    return decodeURIComponent(trackUrlParts[trackUrlParts.length - 1]);
                }
                else {
                    return '';
                }
            };

            // calculate tracks and build playlist
            var tracks = [];
            //$(media).children('source').each(function(index, element) { // doesn't work in Opera 12.12
            $('#' + player.id).find('.mejs-mediaelement source').each(function (index, element) {
                if ($.trim(this.src) != '') {
                    var track = {};
                    track.source = $.trim(this.src);
                    if ($.trim(this.title) != '') {
                        track.name = $.trim(this.title);
                    }
                    else {
                        track.name = getTrackName(track.source);
                    }
                    // the following two lines are copied from https://github.com/rocco/mediaelement-playlist-plugin/
                    // add poster image URL from data-poster attribute
                    track.poster = $(this).data('poster');

                    tracks.push(track);
                }
            });
            for (var track in tracks) {
                // the following line is modified based on https://github.com/rocco/mediaelement-playlist-plugin/
                // layers.find('.mejs-playlist > ul').append('<li data-url="' + tracks[track].source + '" title="' + tracks[track].name + '">' + tracks[track].name + '</li>');
                layers.find('.mejs-playlist > ul').append('<li data-url="' + tracks[track].source + '" data-poster="' + tracks[track].poster + '" title="' + tracks[track].name + '">' + tracks[track].name + '</li>');
            }

            // set the first track as current
            layers.find('li:first').addClass('current played');

            // the following section are copied from https://github.com/rocco/mediaelement-playlist-plugin/
            // set initial poster image - only for audio playlists
            if ($(player.media).is('audio')) {
                player.changePoster(layers.find('li:first').data('poster'));
            }
            // the following line is added by txgz999@yahoo.com
            player.changeTitle(layers.find('li:first').attr('title'));

            // play track from playlist when clicking it
            layers.find('.mejs-playlist > ul li').click(function (e) {
                if (!$(this).hasClass('current')) {
                    $(this).addClass('played');
                    player.playTrack($(this));
                }
                else {
                    player.play();
                }
            });

            // when current track ends - play the next one
            media.addEventListener('ended', function (e) {
                player.playNextTrack();
            }, false);

            // the following section is copied from https://github.com/rocco/mediaelement-playlist-plugin/
            /* mediaelement.js hides poster on "play" for all player types - not so great for audio */
            media.addEventListener('play', function () {
                if ($(player.media).is('audio')) {
                    layers.find('.mejs-poster').show();
                }
                // the following line is added by txgz999@yahoo.com
                layers.find('.mejs-title').show();
            }, false);

        },
        playNextTrack: function () {
            var t = this;
            //the following line is modified by txgz999@yahoo.com to support scrollbar
            // var tracks = t.layers.find('.mejs-playlist > ul > li');
            var tracks = t.layers.find('.mejs-playlist ul > li');
            var current = tracks.filter('.current');
            var notplayed = tracks.not('.played');
            if (notplayed.length < 1) {
                current.removeClass('played').siblings().removeClass('played');
                notplayed = tracks.not('.current');
            }
            if (t.options.shuffle) {
                var random = Math.floor(Math.random() * notplayed.length);
                var nxt = notplayed.eq(random);
            }
            else {
                var nxt = current.next();
                if (nxt.length < 1 && t.options.loop) {
                    nxt = current.siblings().first();
                }
            }
            if (nxt.length == 1) {
                nxt.addClass('played');
                t.playTrack(nxt);
            }
        },
        playPrevTrack: function () {
            var t = this;
            //the following line is modified by txgz999@yahoo.com to support scrollbar
            //var tracks = t.layers.find('.mejs-playlist > ul > li');
            var tracks = t.layers.find('.mejs-playlist ul > li');
            var current = tracks.filter('.current');
            var played = tracks.filter('.played').not('.current');
            if (played.length < 1) {
                current.removeClass('played');
                played = tracks.not('.current');
            }
            if (t.options.shuffle) {
                var random = Math.floor(Math.random() * played.length);
                var prev = played.eq(random);
            }
            else {
                var prev = current.prev();
                if (prev.length < 1 && t.options.loop) {
                    prev = current.siblings().last();
                }
            }
            if (prev.length == 1) {
                current.removeClass('played');
                t.playTrack(prev);
            }
        },
        // the following section is copied from https://github.com/rocco/mediaelement-playlist-plugin/
        changePoster: function (posterUrl) {
            var t = this;
            //set actual poster
            t.setPoster(posterUrl);
            // make sure poster is visible (not the case if no poster attribute was set)
            t.layers.find('.mejs-poster').show();
        },
        // the following section is added by txgz999@yahoo.com
        changeTitle: function (title) {
            var t = this;
            var titleDiv = t.container.find('.mejs-title');
            if (titleDiv.length == 0) {
                titleDiv = $('<div class="mejs-title mejs-layer"></div>').appendTo(t.layers);
            }
            titleDiv.html(title);
            t.layers.find('.mejs-title').show();
        },
        playTrack: function (track) {
            var t = this;
            t.pause();
            t.setSrc(track.attr('data-url'));
            t.load();
            //the following line is copied from https://github.com/rocco/mediaelement-playlist-plugin/
            t.changePoster(track.data('poster'));
            //the following line is added by txgz999@yahoo.com
            t.changeTitle(track.attr('title'));
            //t.play();
            track.addClass('current').siblings().removeClass('current');
        },
        playTrackURL: function (url) {
            var t = this;
            //the following line is modified by txgz999@yahoo.com to support scrollbar
            //var tracks = t.layers.find('.mejs-playlist > ul > li');
            var tracks = t.layers.find('.mejs-playlist ul > li');
            var track = tracks.filter('[data-url="' + url + '"]');
            t.playTrack(track);
        }
    });

})(mejs.$);
