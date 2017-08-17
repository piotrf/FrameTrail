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

                    self.contentViewContainer.html('<div class="customhtmlContainer">'+ self.contentViewData.html +'</div>');

                    break;

                case 'Transcript':
                    
                    self.contentCollection.forEach(function (contentItem) {
                        self.removeContentCollectionElements(contentItem);
                    });

                    self.contentViewContainer.html('<div class="transcriptContainer">TRANSCRIPT HERE</div>');
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
            this.contentViewContainer.append(collectionElement);

            contentItem.contentViewElements.push(collectionElement);

        },


        removeContentCollectionElements: function(contentItem) {
            // TODO
            // single item (like an annotation)
            // console.log(contentItem);

            // TODO: CHECK WHY contentItem is undefined !!!

            if (contentItem) {
                
                for (var i=0; i<contentItem.contentViewElements.length; i++) {
                    
                    if ( this.contentViewContainer.find(contentItem.contentViewElements[i]).length != 0 ) {
                        this.contentViewContainer.find(contentItem.contentViewElements[i]).remove();

                        contentItem.contentViewElements.splice(
                            contentItem.contentViewElements.indexOf(contentItem),
                            1
                        );
                    }
                    
                }

            }

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
                            +   'data-size="'+ this.contentViewData.contentSize +'" '
                            +   'data-type="'+ this.contentViewData.type +'">'
                            +   '</div>');

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
                    },
                    buttons: [
                        { text: 'OK',
                            click: function() {
                                
                                var newContentViewData = self.getDataFromEditingUI($(this));

                                self.contentViewData = newContentViewData;
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
                            +'    <div class="typeSpecific '+ (contentViewData.type == 'TimedContent' ? 'active' : '') +'" data-type="TimedContent">'
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
                            +'        <label>OnClick Content Item:</label>'
                            +'        <textarea class="contentViewData" data-property="onClickContentItem" data-value="'+ contentViewData.onClickContentItem +'" placeholder="(optional)">'+ contentViewData.onClickContentItem +'</textarea>'
                            +'    </div>'
                            +'    <div class="typeSpecific '+ (contentViewData.type == 'CustomHTML' ? 'active' : '') +'" data-type="CustomHTML">'
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
                    });
                }

            });

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
