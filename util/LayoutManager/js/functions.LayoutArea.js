
/**
 * I initialize a LayoutArea and trigger initialization of its ContentViews.
 *
 * @method initLayoutArea
 * @param {String} layoutArea
 * @param {Array} contentViews
 */
function initLayoutArea(layoutArea, contentViews) {
    var areaContainer = $('.layoutArea[data-area="'+ layoutArea +'"]');
    
    // LayoutAreas can't be set visible or invisible in config.
    // They're just automatically visible when they have contents.
    if (contentViews.length > 0) {
        //FrameTrail.changeState('hv_config_'+ layoutArea +'Visible', true);
    } else {
        //FrameTrail.changeState('hv_config_'+ layoutArea +'Visible', false);
    }
    
    for (var i=0; i < contentViews.length; i++) {
        renderContentView(layoutArea, contentViews[i]);
    }
    
}