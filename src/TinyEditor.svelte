<script>
  import Editor from '@tinymce/tinymce-svelte';

  let editorId
  let editorContent = '<p style="font-family:serif;">"Hello <i>World</i></p>'
  const conf = {
    external_plugins: {
      pluginId: '/js/footnotes-traditional/plugin.js'
    },
    plugins: ' footnotes-traditional link code lists advlist table nonbreaking paste searchreplace spellchecker charmap fullscreen pagebreak wordcount',
    toolbar: 'blocks fontfamily fontsize h1 code bold italic copy cut paste accordion accordiontoggle accordionremove visualblocks visualchars footnotes-traditional',
  }

  function handleChange (e) {
    console.log('change event')
    console.log(e)
  }

  function handleNodeChange (e) {
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