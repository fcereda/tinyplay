<script>
  import Editor from '@tinymce/tinymce-svelte';

  let editorId
  let editorContent = '<p style="font-family:serif;">"Hello <i>World</i></p>'
  const conf = {
    extended_valid_elements: "+@[data-*]",
    external_plugins: {
      pluginId: '/js/nomad-footnotes/plugin.js'
    },
    plugins: 'nomad-footnotes link code lists advlist table nonbreaking paste searchreplace spellchecker charmap fullscreen pagebreak wordcount',
    toolbar: 'blocks fontfamily fontsize h1 code bold italic copy cut paste accordion accordiontoggle accordionremove visualblocks visualchars footnotes-traditional',
    noneditable_class: 'mceNonEditable',
    editable_class: 'mceEditable',    
    setup: function (editor) {
      console.log('SETUP')
      editor.on('init', function(e) {
        // UNCOMMENT THIS TO SET THE EDITOR IN FULLSCREEN MODE!!
        editor.execCommand('mceFullScreen')
        const bodyElement = editor.dom.getRoot()    
        setupObservers(bodyElement, altCallback(bodyElement))
      })
    }    
  }

  function setupObservers (bodyElement, callback) {
    var listObserver = new MutationObserver(callback);
    listObserver.observe(bodyElement, { childList: true, subtree: true });
  }

  function stdCallback (mutationList, observer) {
    console.warn('mutation callback!')
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
            checkFootnoteElements(bodyElement)
            checkNodeMutation(mutation)
        } else if (mutation.type === "attributes") {
            console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
    }
  }

  function altCallback (bodyElement) {
    return (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
            checkFootnoteElements(bodyElement)
        } 
      }
    }  
  }

  function checkNodeMutation (mutation) {
    const removedNodes = mutation.removedNodes
    const checkNodeList = (nodelist) => {
      for (let i = 0; i < nodelist.length; i++) {
        const node = nodelist[i]
        console.log(node.nodeValue)
        //const attrib = Element.prototype.getAttribute.call(node, 'aria-describedby')
        return false
        const getAttribute = Element.prototype.getAttribute.bind(node)
        const attrib = getAttribute('aria-describedby')
        if (attrib) {
        // if (node.getAttribute('aria-describedby')) {
          console.log('A footnote was deleted!')
          return true
        }
        if (node.hasChildNodes()) 
          return checkNodeList(node.childNodes)
      }
      return false  
    }

    console.log(removedNodes)
    if (!checkNodeList(removedNodes))
      console.log('Não encontrou footnotes nos nodes removidos')
  }


  function checkNodeMutation0 (mutation) {
    const removedNodes = mutation.removedNodes
     console.log(removedNodes)
    for (let i = 0; i < removedNodes.length; i++) {
      const node = removedNodes[i]
      if (node.querySelectorAll('[aria-describedby="footnote-header"]').length) {
        console.warn('A footnote was deleted!!')
        return
      }
    }
  }

  let numFootnoteElements = 0
  let footnoteCollection = null
  
  function checkFootnoteElements (bodyElement) {
    if (!footnoteCollection) {
      // footnoteCollection = bodyElement.querySelectorAll('[aria-describedby="footnote-header"]')
      footnoteCollection = bodyElement.getElementsByClassName('mceNonEditable')
    }  
    console.log(`footnoteCollection.length = ${footnoteCollection.length}`)
    if (footnoteCollection.length < numFootnoteElements) {
      console.warn('*** A footnote was removed!')
    } 
    else if (footnoteCollection.length > numFootnoteElements) {
      console.log('*** A footnote was added!!')
    }
    numFootnoteElements = footnoteCollection.length
  }




  function handleMutation (mutationList, observer) {
    console.log(mutationList)
    for (let i = 0; i < mutationList.length; i++) {
      const removedNodes = mutationList[i].removedNodes
      for (let j = 0; j < removedNodes.length; j++) {
        const node = removedNodes[j]
        if (node.classList.contains('mceNonEditable')) {
          console.warn('Algo foi removido!')
          return
          console.log('node removed: ', node.id)
        }
      }
    }
  }


  function handleChange (e) {
    console.log('change event')
    console.log(e)
  }

  function handleNodeChange (e) {
    console.log(e)
    return
    console.log('NodeChange')
    console.log(e)
    const selectionObj = e.detail.editor.selection
    console.log(selectionObj)
    const bookmark = selectionObj.getBookmark()
    console.log(e.detail.event.element)
    console.log(e.detail.event.element.innerHTML) //  = 'Hello World'
    //e.detail.event.element.innerHTML = 'Jello World'
    // e.detail.event.element.innerHTML = e.detail.event.element.innerHTML.replace(/e/g, 'é')
    selectionObj.setContent('à')
    selectionObj.moveToBookmark(bookmark)
  }

  function handleKeydown (e) {
    const OPENING_DOUBLE_QUOTE = '“'
    const CLOSING_DOUBLE_QUOTE = '”'
    const OPENING_SINGLE_QUOTE = '‘'  
	  const CLOSING_SINGLE_QUOTE = '’'	
	
    const editor = e.detail.editor
    const selection = editor.selection
    const sel = selection.getSel()
    const textContent = sel.baseNode.textContent
    const baseOffset = sel.baseOffset
    const prevChar = textContent.charAt(baseOffset-1)
    const nextChar = textContent.charAt(baseOffset)

    console.log(textContent)
    console.log('baseOffset = ', baseOffset, 'previous char =', prevChar, 'next char =', nextChar)

    const getCorrectQuoteChar = (key, prev, next) => {
      const START_OF_PARAGRAPH = ''
      const SPACE = ' '
      let openingQuote = OPENING_DOUBLE_QUOTE
      let closingQuote = CLOSING_DOUBLE_QUOTE
      if (key === "'") {
        openingQuote = OPENING_SINGLE_QUOTE
        closingQuote = CLOSING_SINGLE_QUOTE
      }	  

      if ([START_OF_PARAGRAPH, SPACE, CLOSING_DOUBLE_QUOTE, CLOSING_SINGLE_QUOTE].includes(prev))
        return openingQuote
      const prevCode = prev.charCodeAt(0)
      console.log(`prevCode = ${prevCode}`)
      if (prevCode == 160)
        return openingQuote

        console.log('vai retornar CLOSING_QUOTE')
      if ([',', '.', ';', '!', '?'].includes(next))
        return closingQuote 
      return closingQuote
    }

    const nativeEvent = e.detail.event
    const key = nativeEvent.key
	  const ctrlKey = nativeEvent.ctrlKey
    console.log(`key = ${key}, ctrlKey = ${ctrlKey}`)

    if (key === '"' || key == "'") {
      nativeEvent.preventDefault()
      nativeEvent.stopPropagation()
      if (!ctrlKey) {
      console.log('SMART QUOTES')
          const correctQuote = getCorrectQuoteChar(key, prevChar, nextChar)
          editor.selection.setContent(correctQuote)
      } 
      else {
        editor.selection.setContent(key)
      }	  
      return
    }  

    return
  } 

  
  function getBlockNode (node) {
    const blockNodes = ['P', 'TR', 'TD', 'TH', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    while (node) {
      console.log(node.nodeType, node.nodeName)
      if (blockNodes.includes(node.nodeName))
        return node
      node = node.parentElement
    }
    return null
  }

</script>

<main>
  <h1>Hello Tiny</h1>
  <Editor 
    inline={false} 
    bind:id={editorId}
    conf={conf} 
    value={editorContent}
    on:change={handleChange}
    on:nodechange={handleNodeChange}
    on:keydown={handleKeydown}
  />
</main>