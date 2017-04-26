/**
 * @module Player
 */


/**
 * I am the Titlebar. I provide a place for a title text, and for two buttons (opening the 
 * {{#crossLink "Sidebar"}}Sidebar{{/crossLink}} and – YET TO IMPLEMENT – the social sharing widgets).
 *
 * @class Titlebar
 * @static
 */



FrameTrail.defineModule('Titlebar', function(){


    var domElement = $(   '<div id="Titlebar">'
                            + '  <div id="SidebarToggleWidget" class=""><button id="SidebarToggleButton"><span class="icon-menu"></span></button></div>'
                            + '  <div id="TitlebarViewMode">'
                            + '      <button data-viewmode="overview" data-tooltip-bottom-left="Overview"><span class="icon-overview"></span></button>'
                            + '      <button data-viewmode="video"><span class="icon-hypervideo"></span></button>'
                            + '  </div>'
                            + '  <div id="TitlebarTitle"></div>'
                            + '  <div id="TitlebarActionButtonContainer">'
                            + '      <button class="startEditButton" data-tooltip-bottom-left="Edit"><span class="icon-edit"></span></button>'
                            + '      <button class="leaveEditModeButton" data-tooltip-bottom-left="Stop Editing"><span class="icon-edit-circled"></span></button>'
                            + '      <button class="userSettingsButton" data-tooltip-bottom-right="User Management"><span class="icon-user"></span></button>'
                            + '      <button id="LogoutButton" data-tooltip-bottom-right="Logout"><span class="icon-logout"></span></button>'
                            + '  </div>'
                            + '  <div id="SharingWidget"><button id="SharingWidgetButton" data-tooltip-bottom-right="Share"><span class="icon-share"></span></button></div>'
                            + '</div>'
                          ),
    TitlebarViewMode        = domElement.find('#TitlebarViewMode'),
    StartEditButton         = domElement.find('.startEditButton'),
    LeaveEditModeButton     = domElement.find('.leaveEditModeButton'),
    UserSettingsButton      = domElement.find('.userSettingsButton');


    StartEditButton.click(function(){
        FrameTrail.module('UserManagement').ensureAuthenticated(
            function(){
                
                FrameTrail.changeState('editMode', 'preview');

            },
            function(){ /* Start edit mode canceled */ }
        );
    });

    LeaveEditModeButton.click(function(){
        FrameTrail.module('HypervideoModel').leaveEditMode();
    });

    UserSettingsButton.click(function(){
        FrameTrail.module('UserManagement').showAdministrationBox();
    });

    domElement.find('#SidebarToggleButton').click(function(){

        FrameTrail.changeState('sidebarOpen', ! FrameTrail.getState('sidebarOpen'));

    });

    if (!FrameTrail.module('RouteNavigation').hypervideoID) {
        domElement.find('button[data-viewmode="video"]').hide();
    }

    TitlebarViewMode.children().click(function(evt){
        FrameTrail.changeState('viewMode', ($(this).attr('data-viewmode')));
    });



    domElement.find('#SharingWidgetButton').click(function(){

        var RouteNavigation = FrameTrail.module('RouteNavigation'),
            baseUrl = window.location.href.split('?'),
            url = baseUrl[0] + '?project=' + RouteNavigation.projectID,
            secUrl = '//'+ window.location.host + window.location.pathname,
            iframeUrl = secUrl + '?project=' + RouteNavigation.projectID,
            label = 'Project';

        if ( FrameTrail.getState('viewMode') == 'video' && RouteNavigation.hypervideoID ) {
            url += '&hypervideo='+ RouteNavigation.hypervideoID;
            iframeUrl += '&hypervideo='+ RouteNavigation.hypervideoID;
            label = 'Hypervideo'
        }

        var shareDialog = $('<div id="ShareDialog" title="Share / Embed '+ label +'">'
                        + '    <div>Link</div>'
                        + '    <input type="text" value="'+ url +'"/>'
                        + '    <div>Embed Code</div>'
                        + '    <textarea style="height: 100px;" readonly><iframe width="800" height="600" scrolling="no" src="'+ iframeUrl +'" frameborder="0" allowfullscreen></iframe></textarea>'
                        + '</div>');
        
        shareDialog.find('input[type="text"], textarea').click(function() {
            $(this).focus();
            $(this).select();
        });

        shareDialog.dialog({
            modal: true,
            resizable: false,
            width:      500,
            height:     360,
            close: function() {
                $(this).dialog('close');
                $(this).remove();
            },
            buttons: [
                { text: 'OK',
                    click: function() {
                        $( this ).dialog( 'close' );
                    }
                }
            ]
        });
        
    });

    domElement.find('#LogoutButton').click(function(){

        FrameTrail.module('HypervideoModel').leaveEditMode(true);
        
    });


    /**
     * I am called from {{#crossLink "Interface/create:method"}}Interface/create(){{/crossLink}}.
     *
     * I set up my interface elements.
     *
     * @method create
     */
    function create() {

        toggleSidebarOpen(FrameTrail.getState('sidebarOpen'));
        toogleUnsavedChanges(FrameTrail.getState('unsavedChanges'));
        toggleViewMode(FrameTrail.getState('viewMode'));
        toggleEditMode(FrameTrail.getState('editMode'));
        
        if ( FrameTrail.getState('embed') ) {
            //domElement.find('#SidebarToggleButton, #SharingWidgetButton').hide();
        }

        $('body').append(domElement);

    }


    
    /**
     * I make changes to my CSS, when the global state "sidebarOpen" changes.
     * @method toggleSidebarOpen
     * @param {Boolean} opened
     */
    function toggleSidebarOpen(opened) {

        if (opened) {

            domElement.addClass('sidebarOpen');
            domElement.find('#SidebarToggleWidget').addClass('sidebarActive');

        } else {

            domElement.removeClass('sidebarOpen');
            domElement.find('#SidebarToggleWidget').removeClass('sidebarActive');

        }

    }



    /**
     * I make changes to my CSS, when the global state "unsavedChanges" changes.
     * @method toogleUnsavedChanges
     * @param {Boolean} aBoolean
     */
    function toogleUnsavedChanges(aBoolean) {

        if(aBoolean){
            TitlebarViewMode.find('[data-viewmode="video"]').addClass('unsavedChanges');
        }else{
            TitlebarViewMode.find('[data-viewmode="video"]').removeClass('unsavedChanges');
        }
        
    }


    /**
     * I react to a change in the global state "viewMode"
     * @method toggleViewMode
     * @param {String} viewMode
     */
    function toggleViewMode(viewMode) {

        if (FrameTrail.module('RouteNavigation').hypervideoID) {
            domElement.find('button[data-viewmode="video"]').show();

            // count visible hypervideos in project
            var hypervideos = FrameTrail.module('Database').hypervideos,
                visibleCount = 0;
            for (var id in hypervideos) {
                if (!hypervideos[id].hidden) {
                    visibleCount++;
                }
            }
            
            // hide 'Overview' and 'Video' controls when there's only one hypervideo
            if (visibleCount == 1) {
                TitlebarViewMode.addClass('hidden');
            }

        }

        TitlebarViewMode.children().removeClass('active');

        domElement.find('[data-viewmode=' + viewMode + ']').addClass('active');

    }


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

                StartEditButton.hide();
                LeaveEditModeButton.show();

            }

        } else {

            domElement.removeClass('editActive');

            StartEditButton.show();

            // Hide Edit Button when not in a server environment
            if (!FrameTrail.module('RouteNavigation').environment.server) {
                StartEditButton.hide();
            }
            
            LeaveEditModeButton.hide();

        }

    }


    /**
     * I react to a change in the global state "loggedIn"
     * @method changeUserLogin
     * @param {Boolean} loggedIn
     */
    function changeUserLogin(loggedIn) {
        
        if (loggedIn) {
            
            domElement.find('#LogoutButton').show();
            UserSettingsButton.show();

        } else {

            domElement.find('#LogoutButton').hide();
            UserSettingsButton.hide();

        }

    }


    /**
     * I react to a change in the global state "userColor"
     * @method changeUserColor
     * @param {String} color
     */
    function changeUserColor(color) {

        if (color.length > 1) {

            /*
            // Too much color in the interface, keep default color for now
            UserSettingsButton.css({
                'border-color': '#' + FrameTrail.getState('userColor'),
                'background-color': '#' + FrameTrail.getState('userColor')
            });
            */

        }

    }


 

        
    return {

        onChange: {
            sidebarOpen:    toggleSidebarOpen,
            unsavedChanges: toogleUnsavedChanges,
            viewMode:       toggleViewMode,
            editMode:       toggleEditMode,
            loggedIn:       changeUserLogin,
            userColor:      changeUserColor
        },

        /**
         * I am the text, which should be shown in the title bar.
         * @attribute title
         * @type String
         * @writeOnly
         */
        set title(aString) {
            domElement.find('#TitlebarTitle').text(aString);
        },

        /**
         * I am the height of the title bar in pixel.
         * @attribute height
         * @type Number
         * @readOnly
         */
        get height() {
            return FrameTrail.getState('fullscreen') ? 0 : domElement.height();
        },

        create: create

    };


});