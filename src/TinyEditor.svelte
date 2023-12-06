<script>
  import Editor from '@tinymce/tinymce-svelte';

  let editorId
  let editorContent = '<p style="font-family:serif;">"Hello <i>World</i></p>'
  const conf = {}

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
    const OPENING_QUOTE = '“'
    const CLOSING_QUOTE = '”'

    console.log('keydown')
  //  console.log(e)
    const editor = e.detail.editor
    const selection = editor.selection
  //  console.log(selection.getNode())
  //  console.log(selection.getSel())
    const sel = selection.getSel()
    console.log('sel')
    console.log(sel)
    const { textContent, baseOffset } = sel.baseNode
    const prevChar = textContent.charAt(sel.baseOffset-1)
    const nextChar = textContent.charAt(sel.baseOffset)

    console.log(textContent)
    console.log(baseOffset)
    console.log('previous char =', prevChar, 'next char =', nextChar)
    
    const getCorrectQuoteChar = (prev, next) => {
      const START_OF_PARAGRAPH = ''
      const SPACE = ' '
      if ([START_OF_PARAGRAPH, SPACE, CLOSING_QUOTE].includes(prev))
        return OPENING_QUOTE
      console.log('vai retornar CLOSING_QUOTE')
      if ([',', '.', ';', '!', '?'].includes(next))
        return CLOSING_QUOTE 
      return CLOSING_QUOTE
    }

    const nativeEvent = e.detail.event
    const key = nativeEvent.key

    if (key === '"') {
      console.log('SMART QUOTES')
      const correctQuote = getCorrectQuoteChar(prevChar, nextChar)
      nativeEvent.preventDefault()
      nativeEvent.stopPropagation()
      editor.selection.setContent(correctQuote)
      return
    }  

    return

    const blockNode = getBlockNode(sel.baseNode)
    console.log(blockNode.textContent)
    //blockNode.textContent = blockNode.textContent.replace(/o/g, 'O')
    selection.setCursorLocation(sel.baseNode, sel.baseOffset)

    //console.log(key)
    if (key === '"') {
      console.warn(textContent)
      console.warn(textContent.charAt(sel.baseOffset - 1), 
        textContent.charAt(sel.baseOffset + 1))
      nativeEvent.preventDefault()
      nativeEvent.stopPropagation()
      editor.selection.setContent(`“`)

      // opening quote: “
      // closing quote: ”
    }
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