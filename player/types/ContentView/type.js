/**
 * @module Player
 */


/**
 * I am the ContentView, i display a filtered collection of annotations or overlays.
 *
 * @class ContentView
 * @category TypeDefinition
 */


FrameTrail.defineType(

    'ContentView',


    function (contentViewData, whichArea) {

        contentViewData.type                   =  contentViewData.type || "TimedContent";
        contentViewData.name                   =  contentViewData.name || "";
        contentViewData.description            = contentViewData.description || "";
        contentViewData.cssClass               = contentViewData.cssClass || "";
        contentViewData.html                   = contentViewData.html || "";
            contentViewData.collectionFilter.tags  = contentViewData.collectionFilter.tags  || [];
            contentViewData.collectionFilter.types = contentViewData.collectionFilter.types || [];
            contentViewData.collectionFilter.text  = contentViewData.collectionFilter.text  || "";
            contentViewData.collectionFilter.users = contentViewData.collectionFilter.users || [];
        contentViewData.transcriptSource       = contentViewData.transcriptSource || "";
        contentViewData.mode                   = contentViewData.mode || "slide";
        contentViewData.axis                   = contentViewData.axis || "x";
        contentViewData.contentSize            = contentViewData.contentSize || "small";
        contentViewData.autoSync               = contentViewData.autoSync || false;
        contentViewData.onClickContentItem     = contentViewData.onClickContentItem || "";

        this.contentViewData = contentViewData;

        this.whichArea = whichArea;

        this.contentCollection = [];

        this.appendDOMElement();

        this.updateContentCollection();

        this.appendContentCollectionElements();

    },

    {
        whichArea: null,
        contentViewData:    null,
        contentCollection: null,


        updateContentCollection: function () {

            if (!this.contentViewData.collectionFilter) {
                return;
            }

            var self = this,
                old_contentCollection = this.contentCollection;

            this.contentCollection = FrameTrail.module('TagModel').getContentCollection(
                this.contentViewData.collectionFilter.tags,
                false,
                true,
                this.contentViewData.collectionFilter.users,
                this.contentViewData.collectionFilter.text,
                this.contentViewData.collectionFilter.types
            );

            old_contentCollection.filter(function (contentItem) {
                return 0 > self.contentCollection.indexOf(contentItem)
            }).forEach(function (contentItem) {
                self.removeContentCollectionElements(contentItem);
            });

            this.contentCollection.filter(function (contentItem) {
                return 0 > old_contentCollection.indexOf(contentItem)
            }).forEach(function (contentItem) {
                self.appendContentCollectionElements(contentItem);
            });

            FrameTrail.module('ViewLayout').updateManagedContent();

        },


        appendContentCollectionElements: function (contentItem) {
            // TODO Joscha
            // single item (like an annotation)
            // console.log(contentItem);

        },


        removeContentCollectionElements: function (contentItem) {
            // TODO
            // single item (like an annotation)
            // console.log(contentItem);
        },


        appendDOMElement: function () {
            // TODO
            // append contentView to layoutArea
            //
            // switch (this.whichArea) {
            //     case 'top':
            //
            //         // store in this object
            //         this.myDetailView = $('<div>....</div>')
            //         this.myContainerView = $('<div>....</div>')
            //
            //         FrameTrail.module('ViewLayout').areaTopContainer.apend(this.myContainerView);
            //         FrameTrail.module('ViewLayout').areaTopDetails.append(this.myDetailView);
            //
            //
            //         break;
            //     case 'bottom':
            //         FrameTrail.module('ViewLayout').areaBottomContainer.......
            //         FrameTrail.module('ViewLayout').areaBottomDetails........
            //
            //         break;
            //     case 'left':
            //         FrameTrail.module('ViewLayout').areaLeftContainer........
            //
            //         break;
            //     case 'right':
            //         FrameTrail.module('ViewLayout').areaRightContainer........
            //
            //         break;
            // }

        },


        removeDOMElement: function () {
            // TODO
            // remove contentView from layoutArea [this.whichArea]
            //         this.myDetailView = $('<div>....</div>')
            //         this.myContainerView = $('<div>....</div>')
        },

        updateTimedStateOfContentViews: function (currentTime) {
            // console.log('updateTimedStateOfContentViews', this, currentTime);
            // TODO (optional)
            // switch (this.contentViewData.type) {
            //     case 'TimedContent':
            //         // Annotations are already updated by ViewLayout module!
            //         break;
            //     case 'CustomHTML':
            //
            //         break;
            //     case 'Transcript':
            //
            //         break;
            // }
        }


    }

);
