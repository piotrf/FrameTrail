/**
 * @module Player
 */


/**
 * I am the ViewLayout. I manage the layout areas wich contain ContentViews.
 *
 * @class ViewLayout
 * @static
 */



FrameTrail.defineModule('ViewLayout', function(){

    var configLayoutArea,

        areaTopContainer,
        areaTopDetails,

        areaBottomContainer,
        areaBottomDetails,

        areaLeftContainer,
        areaRightContainer,

        contentViewsTop     = [],
        contentViewsBottom  = [],
        contentViewsLeft    = [],
        contentViewsRight   = [],

        managedAnnotations  = [],
        managedOverlays     = [];



    function create () {

        configLayoutArea = FrameTrail.module('Database').hypervideo.config['layoutArea'];

        areaTopContainer    = FrameTrail.module('ViewVideo').AreaTopContainer;
        areaTopDetails      = FrameTrail.module('ViewVideo').AreaTopDetails;
        areaBottomContainer = FrameTrail.module('ViewVideo').AreaBottomContainer;
        areaBottomDetails   = FrameTrail.module('ViewVideo').AreaBottomDetails;
        areaLeftContainer   = FrameTrail.module('ViewVideo').AreaLeftContainer;
        areaRightContainer  = FrameTrail.module('ViewVideo').AreaRightContainer;

        for (var i in configLayoutArea.areaTop) {
            contentViewsTop.push(
                new FrameTrail.newObject('ContentView',
                    configLayoutArea.areaTop[i],
                    'top'));
        }

        for (var i in configLayoutArea.areaBottom) {
            contentViewsBottom.push(
                new FrameTrail.newObject('ContentView',
                    configLayoutArea.areaBottom[i],
                    'bottom'));
        }

        for (var i in configLayoutArea.areaLeft) {
            contentViewsLeft.push(
                new FrameTrail.newObject('ContentView',
                    configLayoutArea.areaLeft[i],
                    'left'));
        }

        for (var i in configLayoutArea.areaRight) {
            contentViewsRight.push(
                new FrameTrail.newObject('ContentView',
                    configLayoutArea.areaRight[i],
                    'right'));
        }

    }



    function createContentView (whichArea, templateContentViewData) {

        var arrayOfContentViews = ({
            'top': contentViewsTop,
            'bottom': contentViewsBottom,
            'left': contentViewsLeft,
            'right': contentViewsRight
        })[whichArea];

        if (!Array.isArray(arrayOfContentViews)) {
            throw new Error('whichArea is string top/bottom/left/right');
        }

        var newContentView = new FrameTrail.newObject('ContentView', templateContentViewData, whichArea)

        arrayOfContentViews.push(newContentView);

        configLayoutArea[({
            'top': 'areaTop',
            'bottom': 'areaBottom',
            'left': 'areaLeft',
            'right': 'areaRight'
        })[whichArea]].push(newContentView.contentViewData);

        updateManagedContent();

    }


    function removeContentView (contentViewToRemove) {

        var layoutAreaToRemovefrom = ({
            'top': contentViewsTop,
            'bottom': contentViewsBottom,
            'left': contentViewsLeft,
            'right': contentViewsRight
        })[contentViewToRemove.whichArea];

        contentViewToRemove.removeContentCollectionElements();

        layoutAreaToRemovefrom.splice(
            layoutAreaToRemovefrom.indexOf(contentViewToRemove),
            1
        );

        updateManagedContent();

    }


    function updateManagedContent() {

        managedAnnotations = [];
        managedOverlays    = [];

        var contentViewAreas = [
            contentViewsTop, contentViewsBottom, contentViewsLeft, contentViewsRight
        ];

        for (var a in contentViewAreas) {
            for (var i in contentViewAreas[a]) {
                var contentView = contentViewAreas[a][i];
                for (var k in contentView.contentCollection) {
                    var item = contentView.contentCollection[k];
                    if (item.annotationElement) {
                        managedAnnotations.push([item, contentView]);
                    } else if (item.overlayElement) {
                        managedOverlays.push([item, contentView]);
                    }
                }
            }
        }

    }


    function updateTimedStateOfContentViews (currentTime) {

        var self = this;

        for (var i in contentViewsTop) {
            contentViewsTop[i].updateTimedStateOfContentViews(currentTime);
        }
        for (var i in contentViewsBottom) {
            contentViewsBottom[i].updateTimedStateOfContentViews(currentTime);
        }
        for (var i in contentViewsLeft) {
            contentViewsLeft[i].updateTimedStateOfContentViews(currentTime);
        }
        for (var i in contentViewsRight) {
            contentViewsRight[i].updateTimedStateOfContentViews(currentTime);
        }


        for (var idx in managedAnnotations) {
            var annotation  = managedAnnotations[idx][0],
                contentView = managedAnnotations[idx][1];

            if (    annotation.data.start <= currentTime
                 && annotation.data.end   >= currentTime) {

                if (!annotation.activeStateInContentView(contentView)) {
                    annotation.setActiveInContentView(contentView);
                }

            } else {

                if (annotation.activeStateInContentView(contentView)) {
                    annotation.setInactiveInContentView(contentView);
                }

            }

        }

        for (var idx in managedOverlays) {
            var overlay     = managedOverlays[idx][0],
                contentView = managedOverlays[idx][1];

            if (    overlay.data.start <= currentTime
                 && overlay.data.end   >= currentTime) {

                if (!overlay.activeStateInContentView(contentView)) {
                    overlay.setActiveInContentView(contentView);
                }

            } else {

                if (overlay.activeStateInContentView(contentView)) {
                    overlay.setInactiveInContentView(contentView);
                }

            }

        }

    }



    return {
        create: create,

        createContentView: createContentView,
        removeContentView: removeContentView,

        updateManagedContent: updateManagedContent,

        updateTimedStateOfContentViews: updateTimedStateOfContentViews,

        get areaTopContainer()      { return areaTopContainer; },
        get areaTopDetails()        { return areaTopDetails; },
        get areaBottomContainer()   { return areaBottomContainer; },
        get areaBottomDetails()     { return areaBottomDetails; },
        get areaLeftContainer()     { return areaLeftContainer; },
        get areaRightContainer()    { return areaRightContainer; }
    };

});
