<script>
  import Editor from '@tinymce/tinymce-svelte';
  import { content2 } from './content.js'

  let editorId
  let editor
  let editorContent = content2;  //'<p style="font-family:serif;">"Hello <i>World</i></p>'
  const conf = {
    extended_valid_elements: "+@[data-*]",
    external_plugins: {
      'nomad-footnotes': '/js/nomad-plugins/nomad-footnotes.js',
      'smart-quotes':    '/js/nomad-plugins/smart-quotes.js'
    },
    plugins: 'link code lists advlist table nonbreaking searchreplace charmap fullscreen pagebreak wordcount',
    toolbar: 'blocks fontfamily fontsize h1 code bold italic copy cut paste accordion accordiontoggle accordionremove visualblocks visualchars nomad-footnotes',
    noneditable_class: 'mceNonEditable',
    editable_class: 'mceEditable',    
    setup: function (thisEditor) {
      editor = thisEditor
      console.log('SETUP')
      editor.on('init', function(e) {
        // UNCOMMENT THIS TO SET THE EDITOR IN FULLSCREEN MODE!!
        // editor.execCommand('mceFullScreen')
      })
    }    
  }

  let text
  let editorElement

  function showEditorContent () {
    console.log(editor)
    console.log('Content below should have no footnote segment:')
    console.log(editor.getContent())
  } 

</script>

<main>
  <h1>Hello Tiny</h1>
  <button on:click={showEditorContent}>getContent()</button>
  <Editor 
    inline={false} 
    bind:id={editorId}
    bind:this={editorElement}
    conf={conf} 
    bind:value={editorContent}
  />
</main>