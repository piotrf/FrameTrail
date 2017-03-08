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
                            + '                    <button class="exportButton" data-tooltip-bottom-left="Export Project"></button>'
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
                            + '                    <button class="saveButton" data-tooltip-bottom-left="Save changes"></button>'
                            + '                    <button class="exportButton" data-tooltip-bottom-left="Export Hypervideo"></button>'
                            + '                    <div style="clear: both;"></div>'
                            + '                </div>'
                            + '                <button class="editMode" data-editmode="preview">Preview</button>'
                            + '                <button class="editMode" data-editmode="links">Video Links</button>'
                            + '                <button class="editMode" data-editmode="overlays">Overlays</button>'
                            + '                <button class="editMode" data-editmode="codesnippets">Custom Code</button>'
                            + '                <button class="editMode" data-editmode="annotations">My Annotations</button>'
                            + '            </div>'
                            + '            <div class="viewmodeInfo">'
                            + '                <span id="VideoDescription"></span>'
                            + '            </div>'
                            + '            <div id="SelectAnnotationContainer" class="ui-front">'
                            + '                <div class="descriptionLabel">Annotations</div>'
                            + '                <select id="SelectAnnotation" name=""></select>'
                            + '                <div id="SelectAnnotationSingle"></div>'
                            + '            </div>'
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
        ExportButton           = domElement.find('.exportButton'),
        
        ProjectDescription     = sidebarContainer.find('#ProjectDescription'),
        VideoDescription       = sidebarContainer.find('#VideoDescription'),

        SelectAnnotationContainer       = domElement.find('#SelectAnnotationContainer');



    SaveButton.click(function(){
        FrameTrail.module('HypervideoModel').save();
    });


    ExportButton.click(function(){
        FrameTrail.module('HypervideoModel').exportIt();
    });
    
    /*
    CloneButton.click(function(){
        FrameTrail.module('HypervideoModel').clone();
    });
    */


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
            viewModeInfoHeight      = domElement.height() - FrameTrail.module('Titlebar').height - controlsHeight,
            selectAnnotationsHeight = SelectAnnotationContainer.height();

        domElement.find('#SidebarContainer > div.active > .viewmodeInfo').css('max-height', viewModeInfoHeight - selectAnnotationsHeight - 40);

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

        if (category == 'codeSnippets') {
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

        SelectAnnotationContainer: SelectAnnotationContainer,
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