tinymce.PluginManager.add('nomad-footnotes', function(editor, url) {

    /** Live list of all footnotes */
    let footnotesList
    
  
    const isBogusElement = element => Boolean(element.parentElement.getAttribute('data-mce-bogus'))

    const renumberFootnotes0 = function () {
        console.log(`entrou em renumberfootnotes`)
        if (!footnotesList) {
            footnotesList = editor.getBody().getElementsByClassName('nw-footnote')
        }
        for (let i = 0; i < footnotesList.length; i++) {
            console.log(footnotesList[i].parentElement)
            if (isBogusElement(footnotesList[i])) 
                break;
            const footnoteNumber = i + 1
            footnotesList[i].id = `footnote-ref-${footnoteNumber}`
            footnotesList[i].href = `#footnote-${footnoteNumber}`
            footnotesList[i].innerText = `(${footnoteNumber})`
        }
    }

    const renumberFootnotes = function () {
      console.log('entrou em renumberFootnotes2')
        if (!footnotesList) {
            footnotesList = editor.getBody().getElementsByClassName('nw-footnote')
        }
        const footnotesContents = editor.getBody().getElementsByClassName('nw-footnote-content')
        let mustUpdateFootnotesContainer = false
        let numFootnoteRefs = 0
        for (let i = 0; i < footnotesList.length; i++) {
            console.log(footnotesList[i].parentElement)
            if (isBogusElement(footnotesList[i])) {
              break
            }
            const footnoteNumber = i + 1
            const footnoteRefId = `footnote-ref-${footnoteNumber}`
            if (footnotesList[i].id != footnoteRefId) {
              footnotesList[i].id = footnoteRefId
              footnotesList[i].href = `#footnote-${footnoteNumber}`
              footnotesList[i].innerText = `(${footnoteNumber})`
              mustUpdateFootnotesContainer = true
            } 
            numFootnoteRefs += 1
        }
        if (footnotesContents.length !== numFootnoteRefs) {
          console.warn('footnotes refs and contents do not match, numrefs =', numFootnoteRefs)
          mustUpdateFootnotesContainer = true
        }

        if (mustUpdateFootnotesContainer) {
          console.warn('mustUpdateFootnotesContainer!!')   
          updateFootnotesContainer(true)   
        }
    }

    const createFootnotesContainer = function (populate=false) {
        if (!footnotesList?.length)
          return
        console.time('create-footnotes-container')        
        const newDiv = editor.dom.create('div', {
            id: 'footnotes-container',
            class: 'nw-footnotes-container',
            style: 'margin-top: 2em; outline:none;',
            contenteditable: 'false'
        }, '<hr style="margin-right: 50%;" />')
        const newList = editor.dom.create('ol', {
            id: 'footnotes-list',
            class: 'nw-footnotes-list',
            style: 'font-size:0.9em; margin-top: -0.25em;',
            contenteditable: 'false'
        })
        newDiv.append(newList)
        if (populate && footnotesList) {
            for (let i = 0; i < footnotesList.length; i++) {
                const footnote = footnotesList[i] 
                if (isBogusElement(footnote)) 
                  break
                const content = base64ToString(footnote.getAttribute('data-footnote-content'))
                const footnoteId = i + 1
                const newListItem = editor.dom.create('li', {
                    id: `footnote-${footnoteId}`,
                    class: 'nw-footnote-content',
                    style: 'margin-bottom: 0.5em;',
                    contenteditable: 'true',
                    'data-footnote-id': footnoteId,
                }, content)
                newList.append(newListItem)
            }
        }
        editor.dom.add(editor.getBody(), newDiv);
        console.timeEnd('create-footnotes-container')
        return newDiv
    }

    const updateFootnotesContainer = function () {
        try {
            const bodyElement = editor.getBody()
            const footnotesContainers = bodyElement.getElementsByClassName('nw-footnotes-container')
            for (let i = 0; i < footnotesContainers.length; i++) {
              footnotesContainers[i].remove()
            }  
            createFootnotesContainer(true)
        } catch (err) {
            console.error('Unable to update footnotes:', err )
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
                const data = api.getData();
                const content = data.footnoteContent || ' '
               
                const createFootnoteLink = (content, number=1) => {
                    return editor.dom.create('a', { 
                        id: `footnote-ref-${number}`, 
                        class: 'nw-footnote mceNonEditable', 
                        style: 'vertical-align: super; line-height: 1.0; font-size: 0.83em; font-weight: 600; text-decoration: none; cursor: pointer;',  // superscript 
                        href: `#footnote-${number}`, 
                        'data-footnote-content': stringToBase64(content),  // base64
                        'aria-describedby': 'footnote-header',
                        title: content,
                    }, `(${number})`);
                }

                editor.undoManager.transact(function() {
                    var footnoteLink = createFootnoteLink(content)
                    editor.selection.setNode(footnoteLink);
                    renumberFootnotes(); 
                    updateFootnotesContainer()                    
                });

                api.close();
            }
        })            
    }

    /*** Footnote contents observers ***/

    function handleFocusout (e) {
      const element = e.target
      if (!element.classList.contains('nw-footnote-content'))
        return
      const footnoteId = Number(element.getAttribute('data-footnote-id'))
      if (!footnoteId) {
        console.error('Error trying to update footnote, id =', footnoteId)
        return
      }
      const footnote = footnotesList[footnoteId - 1]
      footnote.setAttribute('data-footnote-content', stringToBase64(e.target.innerHTML))
      footnote.setAttribute('title', e.target.innerText)
    }


    /*** Mutation Observer ***/

    function setupObservers (bodyElement, callback) {
        var listObserver = new MutationObserver(callback);
        listObserver.observe(bodyElement, { childList: true, subtree: true });
    }

    function altCallback (bodyElement) {
        return (mutationList) => {
          let mustCheckFootnotes = false 
          for (const mutation of mutationList) {
            if (mutation.type === "childList") {
              mustCheckFootnotes = true  
            } 
          }
          if (mustCheckFootnotes)
            checkFootnoteElements(bodyElement)
        }  
    }    

    let numFootnoteElements = 0
    
    function checkFootnoteElements (bodyElement) {
      if (!footnotesList) 
        return
      if (footnotesList.length === numFootnoteElements) 
        return
      renumberFootnotes()
      numFootnoteElements = footnotesList.length
    }    

    /*** initialization function ***/

    editor.on('init', function(e) {
        const bodyElement = editor.getBody()    
        bodyElement && console.warn('We have a body!!')
        setupObservers(bodyElement, altCallback(bodyElement))
    })

    editor.on('focusout', handleFocusout)

    /*** Click events on the footnotes ***/

    editor.on('click', (e) => {
        if (!e.target.classList.contains('nw-footnote'))
          return
        const footnoteId = e.target.href.split('#')[1]
        const footnoteContents = editor.getBody().getElementsByClassName('nw-footnote-content')
        for (let i = 0; i < footnoteContents.length; i++) {
            if (footnoteContents[i].id == footnoteId) {
                const footnoteElement = footnoteContents[i]
                footnoteElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
                editor.selection.setCursorLocation(footnoteElement, 0)
                e.preventDefault()
                e.stopPropagation()
                return
            }
        }
    });

    editor.on('dblclick', (e) => {
        if (!e.target.classList.contains('nw-footnote'))
          return
        showFootnoteDialog({
            title: 'Footnote',
            content: base64ToString(e.target.getAttribute('data-footnote-content')),
            onSubmit: (api) => {
                const data = api.getData()
                e.target.setAttribute('data-footnote-content', stringToBase64(data.footnoteContent))
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


function stringToBase64(s) {      
    return btoa(unescape(encodeURIComponent(s)));
}

function base64ToString(s) {      
    return decodeURIComponent(escape(atob(s)));
}



