const content = `<h1 class="page">Filtering TinyMCE content</h1>
<div id="preamble">
<div class="sectionbody">
<div class="paragraph">
<p>TinyMCE has comprehensive content filtering capabilities that change the way the editor handles the input and output of content. This capability ensures content is clean, maintainable, and readable.</p>
</div>
<div class="paragraph">
<p>These settings enable developers to control content styling features that are available to users such as font formats, font sizes, and text indentation. There are additional configuration options concerning the complex parsing of text. Those options are beyond the scope of the General Configuration Guide. Refer to the&nbsp;<a class="xref page" href="https://www.tiny.cloud/docs/tinymce/6/content-filtering/">Content filtering options</a>&nbsp;section to learn more.</p>
</div>
</div>
</div>
<div class="sect1">
<h2 id="roll-your-style-formats">Roll your style formats</h2>
<div class="sectionbody">
<div class="paragraph">
<p>This section is about the&nbsp;<a class="xref page" href="https://www.tiny.cloud/docs/tinymce/6/content-formatting/#formats">formats</a>&nbsp;configuration option. This options lets developers override TinyMCE defaults and adds custom&nbsp;<strong>formats</strong>&nbsp;to the editor.</p>
</div>
<div class="paragraph">
<p>TinyMCE is equipped with a formatting engine that allows you to register a set of styles and attributes as a named&nbsp;<strong>format</strong>. For example, the&nbsp;<code>bold</code>&nbsp;format is the style that is applied to text when the bold button is clicked.</p>
</div>
<div class="paragraph">
<p>Check out the&nbsp;<a class="xref page" href="https://www.tiny.cloud/docs/tinymce/6/user-formatting-options/#style_formats">custom formats example</a>&nbsp;for a demonstration of this option.</p>
</div>
<div class="sect2">
<h3 id="style-merging">Style merging</h3>
<div class="paragraph">
<p>Similar elements and styles are merged by default to reduce the output HTML size. For example, instead of assigning one&nbsp;<code>span</code>&nbsp;element for font size and another&nbsp;<code>span</code>&nbsp;element for font face, TinyMCE merges the two styles into a sing&nbsp;<code>span</code>&nbsp;element.</p>
</div>
</div>
</div>
</div>

<!--
<div contenteditable="false" style="outline:none">
  <h2>Non-editable div</h2>
  <p>Hello this paragraph should not be editable</p>
  <div contenteditable="true"><span contenteditable="false" style="transform: translateX(-1px)">2&nbsp;</span>This one can be edited. Enjoy!</div>
</div>  

<div contenteditable="false" style="outline:none">
  <hr />
  <ol style="font-size:0.9em; margin-top: -0.25em">
    <li contenteditable="true" style="margin-bottom: 0.5em">Note 1</li>
    <li contenteditable="true" style="margin-bottom: 0.5em">Hello this paragraph should not be editable</li>
    <li contenteditable="true" style="margin-bottom: 0.5em">This one can be edited too. Enjoy!</li>
  </ol>  
</div>

<br /><br />

<table contenteditable="false">
  <tbody contenteditable="false">
    <tr><td colspan="2">Footnotes</td></tr>
    <tr><td>1.</td><td contenteditable="true">First footnote.</td></tr>
    <tr><td>2.</td><td contenteditable="true">Second footnote.</td></tr>
  </tbody>
</table>
-->
`

export { content }