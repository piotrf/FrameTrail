/**
 * @module Player
 */


/**
 * I am the ViewVideo. I am the most important user interface component. I contain
 * all the visual elements of the hypervideo player, like the main &lt;video&gt; element,
 * the containers for overlays, videolinks and annotations, their respective timelines
 * and the player control elements.
 *
 * When I am initialized, I prepare all DOM elements and set up their event listeners.
 *
 * @class ViewVideo
 * @static
 */



FrameTrail.defineModule('ViewVideo', function(){

    var domElement  = $(  '<div id="ViewVideo">'
                        + '    <div id="SlideArea">'
                        + '        <div id="AreaTopContainer"></div>'
                        + '        <div id="AreaTopTiles">'
                        + '            <div class="tileSlider"></div>'
                        + '        </div>'
                        + '        <div id="PlayerContainer">'
                        + '            <div id="AreaTopTimeline" class="timeline"></div>'
                        + '            <div id="PlayerProgress"></div>'
                        + '            <div id="HypervideoContainer">'
                        + '                <div id="VideoContainer">'
                        + '                    <div id="Hypervideo">'
                        + '                        <video id="Video"></video>'
                        + '                        <div id="OverlayContainer"></div>'
                        + '                        <div id="CaptionContainer"></div>'
                        + '                    </div>'
                        + '                    <div id="VideoStartOverlay">'
                        + '                        <div id="PlayButtonBig"><span class="icon-play-circled"></span></div>'
                        + '                    </div>'
                        + '                    <div id="ExpandButton">'
                        + '                        <div id="ExpandLabel"><span class="icon-resize-full-1"></span></div>'
                        + '                    </div>'
                        + '                    <div id="WorkingIndicator">'
                        + '                        <div class="workingSpinner"></div>'
                        + '                    </div>'
                        + '                </div>'
                        + '                <div id="InfoAreaRight">'
                        + '                    <div id="AnnotationPreviewContainer"></div>'
                        + '                    <div id="EditPropertiesContainer"></div>'
                        + '                </div>'
                        + '            </div>'
                        + '            <div id="CodeSnippetTimeline" class="timeline"></div>'
                        + '            <div id="OverlayTimeline" class="timeline"></div>'
                        + '            <div id="Controls">'
                        + '                <div id="LeftControlPanel">'
                        + '                    <div class="playerControl" id="PlayButton"><span class="icon-play-1"></span></div>'
                        + '                    <div class="playerControl" id="TimeDisplay">'
                        + '                        <div id="CurrentTime">00:00</div>'
                        + '                        <div id="TotalDuration">00:00</div>'
                        + '                    </div>'
                        + '                </div>'
                        + '                <div id="RightControlPanel">'
                        + '                    <div class="playerControl contextButton" id="AnnotationSettingsButton">'
                        + '                        <span class="icon-annotations"></span>'
                        + '                        <div id="AnnotationSettingsContainer" class="contextButtonContainer">'
                        + '                            <div>Annotations</div>'
                        + '                            <div id="SelectAnnotationContainer"></div>'
                        + '                        </div>'
                        + '                    </div>'
                        + '                    <div class="playerControl contextButton" id="SettingsButton">'
                        + '                        <span class="icon-cog"></span>'
                        + '                        <div id="SettingsContainer" class="contextButtonContainer">'
                        + '                            <div id="LayoutSettingsWrapper">'
                        + '                                <div data-config="hv_config_areaTopVisible">LayoutArea Top</div>'
                        + '                                <div id="PlayerWrapper">'
                        + '                                    <div data-config="hv_config_overlaysVisible">Overlays</div>'
                        + '                                    <div data-config="hv_config_areaRightVisible">LayoutArea Right</div>'
                        + '                                </div>'
                        + '                                <div data-config="hv_config_areaBottomVisible">Layout Area Bottom</div>'
                        + '                            </div>'
                        + '                            <div id="GenericSettingsWrapper">Layout Mode'
                        + '                                <div data-config="hv_config_slidingMode">'
                        + '                                    <div class="slidingMode" data-value="adjust">Adjust</div>'
                        + '                                    <div class="slidingMode" data-value="overlay">Overlay</div>'
                        + '                                </div>'
                        + '                            </div>'
                        + '                        </div>'
                        + '                    </div>'
                        + '                    <div class="playerControl" id="CaptionsButton">'
                        + '                        <span class="icon-captions-off"></span>'
                        + '                        <div id="CaptionSelectContainer">'
                        + '                            <div class="captionSelect none" data-lang="" data-config="hv_config_captionsVisible">None</div>'
                        + '                            <div id="CaptionSelectList"></div>'
                        + '                        </div>'
                        + '                    </div>'
                        + '                    <div class="playerControl" id="VolumeButton"><span class="icon-volume-up"></span></div>'
                        + '                    <div class="playerControl" id="FullscreenButton"><span class="icon-resize-full-alt"></span></div>'
                        + '                </div>'
                        + '            </div>'
                        + '            <div id="AreaBottomTimeline" class="timeline"></div>'
                        + '        </div>'
                        + '        <div id="AreaBottomTiles">'
                        + '            <div class="tileSlider"></div>'
                        + '        </div>'
                        + '        <div id="AreaBottomContainer">'
                        + '            <div id="AnnotationSlider"></div>'
                        + '        </div>'
                        + '    </div>'
                        + '    <div id="EditingOptions"></div>'
                        + '    <div id="HypervideoLayoutContainer"></div>'
                        + '    <div id="HypervideoSettingsContainer"></div>'
                        + '</div>'),


        slideArea                   = domElement.children('#SlideArea'),

        PlayerContainer             = domElement.find('#PlayerContainer'),
        HypervideoContainer         = domElement.find('#HypervideoContainer'),
        VideoContainer              = domElement.find('#VideoContainer'),
        Hypervideo                  = domElement.find('#Hypervideo'),
        CaptionContainer            = domElement.find('#CaptionContainer'),

        AreaTopContainer          = domElement.find('#AreaTopContainer'),
        AreaTopTiles              = domElement.find('#AreaTopTiles'),
        AreaTopTileSlider         = domElement.find('#AreaTopTiles .tileSlider'),
        AreaTopTimeline           = domElement.find('#AreaTopTimeline'),

        AreaBottomTimeline          = domElement.find('#AreaBottomTimeline'),
        AreaBottomContainer         = domElement.find('#AreaBottomContainer'),
        AreaBottomTiles             = domElement.find('#AreaBottomTiles'),
        AreaBottomTileSlider        = domElement.find('#AreaBottomTiles .tileSlider'),
        AnnotationSlider            = domElement.find('#AnnotationSlider'),

        OverlayTimeline             = domElement.find('#OverlayTimeline'),
        OverlayContainer            = domElement.find('#OverlayContainer'),

        CodeSnippetTimeline         = domElement.find('#CodeSnippetTimeline'),

        Controls                    = domElement.find('#Controls'),
        AnnotationSettingsButton    = domElement.find('#AnnotationSettingsButton'),
        EditingOptions              = domElement.find('#EditingOptions'),
        HypervideoSettingsContainer = domElement.find('#HypervideoSettingsContainer'),
        HypervideoLayoutContainer   = domElement.find('#HypervideoLayoutContainer'),


        CurrentTime                 = domElement.find('#CurrentTime'),
        TotalDuration               = domElement.find('#TotalDuration'),
        PlayButton                  = domElement.find('#PlayButton'),
        VideoStartOverlay           = domElement.find('#VideoStartOverlay'),
        VolumeButton                = domElement.find('#VolumeButton'),
        FullscreenButton            = domElement.find('#FullscreenButton'),

        PlayerProgress              = domElement.find('#PlayerProgress'),

        Video                       = domElement.find('#Video')[0],

        EditPropertiesContainer     = domElement.find('#EditPropertiesContainer'),
        AnnotationPreviewContainer  = domElement.find('#AnnotationPreviewContainer'),

        ExpandButton                = domElement.find('#ExpandButton'),

        WorkingIndicator            = VideoContainer.find('#WorkingIndicator'),

        shownDetails                = null,
        wasPlaying                  = false;


    ExpandButton.click(function() {
        showDetails(false);
    });

    Controls.find('#CaptionsButton').click(function() {

        Controls.find('#RightControlPanel .active').not('[data-config], #CaptionsButton, #CaptionSelectContainer, .annotationSetButton').removeClass('active');

        if ( !$(this).children('#CaptionSelectContainer').hasClass('active') ) {
            $(this).children('#CaptionSelectContainer').addClass('active');
            VideoContainer.css('opacity', 0.3);
            domElement.find('#InfoAreaRight').css('opacity', 0.3);
        } else {
            $(this).children('#CaptionSelectContainer').removeClass('active');
            VideoContainer.css('opacity', 1);
            domElement.find('#InfoAreaRight').css('opacity', 1);
        }

    });

    Controls.find('.captionSelect.none').click(function() {
        FrameTrail.changeState('hv_config_captionsVisible', false);
    });

    Controls.find('.contextButton').click(function(evt) {

        var settingsButton = $(this);

        if ( !settingsButton.hasClass('active') ) {

            $('body').on('mouseup', function(evt) {

                if ( !$(evt.target).attr('data-config') && !$(evt.target).hasClass('contextButton') ) {
                    settingsButton.removeClass('active');
                    VideoContainer.css('opacity', 1);
                    domElement.find('#InfoAreaRight').css('opacity', 1);
                    $('body').off('mouseup');
                    evt.preventDefault();
                    evt.stopPropagation();
                }

            });

            Controls.find('#RightControlPanel .active').not('[data-config], #CaptionsButton, .annotationSetButton').removeClass('active');

            settingsButton.addClass('active');
            VideoContainer.css('opacity', 0.3);
            domElement.find('#InfoAreaRight').css('opacity', 0.3);

        } else {

            settingsButton.removeClass('active');
            VideoContainer.css('opacity', 1);
            domElement.find('#InfoAreaRight').css('opacity', 1);

        }



    });

    Controls.find('#SettingsContainer').click(function(evt) {

        if ( $(evt.target).attr('data-config') ) {

            var config      = $(evt.target).attr('data-config');
            var configState = $(evt.target).hasClass('active');

            if ( config != 'hv_config_annotationsPosition' && config != 'hv_config_slidingMode' ) {

                FrameTrail.changeState(config, !configState);

            } else if ( config == 'hv_config_slidingMode' ) {

                if ( FrameTrail.getState('hv_config_slidingMode') == 'adjust' ) {
                    FrameTrail.changeState('hv_config_slidingMode', 'overlay');
                } else {
                    FrameTrail.changeState('hv_config_slidingMode', 'adjust');
                }

            } else {

                if ( FrameTrail.getState('hv_config_annotationsPosition') == 'top' ) {
                    FrameTrail.changeState('hv_config_annotationsPosition', 'bottom');
                } else {
                    FrameTrail.changeState('hv_config_annotationsPosition', 'top');
                }

            }

            FrameTrail.changeState('viewSize', FrameTrail.getState('viewSize'));

        }

        evt.preventDefault();
        evt.stopPropagation();
    });

    VolumeButton.click(function() {

        if ( $(this).hasClass('active') ) {
            FrameTrail.module('HypervideoController').muted = false;
            $(this).removeClass('active');
        } else {
            FrameTrail.module('HypervideoController').muted = true;
            $(this).addClass('active');
        }


    });

    AreaTopTiles.click(function(evt) {

        if ( FrameTrail.module('VideolinksController').openedLink && $(evt.target).attr('id') == 'AreaTopTiles' ) {
            FrameTrail.module('VideolinksController').openedLink = null;
        }

    });

    AreaBottomTiles.click(function(evt) {

        if ( FrameTrail.module('AnnotationsController').openedAnnotation && $(evt.target).attr('id') == 'AreaBottomTiles' ) {
            FrameTrail.module('AnnotationsController').openedAnnotation = null;
        }

    });

    document.addEventListener("fullscreenchange", toggleFullscreenState, false);
    document.addEventListener("webkitfullscreenchange", toggleFullscreenState, false);
    document.addEventListener("mozfullscreenchange", toggleFullscreenState, false);
    Controls.find('#FullscreenButton').click(toggleNativeFullscreenState);


    /**
     * I am called from {{#crossLink "Interface/create:method"}}Interface/create(){{/crossLink}}.
     * I update my local state from the global state variables and append my elements in the DOM tree.
     * @method create
     */
    function create() {

        toggleViewMode(FrameTrail.getState('viewMode'));

        toggleConfig_areaTopVisible(FrameTrail.getState('hv_config_areaTopVisible'));
        toggleConfig_areaBottomVisible(FrameTrail.getState('hv_config_areaBottomVisible'));
        toggleConfig_areaLeftVisible(FrameTrail.getState('hv_config_areaLeftVisible'));
        toggleConfig_areaRightVisible(FrameTrail.getState('hv_config_areaRightVisible'));
        toggleConfig_overlaysVisible(FrameTrail.getState('hv_config_overlaysVisible'));

        toggleConfig_captionsVisible(FrameTrail.getState('hv_config_captionsVisible'))

        changeSlidePosition(FrameTrail.getState('slidePosition'));

        $('#MainContainer').append(domElement);

    }

    /**
     * I am called when the global state "sidebarOpen" changes.
     * @method toggleSidebarOpen
     * @param {Boolean} opened
     */
    function toggleSidebarOpen(opened) {

        adjustHypervideo(true);

    };


    /**
     * I am called when the global state "viewSize" changes (which it does after a window resize,
     * and one time during app start, after all create methods of interface modules have been called).
     * @method changeViewSize
     * @param {Array} arrayWidthAndHeight
     */
    function changeViewSize(arrayWidthAndHeight) {

        slideArea.css({
            'transition-duration': '0ms',
            '-moz-transition-duration': '0ms',
            '-webkit-transition-duration': '0ms',
            '-o-transition-duration': '0ms'
        });

        adjustLayout();
        adjustHypervideo();

        slideArea.css({
            'transition-duration': '',
            '-moz-transition-duration': '',
            '-webkit-transition-duration': '',
            '-o-transition-duration': ''
        });

    };


    /**
     * I react to changes in the global state viewSizeChanged.
     * The state changes after a window resize event
     * and is meant to be used for performance-heavy operations.
     *
     * @method onViewSizeChanged
     * @private
     */
    function onViewSizeChanged() {

        slideArea.css({
            'transition-duration': '0ms',
            '-moz-transition-duration': '0ms',
            '-webkit-transition-duration': '0ms',
            '-o-transition-duration': '0ms'
        });

        adjustLayout();
        adjustHypervideo();

        slideArea.css({
            'transition-duration': '',
            '-moz-transition-duration': '',
            '-webkit-transition-duration': '',
            '-o-transition-duration': ''
        });

    };



    /**
     * I am a central method of the ViewVideo. I rearrange all my child elements.
     * Their position is defined by the global state "editMode" and by the various
     * "hv_config_[...]" states, as well as the current width and height of the display area.
     *
     * I am called from many places, whenever one of the defining variables (see above) changes.
     *
     * @method adjustLayout
     */
    function adjustLayout() {


        var editMode            = FrameTrail.getState('editMode'),
            playerMargin        = parseInt(PlayerContainer.css('marginTop')),
            editBorder          = (editMode != false) ? 20 : 0,
            slidePosition       = FrameTrail.getState('slidePosition'),
            slidingMode         = FrameTrail.getState('hv_config_slidingMode'),

            areaTopVisible      = ( (editMode != false && editMode != 'preview') ? false : FrameTrail.getState('hv_config_areaTopVisible') ),
            areaBottomVisible   = ( (editMode != false && editMode != 'preview') ? false : FrameTrail.getState('hv_config_areaBottomVisible') ),
            overlaysVisible     = ( (editMode == 'overlays') ? true : FrameTrail.getState('hv_config_overlaysVisible') ),

            areaTopTimelineVisible       = ( (editMode != false && editMode != 'preview') ? true : FrameTrail.getState('hv_config_areaTopVisible') ),
            areaBottomTimelineVisible    = ( (editMode != false && editMode != 'preview') ? true : FrameTrail.getState('hv_config_areaBottomVisible') );
            

        if (slidingMode == 'overlay') {
            PlayerContainer.css({
                'flex-grow': 0,
                'flex-shrink': 0,
                'flex-basis':
                    $('#MainContainer').height()
                    - ((areaTopVisible) ? (AreaTopTiles.height() + playerMargin) : 0)
                    - ((areaBottomVisible) ? (AreaBottomTiles.height() + playerMargin) : 0)
                    - editBorder
                    + 'px'
            });
        } else {
            PlayerContainer.css({
                'flex': ''
            });
        }

        if ( slidePosition == 'top' ) {

            if ( slidingMode == 'adjust' ) {

                slideArea.css({
                    marginTop:
                        - ((editMode != false && editMode != 'preview') ? playerMargin : 0)
                        + 'px',
                    minHeight:
                        $('#MainContainer').height()
                        + (areaTopVisible ? AreaTopContainer.height() + AreaTopTiles.height() : 0)
                        + (areaBottomVisible ? AreaBottomContainer.height() + AreaBottomTiles.height() : 0)
                        - editBorder
                        + 'px'
                });

            } else if ( slidingMode == 'overlay' ) {

                slideArea.css({
                    marginTop:
                        - (areaTopVisible ? AreaTopContainer.height() : 0)
                        - (areaBottomVisible ? AreaBottomContainer.height() : 0)
                        - playerMargin
                        + 'px'
                });

                // slidingMode overlay top behaviour
                var targetOffset = playerMargin + ( (PlayerContainer.height() - Controls.height())/2 ),
                    thisOffset;

                thisOffset = AreaBottomContainer.height() + AreaBottomTiles.height() + targetOffset - (AreaBottomContainer.height() / 2);

                AreaBottomContainer.css({
                    marginTop: thisOffset + 'px'
                });

                AreaBottomTiles.css({
                    marginTop: - thisOffset + 'px'
                });

                AreaTopContainer.css({
                    marginTop: ''
                });

                AreaTopTiles.css({
                    marginTop: ''
                });

            }

        } else if ( slidePosition == 'bottom' ) {

            if ( slidingMode == 'adjust' ) {

                slideArea.css({
                    marginTop:
                        - (areaTopVisible ? AreaTopContainer.height() + AreaTopTiles.height() : 0)
                        - playerMargin
                        + 'px',
                    minHeight:
                        $('#MainContainer').height()
                        + (areaTopVisible ? AreaTopContainer.height() + AreaTopTiles.height() : 0)
                        - editBorder
                        + 'px'
                });

            } else if ( slidingMode == 'overlay' ) {

                slideArea.css({
                    marginTop:
                        - (areaTopVisible ? AreaTopContainer.height() : 0)
                        - playerMargin
                        + 'px'
                });

                var targetOffset = playerMargin + (PlayerContainer.height()/2) + (OverlayTimeline.height()*2) + (Controls.height()/2);

                // slidingMode overlay bottom behaviour
                AreaBottomContainer.css({
                    marginTop: - (targetOffset + AreaBottomTiles.height() + (AreaBottomContainer.height() / 2)) + 'px'
                });

                AreaTopContainer.css({
                    marginTop: ''
                });

                AreaTopTiles.css({
                    marginTop: ''
                });

            }

        } else {

            slideArea.css({
                marginTop:
                    - (areaTopVisible ? AreaTopContainer.height() : 0)
                    - playerMargin
                    + 'px',
                minHeight:
                    $('#MainContainer').height()
                    + (areaTopVisible ? AreaTopContainer.height() : playerMargin)
                    + (areaBottomVisible ? AreaBottomContainer.height() : playerMargin)
                    - editBorder
                    + 'px'
            });

            AreaBottomContainer.css({
                marginTop: ''
            });

            AreaBottomTiles.css({
                marginTop: ''
            });

            AreaTopContainer.css({
                marginTop: ''
            });

            AreaTopTiles.css({
                marginTop: ''
            });

        }

        if ( editMode != false && editMode != 'preview' ) {
            slideArea.css({
                minHeight: ''
            });
            PlayerContainer.css({
                marginBottom: 0
            });
            EditingOptions.find('.ui-tabs').tabs('refresh');
        } else {
            PlayerContainer.css({
                marginBottom: ''
            });
        }

        domElement.find('#PlayerProgress .ui-slider-handle-circle').css({
            bottom:
                Controls.height()
            +   CodeSnippetTimeline.height()
            +   ((editMode == 'codesnippets') ? 6 : OverlayTimeline.height())
            +   (areaBottomTimelineVisible ? AreaBottomTimeline.height() : 0)
        });

        slideArea.children('svg').css({
            width: $(document).width() + 'px',
            height: slideArea.height() + 'px'
        });

    };



    /**
     * I re-adjust the CSS of the main video and its container (without surrounding elements).
     * I try to fill the available space to fit the video elements.
     *
     * Also I try to animate the transition of the dimensions smoothly, when my single parameter is true.
     *
     * @method adjustHypervideo
     * @param {Boolean} animate
     */
    function adjustHypervideo(animate) {


        var editBorder = (FrameTrail.getState('editMode') != false) ? (parseInt(domElement.css('borderTopWidth'))*2) : 0;
            mainContainerWidth  = $(window).width()
                                    - ((FrameTrail.getState('sidebarOpen') && !FrameTrail.getState('fullscreen')) ? FrameTrail.module('Sidebar').width : 0)
                                    - editBorder,
            mainContainerHeight = $(window).height()
                                    - $('#Titlebar').height()
                                    - editBorder,
            _video              = $(Video);

        if (animate) {
            VideoContainer.css({
                'transition-duration': '',
                '-moz-transition-duration': '',
                '-webkit-transition-duration': '',
                '-o-transition-duration': ''
            });
            Hypervideo.css({
                'transition-duration': '',
                '-moz-transition-duration': '',
                '-webkit-transition-duration': '',
                '-o-transition-duration': ''
            });
        } else {
            VideoContainer.css({
                'transition-duration': '0ms',
                '-moz-transition-duration': '0ms',
                '-webkit-transition-duration': '0ms',
                '-o-transition-duration': '0ms'
            });
            Hypervideo.css({
                'transition-duration': '0ms',
                '-moz-transition-duration': '0ms',
                '-webkit-transition-duration': '0ms',
                '-o-transition-duration': '0ms'
            });
        }

        var widthAuto = (_video[0].style.width == 'auto');
        var heightAuto = (_video[0].style.height == 'auto');

        var videoContainerWidth;

        if ( FrameTrail.getState('hv_config_areaRightVisible') || ( FrameTrail.getState('editMode') != false && FrameTrail.getState('editMode') != 'preview' ) ) {
            videoContainerWidth = mainContainerWidth - domElement.find('#InfoAreaRight').outerWidth();
        } else {
            videoContainerWidth = mainContainerWidth;
        }

        VideoContainer.width(videoContainerWidth);

        if ( (_video.height() < VideoContainer.height() && widthAuto) || (_video.width() < videoContainerWidth && heightAuto) ) {
            _video.css({
                height: FrameTrail.getState('viewSize')[1] + 'px',
                width: FrameTrail.getState('viewSize')[0] + 'px'
            });
        }

        if (_video.height() >= VideoContainer.height()) {
            _video.css({
                height: VideoContainer.height() + 'px',
                width: 'auto'
            });
        }

        if (_video.width() >= videoContainerWidth) {
            _video.css({
                height: 'auto',
                width: videoContainerWidth + 'px'
            });
        }

        Hypervideo.css({
            marginLeft: - _video.width()/2 + 'px',
            marginTop: - _video.height()/2 + 'px',
            height: _video.height()
        });

        if (animate) {
            window.setTimeout(function() {
                FrameTrail.module('OverlaysController').rescaleOverlays();
                FrameTrail.module('AnnotationsController').rescaleAnnotations();
            }, 220);
        } else {
            FrameTrail.module('OverlaysController').rescaleOverlays();
            FrameTrail.module('AnnotationsController').rescaleAnnotations();
        }

    };


    /**
     * I react to a change of the global state "fullscreen".
     * @method toggleFullscreen
     * @param {Boolean} aBoolean
     */
    function toggleFullscreen(aBoolean) {

        if (aBoolean) {
            $('#FullscreenButton').addClass('active');
            $('#MainContainer').addClass('inFullscreen');
        } else {
            $('#FullscreenButton').removeClass('active');
            $('#MainContainer').removeClass('inFullscreen');
        }

    };


    /**
     * I react to a change of the global state "unsavedChanges".
     * @method toogleUnsavedChanges
     * @param {Boolean} aBoolean
     */
    function toogleUnsavedChanges(aBoolean) {


    };


    /**
     * I react to a change in the global state "viewMode".
     * @method toggleViewMode
     * @param {String} viewMode
     */
    function toggleViewMode(viewMode) {

        if (viewMode === 'video') {
            domElement.addClass('active');
            FrameTrail.module('Titlebar').title = FrameTrail.module('HypervideoModel').hypervideoName;
            adjustLayout();
            adjustHypervideo();
        } else if (viewMode != 'resources') {
            domElement.removeClass('active');
        }

    };


    /**
     * I react to a change in the global state "editMode".
     * @method toggleEditMode
     * @param {} editMode
     * @return
     */
    function toggleEditMode(editMode) {

        resetEditMode();

        switch (editMode) {
            case false:
                HypervideoSettingsContainer.empty();
                HypervideoLayoutContainer.empty();
                leaveEditMode();
                break;
            case 'preview':
                leaveEditMode();
                enterPreviewMode();
                break;
            case 'settings':
                enterSettingsMode();
                break;
            case 'layout':
                enterLayoutMode();
                break;
            case 'overlays':
                enterOverlayMode();
                break;
            case 'audio':
                enterAudioMode();
                break;
            case 'links':
                enterLinkMode();
                break;
            case 'codesnippets':
                enterCodeSnippetMode();
                break;
            case 'annotations':
                enterAnnotationMode();
                break;
        }

        if ( editMode && !VideoStartOverlay.hasClass('inactive') ) {
            VideoStartOverlay.addClass('inactive').fadeOut();
        }

        window.setTimeout(function() {
            FrameTrail.changeState('viewSizeChanged');
        }, 300);

    };

    /**
     * I am called, whenever the editMode changes, to restore the default timeline.
     * @method resetEditMode
     */
    function resetEditMode() {
        domElement.find('.timeline').removeClass('editable').css('flex-basis', '');
        HypervideoSettingsContainer.removeClass('active');
        HypervideoLayoutContainer.removeClass('active');
    }

    /**
     * I prepare the several UI elements, when one of the editMode is started.
     * @method initEditMode
     */
    function initEditMode() {

        ExpandButton.hide();

        $(VideoContainer).css({
            opacity: 1
        });

        domElement.find('#InfoAreaRight').css({
            opacity: 1
        });

        AreaBottomTiles.hide();
        AreaBottomContainer.hide();
        AreaTopTiles.hide();
        AreaTopContainer.hide();

        domElement.find('.timeline').not('#CodeSnippetTimeline').show();

        EditingOptions.addClass('active');

        if ( FrameTrail.getState('hv_config_areaRightVisible') ) {
            HypervideoContainer.find('#AnnotationPreviewContainer').hide();
        }

        domElement.find('#InfoAreaRight').show();
        EditPropertiesContainer.show();

        Controls.find('#RightControlPanel').hide();

    }

    /**
     * I restore the UI elements to the view mode with no editing features activated.
     * @method leaveEditMode
     */
    function leaveEditMode() {
        EditingOptions.removeClass('active');
        HypervideoSettingsContainer.removeClass('active');
        HypervideoLayoutContainer.removeClass('active');
        EditPropertiesContainer.removeAttr('data-editmode').hide();

        toggleConfig_areaBottomVisible(FrameTrail.getState('hv_config_areaBottomVisible'));
        toggleConfig_areaTopVisible(FrameTrail.getState('hv_config_areaTopVisible'));

        //toggleConfig_areaRightVisible(FrameTrail.getState('hv_config_areaRightVisible'));

        toggleConfig_overlaysVisible(FrameTrail.getState('hv_config_overlaysVisible'));

        toggleConfig_slidingMode(FrameTrail.getState('hv_config_slidingMode'));

        changeSlidePosition(FrameTrail.getState('slidePosition'));

        Controls.find('#RightControlPanel').show();
    }

    /**
     * I am called when the app enters the editMode "preview"
     * @method enterPreviewMode
     */
    function enterPreviewMode() {

    }

    /**
     * I am called when the app enters the editMode "settings"
     * @method enterSettingsMode
     */
    function enterSettingsMode() {
        FrameTrail.module('HypervideoModel').initHypervideoSettings();
        HypervideoSettingsContainer.addClass('active');
    }

    /**
     * I am called when the app enters the editMode "layout"
     * @method enterLayoutMode
     */
    function enterLayoutMode() {
        console.log('INIT VIEWLAYOUT / LAYOUT MANAGER');
        HypervideoLayoutContainer.addClass('active');
    }

    /**
     * I am called when the app enters the editMode "overlays"
     * @method enterOverlayMode
     */
    function enterOverlayMode() {
        initEditMode();
        OverlayTimeline.addClass('editable');
        toggleConfig_overlaysVisible(true);

        EditPropertiesContainer
            .html('<span class="icon-overlays"></span><div class="message active">Add overlays by dragging resources into the video area.</div>')
            .attr('data-editmode', 'overlays');
    }

    /**
     * I am called when the app enters the editMode "audio"
     * @method enterAudioMode
     */
    function enterAudioMode() {
        initEditMode();
    }

    /**
     * I am called when the app enters the editMode "links"
     * @method enterLinkMode
     */
    function enterLinkMode() {
        initEditMode();
        AreaTopTimeline.addClass('editable');

        EditPropertiesContainer
            .html('<span class="icon-videolinks"></span><div class="message active">Add video links by dragging hypervideos into the active timeline or entering a link manually.</div>')
            .attr('data-editmode', 'links');
    }

    /**
     * I am called when the app enters the editMode "codesnippets"
     * @method enterCodeSnippetMode
     */
    function enterCodeSnippetMode() {
        initEditMode();
        CodeSnippetTimeline.addClass('editable');

        EditPropertiesContainer
            .html('<span class="icon-code"></span><div class="message active">Add custom code by dragging Code Snippets into the active timeline, add "Custom CSS" rules, or react to events by editing the "onReady", "onPlay", "onPause" and "onEnded" tabs.</div>')
            .attr('data-editmode', 'codesnippets');
    }

    /**
     * I am called when the app enters the editMode "annotations"
     * @method enterAnnotationMode
     */
    function enterAnnotationMode() {
        initEditMode();
        AreaBottomTimeline.addClass('editable');

        EditPropertiesContainer
            .html('<span class="icon-annotations"></span><div class="message active">Add annotations by dragging resources into the active timeline.</div>')
            .attr('data-editmode', 'annotations');
    }

    /**
     * I am called when the global state "hv_config_areaTopVisible" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_areaTopVisible
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_areaTopVisible(newState, oldState) {
        if (newState == true) {
            domElement.find('#AreaTopTiles, #AreaTopContainer, #AreaTopTimeline').show();
            Controls.find('[data-config="hv_config_areaTopVisible"]').addClass('active');
        } else {
            domElement.find('#AreaTopTiles, #AreaTopContainer, #AreaTopTimeline').hide();
            Controls.find('[data-config="hv_config_areaTopVisible"]').removeClass('active');
        }
        if ( FrameTrail.getState('slidePosition') != 'middle' ) {
            FrameTrail.changeState('slidePosition', 'middle');
        }
    };

    /**
     * I am called when the global state "hv_config_areaBottomVisible" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_areaBottomVisible
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_areaBottomVisible(newState, oldState) {
        if (newState == true) {
            domElement.find('#AreaBottomTiles, #AreaBottomContainer, #AreaBottomTimeline').show();
            Controls.find('[data-config="hv_config_areaBottomVisible"]').addClass('active');
        } else {
            domElement.find('#AreaBottomTiles, #AreaBottomContainer, #AreaBottomTimeline').hide();
            Controls.find('[data-config="hv_config_areaBottomVisible"]').removeClass('active');
        }
        if ( FrameTrail.getState('slidePosition') != 'middle' ) {
            FrameTrail.changeState('slidePosition', 'middle');
        }
    };

    /**
     * I am called when the global state "hv_config_areaLeftVisible" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_areaLeftVisible
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_areaLeftVisible(newState, oldState) {
        if (newState == true) {
            console.log('LayoutArea left visible');
            Controls.find('[data-config="hv_config_areaLeftVisible"]').addClass('active');

        } else {
            console.log('LayoutArea left hidden');
            Controls.find('[data-config="hv_config_areaLeftVisible"]').removeClass('active');
        }
    };

    /**
     * I am called when the global state "hv_config_areaRightVisible" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_areaRightVisible
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_areaRightVisible(newState, oldState) {
        if (newState == true) {
            HypervideoContainer.find('#InfoAreaRight').show();
            HypervideoContainer.find('#AnnotationPreviewContainer').show();
            Controls.find('[data-config="hv_config_areaRightVisible"]').addClass('active');

        } else {
            domElement.find('#InfoAreaRight').hide();
            HypervideoContainer.find('#AnnotationPreviewContainer').hide();
            Controls.find('[data-config="hv_config_areaRightVisible"]').removeClass('active');
        }
    };

    /**
     * I am called when the global state "hv_config_overlaysVisible" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_overlaysVisible
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_overlaysVisible(newState, oldState) {
        if (newState == true) {
            OverlayContainer.show();
            Controls.find('[data-config="hv_config_overlaysVisible"]').addClass('active');
        } else {
            OverlayContainer.hide();
            Controls.find('[data-config="hv_config_overlaysVisible"]').removeClass('active');
        }
    };

    /**
     * I am called when the global state "hv_config_annotationsPosition" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_annotationsPosition
     * @param {String} newState
     * @param {String} oldState
     */
    /*
    function toggleConfig_annotationsPosition(newState, oldState) {

        if ( FrameTrail.getState('slidePosition') != 'middle' ) {
            FrameTrail.changeState('slidePosition', 'middle');
        }

        if (newState == "top") {

            PlayerContainer.before(AreaBottomTiles);
            AreaBottomTiles.before(AreaBottomContainer);
            PlayerProgress.before(areaBottomTimeline);

            PlayerContainer.after(AreaTopTiles);
            AreaTopTiles.after(AreaTopContainer);
            Controls.after(areaTopTimeline);

            Controls.find('#SettingsContainer #PlayerWrapper')
                    .after(Controls.find('div[data-config="hv_config_areaTopVisible"]'))
                    .before(Controls.find('div[data-config="hv_config_areaBottomVisible"]'));

        } else {

            PlayerContainer.before(AreaTopTiles);
            AreaTopTiles.before(AreaTopContainer);
            PlayerProgress.before(areaTopTimeline);

            PlayerContainer.after(AreaBottomTiles);
            AreaBottomTiles.after(AreaBottomContainer);
            Controls.after(areaBottomTimeline);

            Controls.find('#SettingsContainer #PlayerWrapper')
                    .before(Controls.find('div[data-config="hv_config_areaTopVisible"]'))
                    .after(Controls.find('div[data-config="hv_config_areaBottomVisible"]'));

        }
    };
    */

    /**
     * I am called when the global state "hv_config_autohideControls" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_autohideControls
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_autohideControls(newState, oldState) {

    };


    /**
     * I am called when the global state "hv_config_slidingMode" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_slidingMode
     * @param {String} newState
     * @param {String} oldState
     */
    function toggleConfig_slidingMode(newState, oldState) {

        if ( FrameTrail.getState('slidePosition') != 'middle' ) {
            FrameTrail.changeState('slidePosition', 'middle');
        }

        adjustLayout();
        adjustHypervideo();

        if (newState == 'overlay') {

            Controls.find('[data-config="hv_config_slidingMode"]').addClass('active');

        } else {

            Controls.find('[data-config="hv_config_slidingMode"]').removeClass('active');

        }

    };


    /**
     * I am called when the global state "hv_config_slidingTrigger" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_slidingTrigger
     * @param {String} newState
     * @param {String} oldState
     */
    function toggleConfig_slidingTrigger(newState, oldState) {

    };


    /**
     * I am called when the global state "hv_config_captionsVisible" changes.
     *
     * This is a configuration option (saved in the hypervideo's index.json entry).
     *
     * @method toggleConfig_captionsVisible
     * @param {Boolean} newState
     * @param {Boolean} oldState
     */
    function toggleConfig_captionsVisible(newState, oldState) {
        if (newState == true && Controls.find('#CaptionsButton').find('.captionSelect[data-lang="'+ FrameTrail.module('HypervideoModel').selectedLang +'"]').length > 0 ) {
            Controls.find('#CaptionsButton').addClass('active');
            Controls.find('#CaptionsButton').find('.captionSelect').removeClass('active');
            Controls.find('#CaptionsButton').find('.captionSelect[data-lang="'+ FrameTrail.module('HypervideoModel').selectedLang +'"]').addClass('active');
            CaptionContainer.show();
        } else {
            Controls.find('#CaptionsButton').removeClass('active');
            Controls.find('#CaptionsButton').find('.captionSelect').removeClass('active');
            Controls.find('#CaptionsButton').find('.captionSelect.none').addClass('active');
            CaptionContainer.hide();
        }
    };


    /**
     * I am called when the global state "slidePosition" changes.
     *
     * This state is either "top", "middle" or "bottom", and indicates, which area has the most visual weight.
     * The Hypervideocontainer is always displayed in the middle (in different sizes), while the annotations
     * and the video links can change their position (top or bottom), as defined in the hypervideo's _index.json.
     *
     * @method changeSlidePosition
     * @param {String} newState
     * @param {String} oldState
     */
    function changeSlidePosition(newState, oldState) {
        adjustLayout();
        adjustHypervideo();
        window.setTimeout(function() {
            adjustLayout();
            adjustHypervideo();
        }, 300);

        if ( FrameTrail.getState('editMode') && FrameTrail.getState('editMode') != 'preview' ) return;

        if ( newState != 'middle' ) {
            ExpandButton.show();
        } else {
            ExpandButton.hide();
        }

        if (  ( FrameTrail.getState('hv_config_annotationsPosition') == 'bottom'
             && newState == 'bottom' ) ||
              ( FrameTrail.getState('hv_config_annotationsPosition') == 'top'
             && newState == 'top') ) {

            shownDetails = 'annotations';
            AreaBottomContainer.find('.resourceDetail[data-type="location"]').each(function() {
                if ( $(this).data('map') ) {
                    $(this).data('map').updateSize();
                }
            });

        } else if ( newState != 'middle' ) {
            shownDetails = 'videolinks';
        } else {
            shownDetails = null;
        }

        if ( newState != oldState && FrameTrail.getState('hv_config_slidingMode') == 'overlay' ) {

            if ( shownDetails != null ) {

                $(VideoContainer).animate({
                    opacity: 0.2
                }, 500);

                domElement.find('#InfoAreaRight').animate({
                    opacity: 0.2
                }, 500);

                wasPlaying = FrameTrail.module('HypervideoController').isPlaying;

                window.setTimeout(function() {
                    FrameTrail.module('HypervideoController').pause();
                }, 500);

            } else if ( wasPlaying ) {

                $(VideoContainer).animate({
                    opacity: 1
                }, 500);

                domElement.find('#InfoAreaRight').animate({
                    opacity: 1
                }, 500);

                window.setTimeout(function() {
                    FrameTrail.module('HypervideoController').play();
                }, 500);

            } else {
                $(VideoContainer).animate({
                    opacity: 1
                }, 500);

                domElement.find('#InfoAreaRight').animate({
                    opacity: 1
                }, 500);
            }


        }
    };

    /**
     * This method changes the global state "slidePosition" from "bottom" to "middle"
     * or from "middle" to "top".
     * @method slidePositionUp
     */
    function slidePositionUp() {

        var slidePosition = FrameTrail.getState('slidePosition');

        if ( slidePosition == 'middle' && FrameTrail.getState('hv_config_areaTopVisible') ) {
            FrameTrail.changeState('slidePosition', 'top');
        } else if ( slidePosition == 'bottom' ) {
            FrameTrail.changeState('slidePosition', 'middle')
        }

    };

    /**
     * This method changes the global state "slidePosition" from "top" to "middle"
     * or from "middle" to "bottom".
     * @method slidePositionDown
     */
    function slidePositionDown() {

        var slidePosition = FrameTrail.getState('slidePosition');

        if ( slidePosition == 'top' ) {
            FrameTrail.changeState('slidePosition', 'middle');
        } else if ( slidePosition == 'middle' && FrameTrail.getState('hv_config_areaBottomVisible') ) {
            FrameTrail.changeState('slidePosition', 'bottom');
        }

    };


    /**
     * This method is used to show the details (aka the content) of either the LayoutArea top or bottom.
     * 
     * @method showDetails
     * @param {String} area
     */
    function showDetails(area) {

        shownDetails = area;

        if (!area) {
            FrameTrail.changeState('slidePosition', 'middle');
        } else if ( area == 'top' && FrameTrail.getState('hv_config_areaTopVisible') ) {
                FrameTrail.changeState('slidePosition', 'top');
        } else if ( area == 'bottom' && FrameTrail.getState('hv_config_areaBottomVisible') ) {
            FrameTrail.changeState('slidePosition', 'bottom');
        }

    };


    /**
     * Toggles the visibility of a vertical grid based on the positions of all timeline items
     * in each category (Videolinks, Overlays, Annotations). This grid is used to allow snapping
     * items to positions of other timeline items.
     *
     * @method toggleGrid
     * @param {Boolean} visible
     */
    function toggleGrid(visible) {

        if ( !FrameTrail.getState('editMode') || FrameTrail.getState('editMode') == 'preview' ) {
            return;
        }

        var timelineItems = $('.timelineElement').not('.ui-draggable'),
            draggableElements = $('.timelineElement.ui-draggableable');
            GridContainer = $('<div id="GridContainer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 3"></div>');


        if ( visible ) {

            for (var i = 0; i < timelineItems.length; i++) { // vertical grid lines

                var position = $(timelineItems[i]).position();

                $('<div class="gridline"></div>').css({
                    'position': 'absolute',
                    'top': 0,
                    'left': position.left,
                    'width': 1,
                    'height': 100 + '%',
                    'background-color': '#ff9900'
                }).appendTo(GridContainer);

                $('<div class="gridline"></div>').css({
                    'position': 'absolute',
                    'top': 0,
                    'left': position.left + $(timelineItems[i]).width(),
                    'width': 1,
                    'height': 100 + '%',
                    'background-color': '#ff9900'
                }).appendTo(GridContainer);

            }

            GridContainer.appendTo(PlayerProgress);

        } else {

            PlayerProgress.find('#GridContainer').remove();

        }

    };

    /**
     * Toggles the visibility of the working (loading) indicator.
     *
     * @method toggleVideoWorking
     * @param {Boolean} working
     */
    function toggleVideoWorking(working) {

        if ( working ) {

            WorkingIndicator.show();

        } else {

            WorkingIndicator.hide();

        }

    };

    /**
     * I return the closest element from a given position {top: XX, left: XX} in a collection.
     *
     * @method closestToOffset
     * @param {Object} collection
     * @param {Object} position
     */
    function closestToOffset(collection, position) {
        var el = null, elOffset, x = position.left, y = position.top, distance, dx, dy, minDistance;
        collection.each(function() {
            elOffset = $(this).position();

            if (
            (x >= elOffset.left)  && (x <= elOffset.right) &&
            (y >= elOffset.top)   && (y <= elOffset.bottom)
            ) {
                el = $(this);
                return false;
            }

            var offsets = [[elOffset.left, elOffset.top], [elOffset.right, elOffset.top], [elOffset.left, elOffset.bottom], [elOffset.right, elOffset.bottom]];
            for (off in offsets) {
                dx = offsets[off][0] - x;
                dy = offsets[off][1] - y;
                distance = Math.sqrt((dx*dx) + (dy*dy));
                if (minDistance === undefined || distance < minDistance) {
                    minDistance = distance;
                    el = $(this);
                }
            }
        });
        return el;
    };

    /**
     *  Toggle (Enter / Exit) native Fullscreen State
     *
     * @method toggleNativeFullscreenState
     */
    function toggleNativeFullscreenState() {

        var element = $('#MainContainer')[0];

        if (element.requestFullScreen) {
            if (!document.fullScreen) {
                element.requestFullscreen();
            } else {
                document.exitFullScreen();
            }
        } else if (element.mozRequestFullScreen) {
            if (!document.mozFullScreen) {
                element.mozRequestFullScreen();
            } else {
                document.mozCancelFullScreen();
            }
        } else if (element.webkitRequestFullScreen) {
            if (!document.webkitIsFullScreen) {
                element.webkitRequestFullScreen();
            } else {
                document.webkitCancelFullScreen();
            }
        }

    }

    /**
     * Toggle internal Fullscreen State
     *
     * @method toggleFullscreenState
     */
    function toggleFullscreenState() {

        var element = $('#MainContainer')[0];

        if (element.requestFullScreen) {
            if (!document.fullScreen) {
                FrameTrail.changeState('fullscreen', false);
            } else {
                FrameTrail.changeState('fullscreen', true);
            }

        } else if (element.mozRequestFullScreen) {
            if (!document.mozFullScreen) {
                FrameTrail.changeState('fullscreen', false);
            } else {
                FrameTrail.changeState('fullscreen', true);
            }
        } else if (element.webkitRequestFullScreen) {
            if (!document.webkitIsFullScreen) {
                FrameTrail.changeState('fullscreen', false);
            } else {
                FrameTrail.changeState('fullscreen', true);
            }
        }

        setTimeout(function() {
            $(window).resize();
        }, 1000);

    }


    return {

        onChange: {

            viewSize:        changeViewSize,
            viewSizeChanged: onViewSizeChanged,
            fullscreen:      toggleFullscreen,
            viewMode:        toggleViewMode,
            editMode:        toggleEditMode,
            slidePosition:   changeSlidePosition,
            xKey:            toggleGrid,
            videoWorking:    toggleVideoWorking,

            hv_config_areaTopVisible:               toggleConfig_areaTopVisible,
            hv_config_areaBottomVisible:            toggleConfig_areaBottomVisible,
            hv_config_areaLeftVisible:              toggleConfig_areaLeftVisible,
            hv_config_areaRightVisible:             toggleConfig_areaRightVisible,
            hv_config_autohideControls:             toggleConfig_autohideControls,
            hv_config_overlaysVisible:              toggleConfig_overlaysVisible,
            hv_config_slidingMode:                  toggleConfig_slidingMode,
            hv_config_slidingTrigger:               toggleConfig_slidingTrigger,
            hv_config_captionsVisible:              toggleConfig_captionsVisible
        },


        create:                  create,
        toggleSidebarOpen:       toggleSidebarOpen,
        adjustLayout:            adjustLayout,
        adjustHypervideo:        adjustHypervideo,
        toggleFullscreenState:   toggleFullscreenState,

        slidePositionUp:         slidePositionUp,
        slidePositionDown:       slidePositionDown,
        closestToOffset:         closestToOffset,

        /**
         * I display a (formated time) string in an area of the progress bar.
         * @attribute currentTime
         * @type String
         */
        set currentTime(aString) { return CurrentTime.text(aString)   },
        /**
         * I display a (formated time) string in an area of the progress bar.
         * @attribute duration
         * @type String
         */
        set duration(aString)    { return TotalDuration.text(aString) },

        /**
         * I contain the HypervideoContainer element.
         * @attribute HypervideoContainer
         * @type HTMLElement
         */
        get HypervideoContainer() { return HypervideoContainer },

        /**
         * I contain the Video element.
         * @attribute Video
         * @type HTMLElement
         */
        get Video()             { return Video          },
        /**
         * I contain the CaptionContainer element.
         * @attribute CaptionContainer
         * @type HTMLElement
         */
        get CaptionContainer()  { return CaptionContainer },
        /**
         * I contain the progress bar element.
         * @attribute PlayerProgress
         * @type HTMLElement
         */
        get PlayerProgress()    { return PlayerProgress },
        /**
         * I contain the play button element.
         * @attribute PlayButton
         * @type HTMLElement
         */
        get PlayButton()        { return PlayButton     },
        /**
         * I contain the start overlay element (containing the big play button).
         * @attribute VideoStartOverlay
         * @type HTMLElement
         */
        get VideoStartOverlay() { return VideoStartOverlay },
        /**
         * I contain the EditingOptions element (where e.g. the ResourcePicker is rendered).
         * @attribute EditingOptions
         * @type HTMLElement
         */
        get EditingOptions()    { return EditingOptions },
        /**
         * I contain the HypervideoSettingsContainer element.
         * @attribute HypervideoSettingsContainer
         * @type HTMLElement
         */
        get HypervideoSettingsContainer()    { return HypervideoSettingsContainer },
        /**
         * I contain the HypervideoLayoutContainer element.
         * @attribute HypervideoLayoutContainer
         * @type HTMLElement
         */
        get HypervideoLayoutContainer()    { return HypervideoLayoutContainer },
        /**
         * I contain the OverlayContainer element.
         * @attribute OverlayContainer
         * @type HTMLElement
         */
        get OverlayContainer()  { return OverlayContainer },
        /**
         * I contain the OverlayTimeline element.
         * @attribute OverlayTimeline
         * @type HTMLElement
         */
        get OverlayTimeline()   { return OverlayTimeline  },

        /**
         * I contain the CodeSnippetTimeline element.
         * @attribute CodeSnippetTimeline
         * @type HTMLElement
         */
        get CodeSnippetTimeline()  { return CodeSnippetTimeline  },

        /**
         * I contain the AreaTopContainer element.
         * @attribute AreaTopContainer
         * @type HTMLElement
         */
        get AreaTopContainer() { return AreaTopContainer },
        /**
         * I contain the AreaTopTiles element.
         * @attribute AreaTopTiles
         * @type HTMLElement
         */
        get AreaTopTiles()     { return AreaTopTiles     },
        /**
         * I contain the AreaTopTileSlider element.
         * @attribute AreaTopTileSlider
         * @type HTMLElement
         */
        get AreaTopTileSlider()     { return AreaTopTileSlider },
        /**
         * I contain the areaTopTimeline element.
         * @attribute areaTopTimeline
         * @type HTMLElement
         */
        get AreaTopTimeline()  { return AreaTopTimeline  },

        /**
         * I contain the AreaBottomContainer element.
         * @attribute AreaBottomContainer
         * @type HTMLElement
         */
        get AreaBottomContainer() { return AreaBottomContainer    },
        /**
         * I contain the AreaBottomTiles element.
         * @attribute AreaBottomTiles
         * @type HTMLElement
         */
        get AreaBottomTiles()     { return AreaBottomTiles     },
        /**
         * I contain the AreaBottomTileSlider element.
         * @attribute AreaBottomTileSlider
         * @type HTMLElement
         */
        get AreaBottomTileSlider()  { return AreaBottomTileSlider     },
        /**
         * I contain the AreaBottomTimeline element.
         * @attribute AreaBottomTimeline
         * @type HTMLElement
         */
        get AreaBottomTimeline()  { return AreaBottomTimeline  },
        /**
         * I contain the AnnotationPreviewContainer element.
         * @attribute AnnotationPreviewContainer
         * @type HTMLElement
         */
        get AnnotationPreviewContainer()  { return AnnotationPreviewContainer  },

        /**
         * I contain the EditPropertiesContainer element (where properties of an overlay/annotation/videolink can be viewed and – in the case ov overlays – changed).
         * @attribute EditPropertiesContainer
         * @type HTMLElement
         */
        get EditPropertiesContainer() { return EditPropertiesContainer },


        /**
         * This attribute controls wether the view places its visual weight on "annotations" or "videolinks", or none of the both (null).
         * @attribute shownDetails
         * @type String or null
         */
        get shownDetails()     { return shownDetails },
        set shownDetails(mode) { return showDetails(mode) },


        /**
         * I contain the AnnotationSettingsButton element.
         * @attribute AnnotationSettingsButton
         * @type HTMLElement
         */
        get AnnotationSettingsButton() { return AnnotationSettingsButton },

        /**
         * I contain the ExpandButton element.
         * @attribute ExpandButton
         * @type HTMLElement
         */
        get ExpandButton() { return ExpandButton },

        /**
         * I contain the CaptionsButton element, including the list of available subtitles.
         * @attribute CaptionsButton
         * @type HTMLElement
         */
        get CaptionsButton() { return Controls.find('#CaptionsButton') }

    };

});
