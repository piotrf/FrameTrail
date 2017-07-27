/**
 * @module Player
 */


/**
 * I am the Sidebar. I provide the basic navigation for the user interface.
 *
 * @class Sidebar
 * @static
 */



FrameTrail.defineModule('Sidebar', function(){


    

    var domElement  = $(      '<div id="Sidebar">'
                            + '    <div id="SidebarContainer">'
                            + '        <div data-viewmode="overview">'
                            + '            <div class="viewmodeControls">'
                            + '                <div class="viewModeActionButtonContainer">'
                            + '                    <button class="exportButton" data-tooltip-bottom-left="Export Project"><span class="icon-download"></span></button>'
                            + '                    <div style="clear: both;"></div>'
                            + '                </div>'
                            + '            </div>'
                            + '            <div class="viewmodeInfo">'
                            + '                <span id="ProjectDescription"></span>'
                            + '            </div>'
                            + '        </div>'
                            + '        <div data-viewmode="video">'
                            + '            <div class="viewmodeControls">'
                            + '                <div class="viewModeActionButtonContainer">'
                            + '                    <button class="saveButton" data-tooltip-bottom-left="Save changes"><span class="icon-floppy"></span></button>'
                            + '                    <button class="forkButton" data-tooltip-bottom-left="Fork Hypervideo"><span class="icon-hypervideo-fork"></span></button>'
                            + '                    <button class="exportButton" data-tooltip-bottom-left="Export Hypervideo"><span class="icon-download"></span></button>'
                            + '                    <button class="settingsButton" data-tooltip-bottom-left="Change Settings"><span class="icon-cog"></span></button>'
                            + '                    <div style="clear: both;"></div>'
                            + '                </div>'
                            + '                <button class="editMode" data-editmode="preview"><span class="icon-eye"></span>Preview</button>'
                            + '                <button class="editMode" data-editmode="layout"><span class="icon-news"></span>Layout</button>'
                            /*+ '                <button class="editMode" data-editmode="links"><span class="icon-videolinks"></span>Video Links</button>'*/
                            + '                <button class="editMode" data-editmode="overlays"><span class="icon-overlays"></span>Overlays</button>'
                            + '                <button class="editMode" data-editmode="codesnippets"><span class="icon-code"></span>Custom Code</button>'
                            + '                <button class="editMode" data-editmode="annotations"><span class="icon-annotations"></span>My Annotations</button>'
                            + '            </div>'
                            + '            <div class="viewmodeInfo">'
                            + '                <span id="VideoDescription"></span>'
                            + '            </div>'
                            + '            <button id="HypervideoDeleteButton" data-tooltip-top-left="Delete Hypervideo"><span class="icon-trash"></span></button>'
                            /*
                            + '            <div id="SelectAnnotationContainer" class="ui-front">'
                            + '                <div class="descriptionLabel">Annotations</div>'
                            + '                <select id="SelectAnnotation" name=""></select>'
                            + '                <div id="SelectAnnotationSingle"></div>'
                            + '            </div>'
                            */
                            + '        </div>'
                            + '    </div>'
                            + '    </div>'
                            + '</div>'
                        ),

        sidebarContainer       = domElement.find('#SidebarContainer'),
        overviewContainer      = sidebarContainer.children('[data-viewmode="overview"]'),
        videoContainer         = sidebarContainer.children('[data-viewmode="video"]'),
        videoContainerInfo     = videoContainer.children('.viewmodeInfo'),
        videoContainerControls = videoContainer.children('.viewmodeControls'),
        resourcesContainer     = sidebarContainer.children('[data-viewmode="resources"]'),

        SaveButton             = domElement.find('.saveButton'),
        ForkButton             = domElement.find('.forkButton'),
        SettingsButton         = domElement.find('.settingsButton'),
        ExportButton           = domElement.find('.exportButton'),
        DeleteButton           = domElement.find('#HypervideoDeleteButton'),
        
        ProjectDescription     = sidebarContainer.find('#ProjectDescription'),
        VideoDescription       = sidebarContainer.find('#VideoDescription');


    SaveButton.click(function(){
        FrameTrail.module('HypervideoModel').save();
    });

    ForkButton.click(function(evt) {
        
        evt.preventDefault();
        evt.stopPropagation();

        var thisID = FrameTrail.module('RouteNavigation').hypervideoID,
            thisHypervideo = FrameTrail.module('Database').hypervideo,
            projectID = FrameTrail.module('RouteNavigation').projectID;

        var forkDialog = $('<div id="ForkHypervideoDialog" title="Fork Hypervideo">'
                         + '    <div class="message active">By forking a hypervideo, you create a copy for yourself that you are able to edit.</div>'
                         + '    <form method="POST" id="ForkHypervideoForm">'
                         + '        <input type="text" name="name" placeholder="Name of new Hypervideo" value="'+ thisHypervideo.name +'"><br>'
                         + '        <textarea name="description" placeholder="Description for new Hypervideo">'+ thisHypervideo.description +'</textarea><br>'
                         + '        <div class="message error"></div>'
                         + '    </form>'
                         + '</div>');

        forkDialog.find('#ForkHypervideoForm').ajaxForm({
            method:     'POST',
            url:        '../_server/ajaxServer.php',
            dataType:   'json',
            thisID: thisID,
            data: {'a': 'hypervideoClone', 'projectID': projectID, 'hypervideoID': thisID},
            beforeSubmit: function (array, form, options) {
                
                var currentData = FrameTrail.module("Database").convertToDatabaseFormat(thisID);

                //console.log(currentData);
                currentData.meta.name = $('#ForkHypervideoForm').find('input[name="name"]').val();
                currentData.meta.description = $('#ForkHypervideoForm').find('textarea[name="description"]').val();
                currentData.meta.creator = FrameTrail.module('Database').users[FrameTrail.module('UserManagement').userID].name;
                currentData.meta.creatorId = FrameTrail.module('UserManagement').userID;
                
                array.push({ name: 'src', value: JSON.stringify(currentData, null, 4) });

            },
            success: function(response) {
                switch(response['code']) {
                    case 0:
                        // TODO: UPDATE LIST / HYPERVIDEO OBJECT IN CLIENT! @Michi
                        forkDialog.dialog('close');
                        FrameTrail.module('Database').loadHypervideoData(
                            function(){
                                FrameTrail.module('ViewOverview').refreshList();
                                alert('TODO: switch to new hypervideo');
                            },
                            function(){}
                        );

                        break;
                    default:
                        //TODO: push nice error texts into error box.
                        forkDialog.find('.message.error').addClass('active').html('Fatal error!');
                        break;
                }
            }
        });

        forkDialog.dialog({
            modal: true,
            resizable: false,
            close: function() {
                $(this).dialog('close');
                $(this).remove();
            },
            buttons: [
                { text: 'Fork Hypervideo',
                    click: function() {
                        
                        $('#ForkHypervideoForm').submit();

                    }
                },
                { text: 'Cancel',
                    click: function() {
                        $( this ).dialog( 'close' );
                    }
                }
            ]
        });

    });

    SettingsButton.click(function(evt) {

        evt.preventDefault();
        evt.stopPropagation();

        var thisID = FrameTrail.module('RouteNavigation').hypervideoID,
            hypervideos = FrameTrail.module('Database').hypervideos,
            projectID = FrameTrail.module('RouteNavigation').projectID;

        var optionDialog = $('<div id="EditHypervideoDialog" title="Hypervideo Options">'
                         + '    <form method="POST" id="EditHypervideoForm">'
                         + '        <div class="hypervideoData">'
                         + '            <div>Hypervideo Settings:</div>'
                         + '            <input type="text" name="name" placeholder="Name of Hypervideo" value="'+hypervideos[thisID]["name"]+'"><br>'
                         + '            <textarea name="description" placeholder="Description for Hypervideo">'+hypervideos[thisID]["description"]+'</textarea><br>'
                         + '            <input type="checkbox" name="hidden" id="hypervideo_hidden" value="hidden" '+((hypervideos[thisID]["hidden"].toString() == "true") ? "checked" : "")+'>'
                         + '            <label for="hypervideo_hidden">Hidden from other users?</label>'
                         + '        </div>'
                         + '        <div class="hypervideoLayout">'
                         + '            <div>Player Layout:</div>'
                         + '            <div class="settingsContainer">'
                         + '                <div class="layoutSettingsWrapper">'
                         + '                    <div data-config="videolinksVisible" class="'+ ((hypervideos[thisID]['config']['videolinksVisible'].toString() == 'true') ? 'active' : '') +'">Videolinks'
                         + '                        <div data-config="annotationsPosition" class="'+ ((hypervideos[thisID]['config']['annotationsPosition'].toString() == 'bottom') ? 'active' : '') +'"><span class="icon-sort"></span></div>'
                         + '                    </div>'
                         + '                    <div class="playerWrapper">'
                         + '                        <div data-config="overlaysVisible" class="'+ ((hypervideos[thisID]['config']['overlaysVisible'].toString() == 'true') ? 'active' : '') +'">Overlays</div>'
                         + '                        <div data-config="annotationPreviewVisible" class="'+ ((hypervideos[thisID]['config']['annotationPreviewVisible'].toString() == 'true') ? 'active' : '') +'">Annotation-Preview</div>'
                         + '                    </div>'
                         + '                    <div data-config="annotationsVisible" class="'+ ((hypervideos[thisID]['config']['annotationsVisible'].toString() == 'true') ? 'active' : '') +'">Annotations'
                         + '                        <div data-config="annotationsPosition" class="'+ ((hypervideos[thisID]['config']['annotationsPosition'].toString() == 'bottom') ? 'active' : '') +'"><span class="icon-sort"></span></div>'
                         + '                    </div>'
                         + '                </div>'
                         + '                <div class="genericSettingsWrapper">Layout Mode'
                         + '                    <div data-config="slidingMode" class="'+ ((hypervideos[thisID]['config']['slidingMode'].toString() == 'overlay') ? 'active' : '') +'">'
                         + '                        <div class="slidingMode" data-value="adjust">Adjust</div>'
                         + '                        <div class="slidingMode" data-value="overlay">Overlay</div>'
                         + '                    </div>'
                         + '                </div>'
                         + '            </div>'
                         + '            <div class="subtitlesSettingsWrapper">'
                         + '                <span>Subtitles</span>'
                         + '                <button id="SubtitlesPlus" type="button">Add +</button>'
                         + '                <input type="checkbox" name="config[captionsVisible]" id="captionsVisible" value="true" '+((hypervideos[thisID]['config']['captionsVisible'] && hypervideos[thisID]['config']['captionsVisible'].toString() == 'true') ? "checked" : "")+'>'
                         + '                <label for="captionsVisible">Show by default (if present)</label>'
                         + '                <div id="ExistingSubtitlesContainer"></div>'
                         + '                <div id="NewSubtitlesContainer"></div>'
                         + '            </div>'
                         + '        </div>'
                         + '        <div style="clear: both;"></div>'
                         + '        <div class="message error"></div>'
                         + '    </form>'
                         + '</div>');


        if ( hypervideos[thisID].subtitles ) {

            var langMapping = FrameTrail.module('Database').subtitlesLangMapping;

            for (var i=0; i < hypervideos[thisID].subtitles.length; i++) {
                var currentSubtitles = hypervideos[thisID].subtitles[i],
                    existingSubtitlesItem = $('<div class="existingSubtitlesItem"><span>'+ langMapping[hypervideos[thisID].subtitles[i].srclang] +'</span></div>'),
                    existingSubtitlesDelete = $('<button class="subtitlesDelete" type="button" data-lang="'+ hypervideos[thisID].subtitles[i].srclang +'">Delete</button>');

                existingSubtitlesDelete.click(function(evt) {
                    $(this).parent().remove();
                    optionDialog.find('.subtitlesSettingsWrapper').append('<input type="hidden" name="SubtitlesToDelete[]" value="'+ $(this).attr('data-lang') +'">');
                }).appendTo(existingSubtitlesItem);

                optionDialog.find('#ExistingSubtitlesContainer').append(existingSubtitlesItem);
            }
        }

        optionDialog.find('.hypervideoLayout [data-config]').each(function() {

            var tmpVal = '';

            if ( $(this).hasClass('active') ) {

                if ( $(this).attr('data-config') == 'slidingMode' ) {
                    tmpVal = 'overlay';
                } else if ( $(this).attr('data-config') == 'annotationsPosition' ) {
                    tmpVal = 'bottom'
                } else {
                    tmpVal = 'true';
                }

            } else {

                if ( $(this).attr('data-config') == 'slidingMode' ) {
                    tmpVal = 'adjust';
                } else if ( $(this).attr('data-config') == 'annotationsPosition' ) {
                    tmpVal = 'top'
                } else {
                    tmpVal = 'false';
                }

            }

            if ( !optionDialog.find('.hypervideoLayout input[name="config['+$(this).attr('data-config')+']"]').length ) {
                optionDialog.find('.hypervideoLayout').append('<input type="hidden" name="config['+$(this).attr('data-config')+']" data-configkey="'+ $(this).attr('data-config') +'" value="'+tmpVal+'">');
            }

            if ( $(this).attr('data-config') == 'annotationsPosition' && !$(this).hasClass('active') ) {

                optionDialog.find('.hypervideoLayout .playerWrapper')
                    .after(optionDialog.find('div[data-config="videolinksVisible"]'))
                    .before(optionDialog.find('div[data-config="annotationsVisible"]'));

            }

        }).click(function(evt) {


            var config      = $(evt.target).attr('data-config'),
                configState = $(evt.target).hasClass('active'),
                configValue = (configState ? 'false': 'true');

            if ( config != 'annotationsPosition' && config != 'slidingMode' ) {

                optionDialog.find('[name="config['+config+']"]').val(configValue);
                $(evt.target).toggleClass('active');

            } else if ( config == 'slidingMode' ) {

                if ( configState ) {

                    optionDialog.find('[name="config['+config+']"]').val('adjust');

                } else {

                    optionDialog.find('[name="config['+config+']"]').val('overlay');

                }

                $(evt.target).toggleClass('active');

            } else if ( config == 'annotationsPosition' ) {

                if ( configState ) {

                    optionDialog.find('[name="config['+config+']"]').val('top');

                    optionDialog.find('.hypervideoLayout .playerWrapper')
                        .after(optionDialog.find('div[data-config="videolinksVisible"]'))
                        .before(optionDialog.find('div[data-config="annotationsVisible"]'));

                } else {

                    optionDialog.find('[name="config['+config+']"]').val('bottom');

                    optionDialog.find('.hypervideoLayout .playerWrapper')
                        .before(optionDialog.find('div[data-config="videolinksVisible"]'))
                        .after(optionDialog.find('div[data-config="annotationsVisible"]'));

                }

                optionDialog.find('.hypervideoLayout [data-config="annotationsPosition"]').toggleClass('active');

            }

            evt.preventDefault();
            evt.stopPropagation();
        });

        // Manage Subtitles
        optionDialog.find('#SubtitlesPlus').on('click', function() {
            var langOptions, languageSelect;

            for (var lang in FrameTrail.module('Database').subtitlesLangMapping) {
                langOptions += '<option value="'+ lang +'">'+ FrameTrail.module('Database').subtitlesLangMapping[lang] +'</option>';
            }

            languageSelect =  '<select class="subtitlesTmpKeySetter">'
                            + '    <option value="" disabled selected style="display:none;">Language</option>'
                            + langOptions
                            + '</select>';

            optionDialog.find('#NewSubtitlesContainer').append('<span class="subtitlesItem">'+ languageSelect +'<input type="file" name="subtitles[]"><button class="subtitlesRemove" type="button">x</button><br></span>');
        });

        optionDialog.find('#NewSubtitlesContainer').on('click', '.subtitlesRemove', function(evt) {
            $(this).parent().remove();
        });

        optionDialog.find('#NewSubtitlesContainer').on('change', '.subtitlesTmpKeySetter', function() {
            $(this).parent().find('input[type="file"]').attr('name', 'subtitles['+$(this).val()+']');
        });


        optionDialog.find('#EditHypervideoForm').ajaxForm({
            method:     'POST',
            url:        '../_server/ajaxServer.php',
            beforeSubmit: function (array, form, options) {
                
                //TODO NO AJAX FORM but set directly the values in FrameTrail.module('Database').hypervideos[thisID]
                var DatabaseEntry = FrameTrail.module('Database').hypervideos[thisID];

                DatabaseEntry.name = $('#EditHypervideoForm').find('input[name="name"]').val();
                DatabaseEntry.description = $('#EditHypervideoForm').find('textarea[name="description"]').val();
                DatabaseEntry.hidden = $('#EditHypervideoForm').find('input[name="hidden"]').is(':checked');
                for (var configKey in DatabaseEntry.config) {
                    var newConfigVal = $('#EditHypervideoForm').find('input[data-configkey=' + configKey + ']').val();
                    newConfigVal = (newConfigVal === 'true')
                                    ? true
                                    : (newConfigVal === 'false')
                                        ? false
                                        : (newConfigVal === undefined)
                                            ? DatabaseEntry.config[configKey]
                                            : newConfigVal;
                    DatabaseEntry.config[configKey] = newConfigVal;
                }


                FrameTrail.module('Database').hypervideos[thisID].subtitles.splice(0, FrameTrail.module('Database').hypervideos[thisID].subtitles.length);

                $('#EditHypervideoForm').find('.existingSubtitlesItem').each(function () {
                    var lang = $(this).find('.subtitlesDelete').attr('data-lang');
                    FrameTrail.module('Database').hypervideos[thisID].subtitles.push({
                        "src": lang +".vtt",
                        "srclang": lang
                    });
                })

                $('#EditHypervideoForm').find('#NewSubtitlesContainer').find('input[type=file]').each(function () {
                    console.log(this);
                    var match = /subtitles\[(.+)\]/g.exec($(this).attr('name'));
                    console.log(match);
                    if (match) {
                        FrameTrail.module('Database').hypervideos[thisID].subtitles.push({
                            "src": match[1] +".vtt",
                            "srclang": match[1]
                        });
                    }
                });

                array.push({ name: 'src', value:  JSON.stringify(FrameTrail.module("Database").convertToDatabaseFormat(thisID), null, 4) });
                
            },
            beforeSerialize: function(form, options) {

                // Subtitles Validation

                optionDialog.find('.message.error').removeClass('active').html('');

                var err = 0;
                optionDialog.find('.subtitlesItem').each(function() {
                    $(this).css({'outline': ''});

                    if (($(this).find('input[type="file"]:first').attr('name') == 'subtitles[]') || ($(this).find('.subtitlesTmpKeySetter').first().val() == '')
                            || ($(this).find('input[type="file"]:first').val().length == 0)) {
                        $(this).css({'outline': '1px solid #cd0a0a'});
                        optionDialog.find('.message.error').addClass('active').html('Subtitles Error: Please fill in all fields.');
                        err++;
                    } else if ( !(new RegExp('(' + ['.vtt'].join('|').replace(/\./g, '\\.') + ')$')).test($(this).find('input[type="file"]:first').val()) ) {
                        $(this).css({'outline': '1px solid #cd0a0a'});
                        optionDialog.find('.message.error').addClass('active').html('Subtitles Error: Wrong format. Please add only .vtt files.');
                        err++;
                    }

                    if (optionDialog.find('.subtitlesItem input[type="file"][name="subtitles['+ $(this).find('.subtitlesTmpKeySetter:first').val() +']"]').length > 1
                            || (optionDialog.find('.existingSubtitlesItem .subtitlesDelete[data-lang="'+ $(this).find('.subtitlesTmpKeySetter:first').val() +'"]').length > 0 ) ) {
                        optionDialog.find('.message.error').addClass('active').html('Subtitles Error: Please make sure you assign languages only once.');
                        return false;
                    }
                });
                if (err > 0) {
                    return false;
                }


            },
            dataType: 'json',
            thisID: thisID,
            data: {
                'a': 'hypervideoChange',
                'projectID': projectID,
                'hypervideoID': thisID,
            },
            success: function(response) {

                switch(response['code']) {
                    case 0:

                        //TODO: Put in separate method
                        FrameTrail.module('Database').loadHypervideoData(
                            function(){

                                if ( thisID == FrameTrail.module('RouteNavigation').hypervideoID ) {

                                    FrameTrail.module('Database').hypervideo = FrameTrail.module('Database').hypervideos[thisID];

                                    // if current hypervideo is edited, adjust states
                                    optionDialog.find('.hypervideoLayout input').each(function() {

                                        var state = 'hv_config_'+ $(this).attr('data-configkey'),
                                            val   = $(this).val();

                                        if ( val == 'true' ) {
                                            val = true;
                                        } else if ( val == 'false' ) {
                                            val = false;
                                        }

                                        FrameTrail.changeState(state, val);

                                    });

                                    var name = optionDialog.find('input[name="name"]').val(),
                                        description = optionDialog.find('textarea[name="description"]').val();

                                    FrameTrail.module('HypervideoModel').hypervideoName = name;
                                    FrameTrail.module('HypervideoModel').description = description;

                                    FrameTrail.module('HypervideoController').updateDescriptions();

                                    // re-init subtitles
                                    FrameTrail.module('Database').loadSubtitleData(
                                        function() {

                                            FrameTrail.module('ViewOverview').refreshList();

                                            FrameTrail.module('HypervideoModel').subtitleFiles = FrameTrail.module('Database').hypervideo.subtitles;
                                            FrameTrail.module('HypervideoModel').initModelOfSubtitles(FrameTrail.module('Database'));
                                            FrameTrail.module('SubtitlesController').initController();
                                            FrameTrail.changeState('hv_config_captionsVisible', false);

                                            optionDialog.dialog('close');


                                        },
                                        function() {}
                                    );

                                } else {
                                    initList();
                                    optionDialog.dialog('close');
                                }

                            },
                            function(){
                                optionDialog.find('.message.error').addClass('active').html('Error while updating hypervideo data');
                            }
                        );

                        break;
                    default:
                        optionDialog.find('.message.error').addClass('active').html('Error: '+ response['string']);
                        break;
                }
            }
        });

        optionDialog.dialog({
            modal: true,
            resizable: false,
            width: 550,
            close: function() {
                $(this).dialog('close');
                $(this).remove();
            },
            buttons: [
                { text: 'Save changes',
                    click: function() {

                        $('#EditHypervideoForm').submit();

                    }
                },
                { text: 'Cancel',
                    click: function() {
                        $( this ).dialog( 'close' );
                    }
                }
            ]
        });

    });

    ExportButton.click(function(){
        FrameTrail.module('HypervideoModel').exportIt();
    });

    DeleteButton.click(function(evt) {

        evt.preventDefault();
        evt.stopPropagation();

        var thisID = FrameTrail.module('RouteNavigation').hypervideoID,
            hypervideos = FrameTrail.module('Database').hypervideos,
            projectID = FrameTrail.module('RouteNavigation').projectID;

        var deleteDialog = $('<div id="DeleteHypervideoDialog" title="Delete Hypervideo">'
                           + '<div>Do you really want to delete the this Hypervideo?</div>'
                           + '    <input id="thisHypervideoName" type="text" value="'+ hypervideos[thisID]['name'] +'" readonly>'
                           + '    <div class="message active">Please paste / re-enter the name:</div>'
                           + '    <form method="POST" id="DeleteHypervideoForm">'
                           + '        <input type="text" name="hypervideoName" placeholder="Name of Hypervideo"><br>'
                           + '        <div class="message error"></div>'
                           + '    </form>'
                           + '</div>');


        deleteDialog.find('#DeleteHypervideoForm').ajaxForm({
            method:     'POST',
            url:        '../_server/ajaxServer.php',
            dataType:   'json',
            thisID: thisID,
            data: {a: 'hypervideoDelete', projectID: projectID, hypervideoID: thisID},
            success: function(response) {
                switch(response['code']) {
                    case 0:
                        // TODO: find a nice way to remove Element of deleted Hypervideo from Overview List
                        deleteDialog.dialog('close');
                        $('#OverviewList div[data-hypervideoid="'+thisID+'"]').remove();

                        // Redirect to Overview when current Hypervideo has been deleted
                        if ( thisID == FrameTrail.module('RouteNavigation').hypervideoID ) {
                            alert('You deleted the current Hypervideo and will be redirected to the Overview.')
                            window.location.search = '?project=' + projectID;
                        }

                    break;
                    case 1:
                        deleteDialog.find('.message.error').addClass('active').html('Not logged in');
                    break;
                    case 2:
                        deleteDialog.find('.message.error').addClass('active').html('User not active');
                    break;
                    case 3:
                        deleteDialog.find('.message.error').addClass('active').html('Could not find the projects hypervideosID folder');
                    break;
                    case 4:
                        deleteDialog.find('.message.error').addClass('active').html('hypervideoID could not be found in database.');
                    break;
                    case 5:
                        deleteDialog.find('.message.error').addClass('active').html('hypervideoName is not correct.');
                    break;
                    case 6:
                        //TODO push nice texts into error box.
                        deleteDialog.find('.message.error').addClass('active').html('permission denied! The User is not an admin, nor is it his own hypervideo.');
                    break;
                }
            }
        });

        deleteDialog.dialog({
                modal: true,
                resizable: false,
                open: function() {
                    deleteDialog.find('#thisHypervideoName').focus().select();
                },
                close: function() {
                    $(this).dialog('close');
                    $(this).remove();
                },
                buttons: [
                    { text: 'Delete Hypervideo',
                        click: function() {
                            $('#DeleteHypervideoForm').submit();
                        }
                    },
                    { text: 'Cancel',
                        click: function() {
                            $( this ).dialog( 'close' );
                        }
                    }
                ]
            });

    });


    videoContainerControls.find('.editMode').click(function(evt){
        FrameTrail.changeState('editMode', ($(this).attr('data-editmode')));
    });


    /**
     * I am called from {{#crossLink "Interface/create:method"}}Interface/create(){{/crossLink}} and set up all my elements.
     * @method create
     */
    function create() {

        toggleSidebarOpen(FrameTrail.getState('sidebarOpen'));
        changeViewSize(FrameTrail.getState('viewSize'));
        toggleFullscreen(FrameTrail.getState('fullscreen'));
        toogleUnsavedChanges(FrameTrail.getState('unsavedChanges'));
        toggleViewMode(FrameTrail.getState('viewMode'));
        toggleEditMode(FrameTrail.getState('editMode'));

        $('body').append(domElement);

        if ( FrameTrail.getState('embed') ) {
            domElement.find('.viewmodeControls').hide();
        }

        // parse project description here in case we can't use the HypervideoController
        FrameTrail.module('Sidebar').ProjectDescription = FrameTrail.module('Database').project.description;


    };


    /**
     * I react to a change in the global state "sidebarOpen"
     * @method toggleSidebarOpen
     * @param {Boolean} opened
     */
    function toggleSidebarOpen(opened) {

        if (opened) {
            domElement.addClass('open');
        } else {
            domElement.removeClass('open');
        }

    };


    /**
     * I react to a change in the global state "viewSize"
     * @method changeViewSize
     * @param {Array} arrayWidthAndHeight
     */
    function changeViewSize(arrayWidthAndHeight) {

        var controlsHeight          = domElement.find('#SidebarContainer > div.active > .viewmodeControls').height(),
            viewModeInfoHeight      = domElement.height() - FrameTrail.module('Titlebar').height - controlsHeight;

        domElement.find('#SidebarContainer > div.active > .viewmodeInfo').css('max-height', viewModeInfoHeight - 80);

    };


    /**
     * I react to a change in the global state "fullscreen"
     * @method toggleFullscreen
     * @param {Boolean} aBoolean
     */
    function toggleFullscreen(aBoolean) {



    };


    /**
     * I react to a change in the global state "unsavedChanges"
     * @method toogleUnsavedChanges
     * @param {Boolean} aBoolean
     */
    function toogleUnsavedChanges(aBoolean) {

        if (aBoolean) {
            domElement.find('button[data-viewmode="video"]').addClass('unsavedChanges')
            SaveButton.addClass('unsavedChanges')
        } else {
            domElement.find('button[data-viewmode="video"]').removeClass('unsavedChanges')
            domElement.find('button.editMode').removeClass('unsavedChanges')
            SaveButton.removeClass('unsavedChanges')
        }
        
    };

    /**
     * I am called from the {{#crossLink "HypervideoModel/newUnsavedChange:method"}}HypervideoModel/newUnsavedChange(){{/crossLink}}.
     *
     * I mark the categories (overlays, videolinks, annotations, codeSnippets), which have unsaved changes inside them.
     *
     * @method newUnsavedChange
     * @param {String} category
     */
    function newUnsavedChange(category) {

        if (category == 'codeSnippets' || category == 'events' || category == 'customCSS') {
            // camelCase not valid in attributes
            domElement.find('button[data-editmode="codesnippets"]').addClass('unsavedChanges');
        } else {
            domElement.find('button[data-editmode="'+category+'"]').addClass('unsavedChanges');
        }

    };



    /**
     * I react to a change in the global state "viewMode"
     * @method toggleViewMode
     * @param {String} viewMode
     */
    function toggleViewMode(viewMode) {

        sidebarContainer.children().removeClass('active');

        domElement.find('[data-viewmode=' + viewMode + ']').addClass('active');

        changeViewSize();

    };

    /**
     * I react to a change in the global state "editMode"
     * @method toggleEditMode
     * @param {String} editMode
     * @param {String} oldEditMode
     */
    function toggleEditMode(editMode, oldEditMode){

        if (editMode) {

            domElement.addClass('editActive');

            if (oldEditMode === false) {

                ExportButton.hide();
                SaveButton.show();

                videoContainerControls.find('.editMode').addClass('inEditMode');

            }

            videoContainerControls.find('.editMode').removeClass('active');

            videoContainerControls.find('[data-editmode="' + editMode + '"]').addClass('active');

            FrameTrail.changeState('sidebarOpen', true);


        } else {

            domElement.removeClass('editActive');
            
            //ExportButton.show();
            SaveButton.hide();

            videoContainerControls.find('.editMode').removeClass('inEditMode');

            FrameTrail.changeState('sidebarOpen', false);

        }

        changeViewSize();


    }


    /**
     * I react to a change in the global state "loggedIn"
     * @method changeUserLogin
     * @param {Boolean} loggedIn
     */
    function changeUserLogin(loggedIn) {

        if (loggedIn) {

            if ( FrameTrail.module('RouteNavigation').hypervideoID ) {
                if (FrameTrail.module('HypervideoModel').creatorId === FrameTrail.module('UserManagement').userID) {

                    videoContainerControls.find('.editMode').removeClass('disabled');

                } else {

                    videoContainerControls.find('.editMode[data-editmode="overlays"]').addClass('disabled');
                    videoContainerControls.find('.editMode[data-editmode="links"]').addClass('disabled');
                    videoContainerControls.find('.editMode[data-editmode="codesnippets"]').addClass('disabled');

                }
            }

        } else {

            // not logged in

        }

    }




    return {

        create: create,

        onChange: {
            sidebarOpen:    toggleSidebarOpen,
            viewSize:       changeViewSize,
            fullscreen:     toggleFullscreen,
            unsavedChanges: toogleUnsavedChanges,
            viewMode:       toggleViewMode,
            editMode:       toggleEditMode,
            loggedIn:       changeUserLogin
        },

        newUnsavedChange: newUnsavedChange,

        /**
         * I am the width of the sidebar's DOM element.
         * @attribute width
         * @type Number
         * @readOnly
         */
        get width() { return domElement.width() },

        /**
         * I am the text which should be displayed in the "Overview" tab of the sidebar.
         * @attribute ProjectDescription
         * @type String
         * @writeOnly
         */
        set ProjectDescription(aString)   { return ProjectDescription.html(aString) },

        /**
         * I am the text which should be displayed in the "Video" tab of the sidebar.
         * @attribute VideoDescription
         * @type String
         * @writeOnly
         */
        set VideoDescription(aString)     { return VideoDescription.html(aString) }

    };

});