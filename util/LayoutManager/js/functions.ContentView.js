var fakeID = 0;

/**
 * I render a contentView based on a contentView data object
 * and a target layoutArea.
 * If startEditing is set to true, editContentView is called
 * right after rendering.
 *
 * @method renderContentView
 * @param {String} layoutArea
 * @param {Object} contentViewData
 * @param {Boolean} startEditing
 */
function renderContentView(layoutArea, contentViewData, startEditing) {
    var areaContainer = $('.layoutArea[data-area="'+ layoutArea +'"]'),
        contentViewTabElement = renderContentViewTab(contentViewData),
        contentViewPreviewElement = renderContentViewPreview(contentViewData);
    
    areaContainer.find('.layoutAreaTabs').append( contentViewTabElement );
    areaContainer.find('.layoutAreaContent').append( contentViewPreviewElement );

    activateContentView( layoutArea, contentViewTabElement.attr('data-fakeid') );
    
    if (startEditing) {
        window.setTimeout(function() {
            editContentView( contentViewPreviewElement );
        }, 200);
    }
    
}

/**
 * I render a tab based on a contentView data object.
 *
 * @method renderContentViewTab
 * @param {Object} contentViewData
 * @return HTMLElement
 */
function renderContentViewTab(contentViewData) {

    var tabItem = $('<div class="contentViewTab" '
                    +   'data-type="'+ contentViewData.type +'" '
                    +   'data-fakeid="'+ fakeID +'" '
                    +   '>'
                    +   '    <div class="contentViewTabName">'+ contentViewData.name +'</div>'
                    +   '    <div class="contentViewTabOptions">'
                    +   '        <button class="editContentView"><span class="icon-pencil"></span></button>'
                    +   '        <button class="deleteContentView"><span class="icon-trash"></span></button>'
                    +   '    </div>'
                    +   '</div>');

    tabItem.find('.contentViewTabName').click(function() {
        activateContentView( $(this).parents('.layoutArea').attr('data-area'), $(this).parents('.contentViewTab').attr('data-fakeid') );
    });

    tabItem.find('.editContentView').click(function() {
        
        var contentViewPreviewItem = $('.contentViewPreview[data-fakeid="'+ $(this).parents('.contentViewTab').attr('data-fakeid') +'"]');
        
        console.log('Edit Item: ', contentViewPreviewItem);
        editContentView(contentViewPreviewItem);


    });

    tabItem.find('.deleteContentView').click(function() {
        
        var contentViewPreviewItem = $('.contentViewPreview[data-fakeid="'+ $(this).parents('.contentViewTab').attr('data-fakeid') +'"]');

        var area = $(this).parents('.layoutArea').attr('data-area');

        console.log('Delete Item: ', contentViewPreviewItem);
        $(this).parents('.contentViewTab').remove();
        contentViewPreviewItem.remove();

        activateContentView( area, $('.layoutArea[data-area="'+ area +'"] .contentViewTab').eq(0).attr('data-fakeid') );

    });

    return tabItem;

}

/**
 * I render a preview based on a contentView data object.
 *
 * @method renderContentViewPreview
 * @param {Object} contentViewData
 * @return HTMLElement
 */
function renderContentViewPreview(contentViewData) {

    var previewItem = $('<div class="contentViewPreview" '
                    +   'data-size="'+ contentViewData.contentSize +'" '
                    +   'data-type="'+ contentViewData.type +'" '
                    +   'data-fakeid="'+ fakeID +'" '
                    +   '>'
                    +   '    <div class="contentViewPreviewDescription">'+ contentViewData.name +'</div>'
                    +   '</div>');

    fakeID++;

    return previewItem;

}

/**
 * I activate a contentView (tab and preview) 
 * based on a FAKEID (later internal in contentView type).
 *
 * @method activateContentView
 * @param {String} area
 * @param {String} fakeID
 */
function activateContentView(area, fakeID) {

    console.log(area, fakeID);
    $('.layoutArea[data-area="'+ area +'"] .contentViewTab').removeClass('active');
    $('.layoutArea[data-area="'+ area +'"] .contentViewTab[data-fakeid="'+ fakeID +'"]').addClass('active');

    $('.layoutArea[data-area="'+ area +'"] .contentViewPreview').removeClass('active');
    $('.layoutArea[data-area="'+ area +'"] .contentViewPreview[data-fakeid="'+ fakeID +'"]').addClass('active');

}

/**
 * I create an edit dialog for a given contentViewPreviewElement
 *
 * @method editContentView
 * @param {HTMLElement} contentViewPreviewElement
 */
function editContentView(contentViewPreviewElement) {

	var elementOrigin = contentViewPreviewElement,
		animationDiv = elementOrigin.clone(),
        originOffset = elementOrigin.offset(),
        finalTop = ($(window).height()/2) - 200,
        finalLeft = ($(window).width()/2) - 320,
        self = this;

    animationDiv.addClass('contentViewAnimationDiv').css({
        position: 'absolute',
        top: originOffset.top + 'px',
        left: originOffset.left + 'px',
        width: elementOrigin.width(),
        height: elementOrigin.height(),
        zIndex: 99
    }).appendTo('body');

    animationDiv.animate({
        top: finalTop + 'px',
        left: finalLeft + 'px',
        width: 640 + 'px',
        height: 400 + 'px'
    }, 300, function() {
        
        
        var editDialog   = $('<div class="editContentViewDialog" title="Edit ContentView"></div>');

        editDialog.dialog({
            resizable: false,
            draggable: false,
            width: 640,
            height: 400,
            modal: true,
            close: function() {
                $(this).dialog('close');
                $(this).remove();
                animationDiv.animate({
                    top: originOffset.top + 'px',
                    left: originOffset.left + 'px',
                    width: elementOrigin.width(),
                    height: elementOrigin.height()
                }, 300, function() {
                    $('.contentViewAnimationDiv').remove();
                });
            },
            closeOnEscape: true,
            open: function( event, ui ) {
                $('.ui-widget-overlay').click(function() {
                    editDialog.dialog('close');
                });

            }
        });

    });

}

