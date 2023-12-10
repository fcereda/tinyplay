tinymce.PluginManager.add('nomad-footnotes', function(editor, url) {

    /** Live list of all footnotes */
    let footnotesList
    
    const renumberFootnotes = function () {
        if (!footnotesList) {
            footnotesList = editor.getBody().getElementsByClassName('nw-footnote')
        }
        for (let i = 0; i < footnotesList.length; i++) {
            const footnoteNumber = i + 1
            footnotesList[i].innerText = `(${footnoteNumber})`
        }
    }

    const showFootnoteDialog = ({ title="New footnote", content='', onSubmit }) => {
        return editor.windowManager.open({
            title,
            body: {
                type: 'panel',
                items: [{
                    type: 'textarea',
                    name: 'footnoteContent',
                    multiline: true,
                    minWidth: 520,
                    minHeight: 100,
                }]
            },
            buttons: [{
                type: 'cancel',
                text: 'Close'
            },
            {
                type: 'submit',
                text: 'Save',
                primary: true
            }],  
            initialData: {
                footnoteContent: content,
            },    
            onSubmit
        })
    }


    /**
     * Insert a footnote at the caret position. Opens a dialog first for the user to write the footnote content.
     * @returns nothing
     */
    var addFootnote = function() {
        return showFootnoteDialog({
            onSubmit: function(api) {
                var data = api.getData();
               
                const createFootnoteLink = (content, number=1) => {
                    return editor.dom.create('a', { 
                        id: `footnote-ref-${number}`, 
                        class: 'nw-footnote mceNonEditable', 
                        style: 'vertical-align: super; line-height: 1.0; font-size: 0.83em; font-weight: 600; text-decoration: none; cursor: pointer;',  // superscript 
                        href: `#footnote-${number}`, 
                        'data-footnote-content': btoa(data.footnoteContent),  // base64
                        'aria-describedby': 'footnote-header',
                        title: data.footnoteContent,
                    }, `[${number}]`);
                }

                editor.undoManager.transact(function() {
                    var footnoteLink = createFootnoteLink(data.footnoteContent)
                    editor.selection.setNode(footnoteLink);
                    renumberFootnotes(); 
                });

                api.close();
            }
        })            
    }


    /*** Mutation Observer ***/

    function setupObservers (bodyElement, callback) {
        var listObserver = new MutationObserver(callback);
        listObserver.observe(bodyElement, { childList: true, subtree: true });
    }

    function altCallback (bodyElement) {
        return (mutationList) => {
          for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                checkFootnoteElements(bodyElement)
            } 
          }
        }  
    }    

    let numFootnoteElements = 0
    
    function checkFootnoteElements (bodyElement) {
      if (!footnotesList) return
      if (footnotesList.length !== numFootnoteElements) {
        renumberFootnotes()
      } 
      numFootnoteElements = footnotesList.length
    }    

    /*** initialization function ***/

    editor.on('init', function(e) {
        const bodyElement = editor.getBody()    
        bodyElement && console.warn('We have a body!!')
        setupObservers(bodyElement, altCallback(bodyElement))
    })

    /*** Click events on the footnotes ***/

    editor.on('click', (e) => {
        if (e.target.classList.contains('nw-footnote'))
          console.warn('Clicou numa footnote!')
    });

    editor.on('dblclick', (e) => {
        if (!e.target.classList.contains('nw-footnote'))
          return
        console.error('Dblclick numa footnote!')

        showFootnoteDialog({
            title: 'Footnote',
            content: atob(e.target.getAttribute('data-footnote-content')),
            onSubmit: (api) => {
                const data = api.getData()
                e.target.setAttribute('data-footnote-content', btoa(data.footnoteContent))
                e.target.setAttribute('title', data.footnoteContent)
                api.close()
            },    
        })
    });

    /*** Icons ***/
    editor.ui.registry.addIcon('footnote-add', '<svg height="24" width="24" clip-rule="evenodd" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m16.661 5.497-4.073-2.948h-10.339v18.578h14.412v-15.63z" fill="none" stroke="#000" stroke-width="1.5px"/><path d="m11.361 2.718v4.012h5.014" fill="none" stroke="#000" stroke-width="1.5px"/><path d="m5.328 11.199h4.95" fill="none" stroke="#000" stroke-width="1px"/><path d="m5.328 13.244h7.978" fill="none" stroke="#000" stroke-width="1px"/><rect x="5.303" y="15.674" width="8.074" height="2.625" fill="none" stroke="#000" stroke-width="1px"/><path d="m12.498 10.72h0.53" fill="none" stroke="#000" stroke-width="1px"/><path d="m20.041 9.331h2.331v8.499h-2.331" fill="none" stroke="#000" stroke-width="1.5px"/><path d="m19.769 16.719-0.71 0.984 0.655 1.08" fill="none" stroke="#000" stroke-width="1px"/></svg>');

    /*** Split Button ***/
    editor.ui.registry.addSplitButton('footnotes-traditional', {
        // text: 'Footnotes',
        icon: 'footnote-add',
        tooltip: 'Add a footnote',
        onAction: function() {
            addFootnote();
        },
        onItemAction: function(api, value) {
            removeFootnote();
        },
        fetch: function(callback) {
            var items = [{
                type: 'choiceitem',
                icon: 'footnote-remove',
                text: 'Show all footnotes',
                value: 'show_footnotes'
            }];
            callback(items);
        }
    });

    /*** Individual Buttons ***/
    editor.ui.registry.addButton('footnotes-traditional-add', {
        // text: 'Add Footnote',
        icon: 'footnote-add',
        tooltip: 'Add a footnote',
        onAction: function() {
            addFootnote();
        }
    });

    /*** Menu Items ***/
    editor.ui.registry.addMenuItem('footnotes-traditional-add', {
        text: 'Add Footnote',
        icon: 'footnote-add',
        onAction: function() {
            addFootnote();
        }
    });

    // Return the metadata for the plugin
    return {
        getMetadata: function() {
            return {
                name: 'Nomad Footnotes',
                url: 'https://nomadwriter.io'
            };
        }
    };
});

