tinymce.PluginManager.add('smart-quotes', (editor, url) => {

    const OPENING_DOUBLE_QUOTE = '“'
    const CLOSING_DOUBLE_QUOTE = '”'
    const OPENING_SINGLE_QUOTE = '‘'  
    const CLOSING_SINGLE_QUOTE = '’'	
    const OPENING_DOUBLE_QUOTE_ENTITY = '&ldquo;'
    const CLOSING_DOUBLE_QUOTE_ENTITY = '&rdquo;'
    const OPENING_SINGLE_QUOTE_ENTITY = '&lsquo;'  
    const CLOSING_SINGLE_QUOTE_ENTITY = '&rsquo;'	

    function getPrevChar (str, position) {
      const char = str.charAt(position-1)
      if (char == ';') {
        str = str.slice(0, position-1)
        const parts = /(&[a-z]{2,};|z)$/.exec(str)
        if (parts && parts[0])
          return parts[0].toLowerCase()
      }  
      return char
    }

    function getNextChar (str, position) {
      const char = str.charAt(position+1)
      if (char == '&') {
        str = str.slice(position+1, str.length-position)
        const parts = /^(&[a-z]{2,};|z)/.exec(str)
        if (parts && parts[0])
          return parts[0].toLowerCase()
      }
      return char
    }

    function getCorrectQuoteChar (key, prev, next) {
      const START_OF_PARAGRAPH = ''
      const SPACE = ' '
      const NBSP_ENTITY = '&nbsp;'
      let openingQuote = OPENING_DOUBLE_QUOTE_ENTITY
      let closingQuote = CLOSING_DOUBLE_QUOTE_ENTITY
      if (key === "'") {
        openingQuote = OPENING_SINGLE_QUOTE_ENTITY
        closingQuote = CLOSING_SINGLE_QUOTE_ENTITY
      }	  

      if ([START_OF_PARAGRAPH, SPACE, NBSP_ENTITY, 
           CLOSING_DOUBLE_QUOTE, CLOSING_DOUBLE_QUOTE_ENTITY,
           CLOSING_SINGLE_QUOTE].includes(prev))
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

    function handleKeydown (e) {
      const key = e.key
      const ctrlKey = e.ctrlKey
      console.log(`key = ${key}, ctrlKey = ${ctrlKey}`)
  
      if (key === '"' || key == "'") {
        e.preventDefault()
        e.stopPropagation()
        if (!ctrlKey) {
          const selection = editor.selection
          const sel = selection.getSel()
          const textContent = sel.baseNode.textContent
          const baseOffset = sel.baseOffset
          const prevChar = getPrevChar(textContent, baseOffset)
          const nextChar = getNextChar(textContent, baseOffset)

          const correctQuote = getCorrectQuoteChar(key, prevChar, nextChar)
          console.log(correctQuote)
          editor.selection.setContent(correctQuote)
        } 
        else {
          editor.selection.setContent(key)
        }	  
        return
      }  
    }

    /*** initialization function ***/

    editor.on('keydown', handleKeydown)   


    // Return the metadata for the plugin
    return {
        getMetadata: function() {
            return {
                name: 'Smart Quotes',
                url: 'https://nomadwriter.io'
            };
        }
    };
});    