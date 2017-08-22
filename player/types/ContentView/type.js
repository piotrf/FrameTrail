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
        contentViewData.contentSize            = contentViewData.contentSize || "small";
        contentViewData.onClickContentItem     = contentViewData.onClickContentItem || "";

        this.contentViewData = contentViewData;

        this.whichArea = whichArea;

        this.contentCollection = [];

        this.appendDOMElement();

        this.updateContent();

    },

    {
        whichArea: null,
        contentViewData:    null,
        contentCollection: null,


        updateContent: function() {
            
            var self = this;

            self.contentViewTab.attr('data-type', self.contentViewData.type);
            self.contentViewTab.find('.contentViewTabName').text(self.contentViewData.name);

            self.contentViewContainer.attr('data-type', self.contentViewData.type);
            self.contentViewContainer.attr('data-size', self.contentViewData.contentSize);

            switch (this.contentViewData.type) {
                
                case 'TimedContent':
                    
                    self.contentViewContainer.find('.customhtmlContainer, .transcriptContainer').remove();

                    if (!self.contentViewData.collectionFilter) {
                        return;
                    }

                    var old_contentCollection = self.contentCollection;

                    self.contentCollection = FrameTrail.module('TagModel').getContentCollection(
                        self.contentViewData.collectionFilter.tags,
                        false,
                        true,
                        self.contentViewData.collectionFilter.users,
                        self.contentViewData.collectionFilter.text,
                        self.contentViewData.collectionFilter.types
                    );

                    old_contentCollection.filter(function(contentItem) {
                        return 0 > self.contentCollection.indexOf(contentItem)
                    }).forEach(function(contentItem) {
                        self.removeContentCollectionElements(contentItem);
                    });

                    self.contentCollection.filter(function(contentItem) {
                        return 0 > old_contentCollection.indexOf(contentItem)
                    }).forEach(function (contentItem) {
                        self.appendContentCollectionElements(contentItem);
                    });

                    FrameTrail.module('ViewLayout').updateManagedContent();

                    break;

                case 'CustomHTML':

                    self.contentCollection.forEach(function (contentItem) {
                        self.removeContentCollectionElements(contentItem);
                    });

                    self.contentViewContainer.find('.contentViewContents').html('<div class="customhtmlContainer">'+ self.contentViewData.html +'</div>');

                    break;

                case 'Transcript':
                    
                    self.contentCollection.forEach(function (contentItem) {
                        self.removeContentCollectionElements(contentItem);
                    });

                    self.contentViewContainer.find('.contentViewContents').html('<div class="transcriptContainer">TRANSCRIPT HERE</div>');
                    console.log('Init Hyperaud.io Light Transcript');

                    break;
            }

            self.resizeLayoutArea();

        },


        appendContentCollectionElements: function(contentItem) {
            // TODO Joscha
            // single item (like an annotation)
            // console.log(contentItem);
            
            var collectionElement = $('<div class="collectionElement"></div>');

            collectionElement.append(contentItem.resourceItem.renderThumb());
            this.contentViewContainer.find('.contentViewContents').append(collectionElement);

            contentItem.contentViewElements.push(collectionElement);

        },


        removeContentCollectionElements: function(contentItem) {
            // TODO
            // single item (like an annotation)
            // console.log(contentItem);

            // TODO: CHECK WHY contentItem is undefined !!!

            if (contentItem) {
                
                if ( this.getContentViewElementFromContentItem(contentItem) ) {
                    this.getContentViewElementFromContentItem(contentItem).remove();

                    contentItem.contentViewElements.splice(
                        contentItem.contentViewElements.indexOf(contentItem),
                        1
                    );
                }
                
            }

        },


        getContentViewElementFromContentItem: function(contentItem) {
            for (var i=0; i<contentItem.contentViewElements.length; i++) {
                if ( this.contentViewContainer.find(contentItem.contentViewElements[i]).length != 0 ) {
                    return this.contentViewContainer.find(contentItem.contentViewElements[i]);
                }
            }

            return null;
        },


        appendDOMElement: function() {
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
            //         FrameTrail.module('ViewLayout').areaTopContainer.append(this.myContainerView);
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

            var self = this;
                contentViewTab = self.renderContentViewTab(),
                contentViewContainer = self.renderContentViewContainer(),
                areaContainer = self.getLayoutAreaContainer();

            self.contentViewTab = contentViewTab;
            self.contentViewContainer = contentViewContainer;
            
            areaContainer.find('.layoutAreaTabs').append( contentViewTab );
            areaContainer.find('.layoutAreaContent').append( contentViewContainer );

            self.activateContentView();

        },


        removeDOMElement: function() {
            // TODO
            // remove contentView from layoutArea [this.whichArea]
            //         this.myDetailView = $('<div>....</div>')
            //         this.myContainerView = $('<div>....</div>')
            this.contentViewContainer.remove();
            this.contentViewTab.remove();

            if (this.contentViewPreviewElement.length != 0) {
                this.contentViewPreviewElement.remove();
            }

            if (this.contentViewPreviewTab.length != 0) {
                this.contentViewPreviewTab.remove();
            }
        },


        updateTimedStateOfContentViews: function(currentTime) {
            // console.log('updateTimedStateOfContentViews', this, currentTime);

            switch (this.contentViewData.type) {
                case 'TimedContent':
                    // Annotations are already updated by ViewLayout module!

                    this.updateCollectionSlider();

                    break;
                case 'CustomHTML':
                    
                    break;
                case 'Transcript':
                    
                    break;
            }

            
        },



        updateLayout: function() {

            var HypervideoDuration = FrameTrail.module('HypervideoModel').duration;

            if ( HypervideoDuration != 0 ) {
                switch (this.contentViewData.contentSize) {
                    case 'small':
                        this.distributeElements();
                        break;
                    case 'medium':
                        this.distributeElements();
                        break;
                    case 'large':
                        // full view update
                        break;
                }
            }

        },


        /**
         * I render a ContentView Preview.
         * If startEditing is set to true, editContentView is called
         * right after rendering.
         *
         * @method renderContentViewPreview
         * @param {Boolean} startEditing
         */
        renderContentViewPreview: function(startEditing) {
            var self = this;
                contentViewPreviewTab = self.renderContentViewPreviewTab(),
                contentViewPreviewElement = self.renderContentViewPreviewElement(),
                areaContainer = self.getLayoutAreaPreviewContainer();

            self.contentViewPreviewTab = contentViewPreviewTab;
            self.contentViewPreviewElement = contentViewPreviewElement;
            
            areaContainer.find('.layoutAreaTabs').append( contentViewPreviewTab );
            areaContainer.find('.layoutAreaContent').append( contentViewPreviewElement );

            self.activateContentViewPreview();
            
            if (startEditing) {
                window.setTimeout(function() {
                    self.editContentView(startEditing);
                }, 200);
            }
                        
        },


        /**
         * I update the contents of a preview element.
         *
         * @method updateContentViewPreview
         */
        updateContentViewPreview: function() {

            var self = this;

            self.contentViewPreviewTab.attr('data-type', self.contentViewData.type);
            self.contentViewPreviewTab.find('.contentViewTabName').text(self.contentViewData.name);

            self.contentViewPreviewElement.attr('data-type', self.contentViewData.type);
            self.contentViewPreviewElement.attr('data-size', self.contentViewData.contentSize);
            self.contentViewPreviewElement.find('.contentViewPreviewDescription').text(self.contentViewData.name +' '+ self.contentViewData.contentSize);

            self.resizeLayoutAreaPreview();

        },


        /**
         * I render a ContentView tab.
         *
         * @method renderContentViewTab
         * @return {HTMLElement} tabElement
         */
        renderContentViewTab: function() {

            var self = this;
                tabElement = $('<div class="contentViewTab" '
                            +   'data-type="'+ self.contentViewData.type +'">'
                            +   '    <div class="contentViewTabName">'+ self.contentViewData.name +'</div>'
                            +   '</div>');

            tabElement.click(function() {
                self.activateContentView();
            });

            return tabElement;

        },


        /**
         * I render a ContentView Preview tab.
         *
         * @method renderContentViewPreviewTab
         * @return {HTMLElement} tabElement
         */
        renderContentViewPreviewTab: function() {

            var self = this;
                tabElement = $('<div class="contentViewTab" '
                            +   'data-type="'+ this.contentViewData.type +'">'
                            +   '    <div class="contentViewTabName">'+ this.contentViewData.name +'</div>'
                            +   '</div>');

            tabElement.click(function() {
                self.activateContentViewPreview();
            });

            return tabElement;

        },


        /**
         * I render a ContentView Container Element.
         *
         * @method renderContentViewContainer
         * @return {HTMLElement} containerElement
         */
        renderContentViewContainer: function() {

            var self = this;
                containerElement = $('<div class="contentViewContainer" '
                                    +'data-size="'+ this.contentViewData.contentSize +'" '
                                    +'data-type="'+ this.contentViewData.type +'">'
                                    +'    <div class="contentViewContents"></div>'
                                    +'</div>');

            return containerElement;

        },


        /**
         * I render a ContentView Preview Element.
         *
         * @method renderContentViewPreviewElement
         * @return {HTMLElement} previewElement
         */
        renderContentViewPreviewElement: function() {

            var self = this;
                previewElement = $('<div class="contentViewPreview" '
                            +   'data-size="'+ this.contentViewData.contentSize +'" '
                            +   'data-type="'+ this.contentViewData.type +'">'
                            +   '    <div class="contentViewOptions">'
                            +   '        <button class="editContentView"><span class="icon-pencil"></span></button>'
                            +   '        <button class="deleteContentView"><span class="icon-trash"></span></button>'
                            +   '    </div>'
                            +   '    <div class="contentViewPreviewDescription">'+ this.contentViewData.name +' '+ this.contentViewData.contentSize +'</div>'
                            +   '</div>');

            previewElement.find('.editContentView').click(function() {
                
                var contentViewPreviewElement = $(this).parents('.contentViewPreview');
                
                self.editContentView();

                console.log(self.contentCollection[0].data.tags);


            });

            previewElement.find('.deleteContentView').click(function() {
                
                // TODO: use closest()
                var closestContentViewTab = (self.contentViewTab.prev('.contentViewTab').length != 0) ? self.contentViewTab.prev('.contentViewTab') : self.contentViewTab.next('.contentViewTab');
                if ( closestContentViewTab.length != 0 ) {
                    closestContentViewTab.click();
                } else {
                    self.resizeLayoutArea(true);
                }

                // TODO: use closest()
                var closestContentViewPreviewTab = (self.contentViewPreviewTab.prev('.contentViewTab').length != 0) ? self.contentViewPreviewTab.prev('.contentViewTab') : self.contentViewPreviewTab.next('.contentViewTab');
                if ( closestContentViewPreviewTab.length != 0 ) {
                    closestContentViewPreviewTab.click();
                } else {
                    self.resizeLayoutAreaPreview(true);
                }

                FrameTrail.module('ViewLayout').removeContentView(self);

            });

            return previewElement;

        },


        /**
         * I activate a ContentView (tab and container element) 
         *
         * @method activateContentView
         */
        activateContentView: function() {

            if (this.contentViewContainer.length == 0) {
                this.resizeLayoutArea(true);
                return;
            }

            this.contentViewTab.siblings('.contentViewTab').removeClass('active');
            this.contentViewTab.addClass('active');

            this.contentViewContainer.siblings('.contentViewContainer').removeClass('active');
            this.contentViewContainer.addClass('active');
                        
            this.resizeLayoutArea();

        },


        /**
         * I activate a ContentView Preview (tab and preview element) 
         *
         * @method activateContentViewPreview
         */
        activateContentViewPreview: function() {

            if (this.contentViewPreviewElement.length == 0) {
                this.resizeLayoutAreaPreview(true);
                return;
            }

            this.contentViewPreviewTab.siblings('.contentViewTab').removeClass('active');
            this.contentViewPreviewTab.addClass('active');

            this.contentViewPreviewElement.siblings('.contentViewPreview').removeClass('active');
            this.contentViewPreviewElement.addClass('active');
                        
            this.resizeLayoutAreaPreview();

        },


        /**
         * I resize a LayoutArea based on a ContentView size.
         *
         * @method resizeLayoutArea
         * @param {Boolean} isEmpty
         */
        resizeLayoutArea: function(isEmpty) {
            var areaContainer = this.getLayoutAreaContainer();

            if (isEmpty) {
                areaContainer.removeAttr('data-size');
            } else {
                areaContainer.attr('data-size', this.contentViewData.contentSize);
            }

            FrameTrail.changeState('viewSize', FrameTrail.getState('viewSize'));
            
        },

        
        /**
         * I resize a LayoutArea preview based on a ContentView size.
         *
         * @method resizeLayoutAreaPreview
         * @param {Boolean} isEmpty
         */
        resizeLayoutAreaPreview: function(isEmpty) {
            var areaContainer = this.getLayoutAreaPreviewContainer();

            if (isEmpty) {
                areaContainer.removeAttr('data-size');
            } else {
                areaContainer.attr('data-size', this.contentViewData.contentSize);
            }
            
        },


        /**
         * I distribute the Collection Elements in the contentViewContainer, so that they
         * match closely to the position of their related timelineElements.
         * When they would start to overlap, I arrange them in groups.
         *
         * @method distributeElements
         */
        distributeElements: function() {

            if ( this.whichArea == 'left' || this.whichArea == 'right' ) {
                return;
            }

            var self = this,
                annotations         = self.contentCollection,
                videoDuration       = FrameTrail.module('HypervideoModel').duration,
                sliderParent        = self.contentViewContainer,
                containerElement    = self.contentViewContainer.find('.contentViewContents'),
                groupCnt            = 0,
                gap                 = 4,
                thisElement,
                previousElement,
                previousElementRightPos,
                startTime,
                endTime,
                middleTime,
                desiredPosition,
                finalPosition;

            containerElement.children().removeAttr('data-group-id');
            containerElement.children().css({
                position: '',
                left:     ''
            });

            function getTotalWidth(collection, addition){

                var totalWidth = 0;
                collection.each(function() {
                    totalWidth += $(this).width()+addition;
                });
                return totalWidth;

            }

            function getNegativeOffsetRightCorrection(leftPosition, collectionWidth) {
                
                var offsetCorrection,
                    mostRightPos = leftPosition + collectionWidth + (gap*2);

                if ( mostRightPos >= sliderParent.width() ) {
                    
                    offsetCorrection = mostRightPos - sliderParent.width();

                    return offsetCorrection;
                    
                }

                return 0;
            }

            // Cancel if total width > container width
            if ( getTotalWidth(containerElement.children(), 3) > sliderParent.width() ) {
                containerElement.width( getTotalWidth(containerElement.children(), 3) );
                return;
            } else {
                containerElement.width('');
            }
            
            // Distribute Items
            for (var i = 0; i < annotations.length; i++) {

                thisElement = self.getContentViewElementFromContentItem(annotations[i]);

                //console.log(thisElement);
                if (i > 0) {
                    previousElement         = self.getContentViewElementFromContentItem(annotations[i-1]);
                    previousElementRightPos = previousElement.position().left + previousElement.width();
                }

                startTime   = annotations[i].data.start;
                endTime     = annotations[i].data.end;
                middleTime  = startTime + ( (endTime-startTime)/2 );
                
                desiredPosition = ( (sliderParent.width() / videoDuration) * middleTime ) - ( thisElement.width()/2 );
                //console.log(desiredPosition);
                
                thisElement.attr({
                    'data-in':  startTime,
                    'data-out': endTime
                });

                if (desiredPosition <= 0) {
                    finalPosition = 0;
                    thisElement.removeAttr('data-group-id');
                    groupCnt++;

                } else if (desiredPosition < previousElementRightPos + gap) {

                    
                    finalPosition = previousElementRightPos + gap;

                    if (previousElement.attr('data-group-id')) {

                        containerElement.children('[data-group-id="'+ previousElement.attr('data-group-id') +'"]').attr('data-group-id', groupCnt);

                    } else {

                        previousElement.attr('data-group-id', groupCnt);

                    }

                    thisElement.attr('data-group-id', groupCnt);
                    groupCnt++;

                } else {

                    finalPosition = desiredPosition;
                    thisElement.removeAttr('data-group-id');
                    groupCnt++;

                }

                thisElement.css({
                    position: "absolute",
                    left: finalPosition + "px"
                });

            }

            // Re-Arrange Groups

            var groupCollection,
                p,
                previousGroupCollection,
                previousGroupCollectionRightPos,
                totalWidth,
                groupStartTime,
                groupEndTime,
                groupMiddleTime,
                desiredGroupPosition,
                correction,
                negativeOffsetRightCorrection,
                groupIDs;
            
            function arrangeGroups() {

                groupIDs = [];

                containerElement.children('[data-group-id]').each(function() {
                    if ( groupIDs.indexOf( $(this).attr('data-group-id') ) == -1 ) {
                        groupIDs.push($(this).attr('data-group-id'));
                    }
                });

                for (var i=0; i < groupIDs.length; i++) {
                    
                    var g = groupIDs[i];

                    groupCollection = containerElement.children('[data-group-id="'+ g +'"]');

                    if (groupCollection.length < 1) {
                        continue;
                    }

                    if ( groupIDs[i-1] ) {
                        p = groupIDs[i-1];
                        previousGroupCollection         = containerElement.children('[data-group-id="'+ p +'"]');
                        previousGroupCollectionRightPos = previousGroupCollection.eq(0).position().left + getTotalWidth( previousGroupCollection, 3 );
                    }

                    totalWidth      = getTotalWidth( groupCollection, 3 );

                    groupStartTime  = parseInt(groupCollection.eq(0).attr('data-in'));
                    groupEndTime    = parseInt(groupCollection.eq(groupCollection.length-1).attr('data-out'));
                    groupMiddleTime = groupStartTime + ( (groupEndTime-groupStartTime)/2 );

                    desiredGroupPosition = ( (sliderParent.width() / videoDuration) * groupMiddleTime ) - ( totalWidth/2 );

                    correction = groupCollection.eq(0).position().left - desiredGroupPosition;

                    if ( groupCollection.eq(0).position().left - correction >= 0 && desiredGroupPosition > previousGroupCollectionRightPos + gap ) {
                        
                        groupCollection.each(function() {
                            $(this).css('left', '-='+ correction +'');
                        });

                    } else if ( groupCollection.eq(0).position().left - correction >= 0 && desiredGroupPosition < previousGroupCollectionRightPos + gap ) {
                        
                        var  attachCorrection = groupCollection.eq(0).position().left - previousGroupCollectionRightPos;
                        groupCollection.each(function() {
                            
                            $(this).css('left', '-='+ attachCorrection +'');

                        });

                        if ( groupCollection.eq(0).prev().length ) {
                            
                            var prevElem = groupCollection.eq(0).prev();

                            if ( prevElem.attr('data-group-id') ) {

                                previousGroupCollection.attr('data-group-id', g);

                            } else {

                                prevElem.attr('data-group-id', g);
                                
                            }
                            
                        }

                    }

                }

            }

            arrangeGroups();
            


            // Deal with edge case > elements outside container on right side
            
            var repeatIteration;

            function solveRightEdgeOverlap() {

                repeatIteration = false;

                for (var i = 0; i < annotations.length; i++) {

                    thisElement = self.getContentViewElementFromContentItem(annotations[i]);

                    var g = undefined;
                    
                    if ( thisElement.attr('data-group-id') ) {
                        g = thisElement.attr('data-group-id');
                        groupCollection = containerElement.children('[data-group-id="'+ g +'"]');
                    } else {
                        groupCollection = thisElement;
                    }

                    if (groupCollection.eq(0).prev().length) {
                        
                        previousElement = groupCollection.eq(0).prev();

                        if ( previousElement.attr('data-group-id') ) {

                            previousGroupCollection         = containerElement.children('[data-group-id="'+ previousElement.attr('data-group-id') +'"]');
                            previousGroupCollectionRightPos = previousGroupCollection.eq(0).position().left + getTotalWidth( previousGroupCollection, 3 );

                        } else {

                            previousGroupCollection         = previousElement;
                            previousGroupCollectionRightPos = previousElement.position().left + previousElement.width() + gap;
                            
                        }

                        
                    } else {
                        previousGroupCollectionRightPos = 0;
                    }

                    totalWidth = getTotalWidth( groupCollection, 3 );

                    currentGroupCollectionLeft = groupCollection.eq(0).position().left;
                    currentGroupCollectionRightPos = groupCollection.eq(0).position().left + totalWidth;

                    negativeOffsetRightCorrection = getNegativeOffsetRightCorrection(currentGroupCollectionLeft, totalWidth);

                    if ( currentGroupCollectionLeft - negativeOffsetRightCorrection >= 0  && negativeOffsetRightCorrection > 1 ) {
                        
                        if ( currentGroupCollectionLeft - negativeOffsetRightCorrection > previousGroupCollectionRightPos + gap ) {
                            
                            groupCollection.each(function() {
                                $(this).css('left', '-='+ negativeOffsetRightCorrection +'');
                            });

                        } else if ( currentGroupCollectionLeft - negativeOffsetRightCorrection < previousGroupCollectionRightPos + gap ) {

                            var attachCorrection = currentGroupCollectionLeft - previousGroupCollectionRightPos;
                            groupCollection.each(function() {
                                $(this).css('left', '-='+ attachCorrection +'');
                            });

                            if ( !g && previousElement.length && previousElement.attr('data-group-id') ) {
                                
                                thisElement.attr('data-group-id', previousElement.attr('data-group-id'));

                            }

                            if ( previousElement.attr('data-group-id') ) {

                                containerElement.children('[data-group-id="'+ previousElement.attr('data-group-id') +'"]').attr('data-group-id', g);
                                
                            } else {

                                previousElement.attr('data-group-id', g);

                            }                        
                            
                            
                            repeatIteration = false;                            

                        }

                    }

                }

                if ( repeatIteration ) {
                    solveRightEdgeOverlap();
                }

            }

            solveRightEdgeOverlap();
            

        },


        /**
         * I update the slider for the current contentCollection
         *
         * @method updateCollectionSlider
         */
        updateCollectionSlider: function() {

            var widthOfSlider           = 0,
                heightOfSlider          = 0,
                gap                     = 4,
                slideAxis               = (this.whichArea == 'top' || this.whichArea == 'bottom') ? 'x' : 'y',
                sliderParent            = this.contentViewContainer,
                sliderElement           = this.contentViewContainer.find('.contentViewContents');

            // Set sliderElement Dimensions

            if ( slideAxis == 'x' ) {
                
                for (var idx in this.contentCollection) {
                    widthOfSlider += this.getContentViewElementFromContentItem(this.contentCollection[idx]).width() + gap;
                }

                if ( widthOfSlider > sliderParent.width() ) {
                    sliderElement.width(widthOfSlider);
                } else {
                    sliderElement.width('');
                    return;
                }

            } else {
                
                for (var idx in this.contentCollection) {
                    heightOfSlider += this.getContentViewElementFromContentItem(this.contentCollection[idx]).height() + gap;
                }

                if ( heightOfSlider > sliderParent.height() ) {
                    sliderElement.height(heightOfSlider);
                } else {
                    sliderElement.height('');
                    return;
                }

            }

            // Slide to active Annotation Element

            var activeAnnotations = [];

            for (var idx in this.contentCollection) {
                
                // TODO: CHECK WHY ANNOTATIONS IN IDENTICAL CONTENT COLLECTIONS ARE NOT SET ACTIVE (only first one)!
                // console.log(this.whichArea, this.contentCollection[idx].activeStateInContentView(this));

                if ( this.contentCollection[idx].activeStateInContentView(this) ) {
                    activeAnnotations.push(this.contentCollection[idx]);
                }
            }

            if (activeAnnotations.length == 0) {
                return;
            }

            var activeAnnotationElement = this.getContentViewElementFromContentItem(activeAnnotations[0]),
                activeElementPosition   = activeAnnotationElement.position();

            if ( slideAxis == 'x' ) {
                
                if ( widthOfSlider > sliderParent.width() ) {
                    
                    var leftOffset = -1 * (     activeElementPosition.left 
                                              - 1 
                                              - sliderParent.innerWidth() / 2
                                              + activeAnnotationElement.width() / 2
                                    );
                    
                    if ( leftOffset > 0 ) {
                        sliderElement.css('left', 0);
                    } else if ( leftOffset < - (widthOfSlider - sliderParent.width()) ) {
                        sliderElement.css('left', - (widthOfSlider - sliderParent.width()));
                    } else {
                        sliderElement.css('left', leftOffset);
                    }

                }
                

            } else {
                
                if ( heightOfSlider > sliderParent.height() ) {
                    
                    var topOffset = -1 * (      activeElementPosition.top 
                                              - 1
                                              - sliderParent.innerHeight() / 2
                                              + activeAnnotationElement.height() / 2
                                    );
                    
                    if ( topOffset > 0 ) {
                        sliderElement.css('top', 0);
                    } else if ( topOffset < - (heightOfSlider - sliderParent.height()) ) {
                        sliderElement.css('top', - (heightOfSlider - sliderParent.height()));
                    } else {
                        sliderElement.css('top', topOffset);
                    }

                }

            }
            

        },


        /**
         * I create an edit dialog for a ContentView
         *
         * @method editContentView
         * @param {Boolean} isNew 
         */
        editContentView: function(isNew) {

            var elementOrigin = this.contentViewPreviewElement,
                animationDiv = elementOrigin.clone(),
                originOffset = elementOrigin.offset(),
                finalTop = ($(window).height()/2) - 300,
                finalLeft = ($(window).width()/2) - 407,
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
                width: 814 + 'px',
                height: 600 + 'px'
            }, 300, function() {
                
                
                var dialogTitle = (isNew) ? 'New Content View' : 'Edit Content View',
                    editDialog = $('<div class="editContentViewDialog" title="'+ dialogTitle +'"></div>');

                editDialog.append(self.renderContentViewPreviewEditingUI());

                editDialog.dialog({
                    resizable: false,
                    draggable: false,
                    width: 814,
                    height: 600,
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
                        if (editDialog.find('.CodeMirror').length != 0) {
                            editDialog.find('.CodeMirror').each(function() {
                                $(this)[0].CodeMirror.refresh();
                            });
                        }
                    },
                    buttons: [
                        { text: 'OK',
                            click: function() {
                                
                                var newContentViewData = self.getDataFromEditingUI($(this));

                                self.contentViewData = newContentViewData;
                                console.log(self.contentViewData);
                                self.updateContentViewPreview();

                                self.updateContent();

                                FrameTrail.module('HypervideoModel').newUnsavedChange('layout');

                                $(this).dialog( 'close' );
                            }
                        }
                    ]
                });

            });

        },


        /**
         * I render the Editing UI for a ContentView
         *
         * @method renderContentViewPreviewEditingUI
         * @return {HTMLElement} editingUI
         */
        renderContentViewPreviewEditingUI: function() {

            var contentViewData = this.contentViewData,
                editingUI = $('<div class="contentViewEditingUI">'
                            +'    <div class="contentViewData formColumn column2" data-property="type" data-value="'+ contentViewData.type +'">'
                            +'        <label>Type:</label>'
                            +'        <div '+ (contentViewData.type == 'TimedContent' ? 'class="active"' : '') +' data-value="TimedContent">Content Collection</div>'
                            +'        <div '+ (contentViewData.type == 'CustomHTML' ? 'class="active"' : '') +' data-value="CustomHTML">Custom HTML</div>'
                            +'        <div '+ (contentViewData.type == 'Transcript' ? 'class="active"' : '') +' data-value="Transcript">Text Transcript</div>'
                            +'    </div>'
                            +'    <div class="generic formColumn column2">'
                            +'        <div class="contentViewData" data-property="contentSize" data-value="'+ contentViewData.contentSize +'">'
                            +'            <label>Size:</label>'
                            +'            <div '+ (contentViewData.contentSize == 'small' ? 'class="active"' : '') +' data-value="small">Small</div>'
                            +'            <div '+ (contentViewData.contentSize == 'medium' ? 'class="active"' : '') +' data-value="medium">Medium</div>'
                            +'            <div '+ (contentViewData.contentSize == 'large' ? 'class="active"' : '') +' data-value="large">Large</div>'
                            +'        </div>'
                            +'    </div>'
                            +'    <div style="clear: both;"></div>'
                            +'    <hr>'
                            +'    <div class="generic formColumn column1">'
                            +'        <label>Name:</label>'
                            +'        <input type="text" class="contentViewData" data-property="name" data-value="'+ contentViewData.name +'" value="'+ contentViewData.name +'" placeholder="(optional)"/>'
                            +'    </div>'
                            +'    <div class="generic formColumn column3">'
                            +'        <label>Description:</label>'
                            +'        <textarea class="contentViewData" data-property="description" data-value="'+ contentViewData.description +'" placeholder="(optional)">'+ contentViewData.description +'</textarea>'
                            +'    </div>'
                            +'    <div style="clear: both;"></div>'
                            +'    <div class="generic" style="display: none;">'
                            +'        <label>CSS Class:</label>'
                            +'        <input type="text" class="contentViewData" data-property="cssClass" data-value="'+ contentViewData.cssClass +'" value="'+ contentViewData.cssClass +'" placeholder="(optional)"/>'
                            +'    </div>'
                            +'    <hr>'
                            +'    <div class="typeSpecific '+ (contentViewData.type == 'TimedContent' ? 'active' : '') +'" data-type="TimedContent">'
                            +'        <label>Content Filter:</label>'
                            +'        <div class="formColumn column1">'
                            +'            <label>Tags</label>'
                            +'            <input type="text" class="contentViewData" data-property="collectionFilter-tags" data-value="'+ contentViewData.collectionFilter.tags +'" value="'+ contentViewData.collectionFilter.tags +'" placeholder="(optional)"/>'
                            +'        </div>'
                            +'        <div class="formColumn column1">'
                            +'            <label>Types</label>'
                            +'            <input type="text" class="contentViewData" data-property="collectionFilter-types" data-value="'+ contentViewData.collectionFilter.types +'" value="'+ contentViewData.collectionFilter.types +'" placeholder="(optional)"/>'
                            +'        </div>'
                            +'        <div class="formColumn column1">'
                            +'            <label>Users</label>'
                            +'            <input type="text" class="contentViewData" data-property="collectionFilter-users" data-value="'+ contentViewData.collectionFilter.users +'" value="'+ contentViewData.collectionFilter.users +'" placeholder="(optional)"/>'
                            +'        </div>'
                            +'        <div class="formColumn column1">'
                            +'            <label>Text</label>'
                            +'            <input type="text" class="contentViewData" data-property="collectionFilter-text" data-value="'+ contentViewData.collectionFilter.text +'" value="'+ contentViewData.collectionFilter.text +'" placeholder="(optional)"/>'
                            +'        </div>'
                            +'        <div style="clear: both;"></div>'
                            +'        <hr>'
                            +'    </div>'
                            +'    <div class="typeSpecific codeEditorSmall '+ (contentViewData.type == 'TimedContent' ? 'active' : '') +'" data-type="TimedContent">'
                            /*
                            +'        <div class="contentViewData formColumn column1" data-property="mode" data-value="'+ contentViewData.mode +'">'
                            +'            <label>Mode:</label>'
                            +'            <div '+ (contentViewData.mode == 'slide' ? 'class="active"' : '') +' data-value="slide">Slide</div>'
                            +'            <div '+ (contentViewData.mode == 'toggle' ? 'class="active"' : '') +' data-value="toggle">Show / Hide</div>'
                            +'            <div '+ (contentViewData.mode == 'scroll' ? 'class="active"' : '') +' data-value="scroll">Scroll</div>'
                            +'        </div>'
                            +'        <div class="contentViewData formColumn column1" data-property="axis" data-value="'+ contentViewData.axis +'">'
                            +'            <label>Direction:</label>'
                            +'            <div '+ (contentViewData.axis == 'x' ? 'class="active"' : '') +' data-value="x">Horizontal</div>'
                            +'            <div '+ (contentViewData.axis == 'y' ? 'class="active"' : '') +' data-value="y">Vertical</div>'
                            +'        </div>'
                            +'        <div class="contentViewData formColumn column1" data-property="autoSync" data-value="'+ contentViewData.autoSync +'">'
                            +'            <label>Auto Sync:</label>'
                            +'            <div '+ (contentViewData.autoSync ? 'class="active"' : '') +' data-value="true">Yes</div>'
                            +'            <div '+ (!contentViewData.autoSync ? 'class="active"' : '') +' data-value="false">No</div>'
                            +'        </div>'
                            +'        <div style="clear: both;"></div>'
                            +'        <hr>'
                            */
                            +'        <label>OnClick Content Item:</label>'
                            +'        <textarea class="contentViewData" data-property="onClickContentItem" data-value="'+ contentViewData.onClickContentItem +'" placeholder="(optional)">'+ contentViewData.onClickContentItem +'</textarea>'
                            +'    </div>'
                            +'    <div class="typeSpecific codeEditorLarge '+ (contentViewData.type == 'CustomHTML' ? 'active' : '') +'" data-type="CustomHTML">'
                            +'        <label>Custom HTML:</label>'
                            +'        <textarea class="contentViewData" data-property="html" data-value="'+ contentViewData.html +'">'+ contentViewData.html +'</textarea>'
                            +'    </div>'
                            +'    <div class="typeSpecific '+ (contentViewData.type == 'Transcript' ? 'active' : '') +'" data-type="Transcript">'
                            +'        <label>Transcript Source:</label>'
                            +'        <input type="text" class="contentViewData" data-property="transcriptSource" data-value="'+ contentViewData.transcriptSource +'" value="'+ contentViewData.transcriptSource +'" />'
                            +'    </div>'
                            +'</div>');
            
            editingUI.find('.contentViewData').each(function() {
                
                var datachoices = $(this).children('div[data-value]');

                if (datachoices.length != 0) {
                    datachoices.click(function() {
                        $(this).siblings('div[data-value]').removeClass('active');
                        $(this).addClass('active');

                        var parent = $(this).parent('.contentViewData');

                        parent.attr('data-value', $(this).attr('data-value'));

                        if (parent.attr('data-property') == 'type') {
                            editingUI.find('.typeSpecific').removeClass('active');
                            editingUI.find('.typeSpecific[data-type="'+ parent.attr('data-value') +'"]').addClass('active');
                        }

                        if (editingUI.find('.CodeMirror').length != 0) {
                            editingUI.find('.CodeMirror').each(function() {
                                $(this)[0].CodeMirror.refresh();
                            });
                        }
                    });
                }

            });

            // Init CodeMirror for onClickContentItem

            var textarea = editingUI.find('.contentViewData[data-property="onClickContentItem"]');

            var codeEditor = CodeMirror.fromTextArea(textarea[0], {
                    value: textarea[0].value,
                    lineNumbers: true,
                    mode:  'javascript',
                    gutters: ['CodeMirror-lint-markers'],
                    lint: true,
                    lineWrapping: true,
                    tabSize: 2,
                    theme: 'hopscotch'
                });
            codeEditor.on('change', function(instance, changeObj) {
                
                var thisTextarea = $(instance.getTextArea());
                                
                $(thisTextarea).attr('data-value', instance.getValue());

                thisTextarea.val(instance.getValue());
                

            });
            codeEditor.setSize(null, '100%');

            // Init CodeMirror for Custom HTML

            var htmlTextarea = editingUI.find('.contentViewData[data-property="html"]');

            var htmlCodeEditor = CodeMirror.fromTextArea(htmlTextarea[0], {
                    value: htmlTextarea[0].value,
                    lineNumbers: true,
                    mode:  'text/html',
                    htmlMode: true,
                    lint: true,
                    lineWrapping: true,
                    tabSize: 2,
                    theme: 'hopscotch'
                });
            htmlCodeEditor.on('change', function(instance, changeObj) {
                
                var thisTextarea = $(instance.getTextArea());
                                
                $(thisTextarea).attr('data-value', instance.getValue());

                thisTextarea.val(instance.getValue());
                

            });
            htmlCodeEditor.setSize(null, '100%');


            return editingUI;

        },


        /**
         * I collect all data values from Editing UI elements
         * and return them in a data object.
         * 
         * @method getDataFromEditingUI
         * @param {HTMLElement} editingUIContainer
         * @return {Object} newDataObject
         */
        getDataFromEditingUI: function( editingUIContainer ) {

            var newDataObject = {};

            editingUIContainer.find('.contentViewData').each(function() {
                
                var newValue;
                if ( $(this).is('input') || $(this).is('textarea') ) {
                    newValue = $(this).val();
                } else {
                    newValue = $(this).attr('data-value');
                }

                if (newValue == 'true') {
                    newValue = true;
                } else if (newValue == 'false') {
                    newValue = false;
                }

                if ( $(this).attr('data-property').indexOf('-') != -1 ) {
                    var splitProperty = $(this).attr('data-property').split('-'),
                        subObject = splitProperty[0],
                        subProperty = splitProperty[1];
                    if ( !newDataObject[subObject] ) {
                        newDataObject[subObject] = {};
                    }
                    newDataObject[subObject][subProperty] = newValue;
                } else {
                    newDataObject[$(this).attr('data-property')] = newValue;
                }
            });

            // TODO: Replace with actual data values
            newDataObject.collectionFilter.tags = [];
            newDataObject.collectionFilter.types = [];
            newDataObject.collectionFilter.users = [];

            return newDataObject;    

        },


        /**
         * I return the LayoutArea Container of the ContentView.
         *
         * @method getLayoutAreaContainer
         * @return {HTMLElement} areaContainer
         */
        getLayoutAreaContainer: function() {
            
            var ViewVideo = FrameTrail.module('ViewVideo'),
                areaContainer;

            switch (this.whichArea) {
                case 'top':
                    areaContainer = ViewVideo.AreaTopContainer;
                    break;
                case 'bottom':
                    areaContainer = ViewVideo.AreaBottomContainer;
                    break;
                case 'left':
                    areaContainer = ViewVideo.AreaLeftContainer;
                    break;
                case 'right':
                    areaContainer = ViewVideo.AreaRightContainer;
                    break;
            }

            return areaContainer;
            
        },


        /**
         * I return the LayoutArea Preview Container of the ContentView.
         *
         * @method getLayoutAreaPreviewContainer
         * @return {HTMLElement} areaContainer
         */
        getLayoutAreaPreviewContainer: function() {
            
            var HypervideoLayoutContainer = FrameTrail.module('ViewVideo').HypervideoLayoutContainer,
                areaContainer;

            switch (this.whichArea) {
                case 'top':
                    areaContainer = HypervideoLayoutContainer.find('.layoutArea[data-area="areaTop"]');
                    break;
                case 'bottom':
                    areaContainer = HypervideoLayoutContainer.find('.layoutArea[data-area="areaBottom"]');
                    break;
                case 'left':
                    areaContainer = HypervideoLayoutContainer.find('.layoutArea[data-area="areaLeft"]');
                    break;
                case 'right':
                    areaContainer = HypervideoLayoutContainer.find('.layoutArea[data-area="areaRight"]');
                    break;
            }

            return areaContainer;
            
        }


    }

);
