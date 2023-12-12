<script>
  import Editor from '@tinymce/tinymce-svelte';
  import { content2 } from './content.js'

  let editorId
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
    setup: function (editor) {
      console.log('SETUP')
      editor.on('init', function(e) {
        // UNCOMMENT THIS TO SET THE EDITOR IN FULLSCREEN MODE!!
        editor.execCommand('mceFullScreen')
      })
    }    
  }

</script>

<main>
  <h1>Hello Tiny</h1>
  <Editor 
    inline={false} 
    bind:id={editorId}
    conf={conf} 
    value={editorContent}
  />
</main>