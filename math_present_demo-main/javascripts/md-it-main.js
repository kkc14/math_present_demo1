
var input = document.getElementById('input');
var preview = document.getElementById('preview');
let timeoutId = null;
let mark=0;

document.addEventListener('DOMContentLoaded', function() {
    input.addEventListener('input', function() {
      mark=0;
      var text = input.value;
      var html = markdownToHtml(text)+'</div>';
      preview.innerHTML = html;
      console.log(html)

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(function() {
        MathJax.typeset();
      }, 500);

      //codeElement();
    });
  });


  function markdownToHtml(markdown) {
    
    const text = input.textContent;
    console.log(text)

//=====================

const md = window.markdownit({
    html:true
  });

md.inline.ruler.push('customDiv', function (state, index) {
  var start = state.pos;
  var marker = '#-';
  // Check if the current position matches the marker
  if (state.src.startsWith(marker)) {
    var end = start + state.posMax;
    //console.log(state);
    // Extract class names from the marker
    var classAttribute = state.src.slice(start + 3, end);
    var token = state.push('html_block', '', 1);
    if (mark == 0) {
      token.content = '<div id=slide ' + 'class="' + classAttribute + '">';
      mark = 1;
    } else {
      token.content = '</div><div id=slide ' + 'class="' + classAttribute + '">';
    }

    state.pos = state.posMax;
    return true;
  }
  return false;
});

// Disable paragraph mode
md.renderer.rules.paragraph_open = function () {
  return '';
};
md.renderer.rules.paragraph_close = function () {
  return '';
};


md.renderer.rules.image = function (tokens, idx, options, env, self) {
  var token = tokens[idx];

  // Parse the alt text for size information
  var altText = token.attrs[2][1];
  var match = altText.match(/width:(\d+%)+ float:([a-z]+)/);
  console.log(token)
  console.log(altText)
  console.log(match)

  if (match) {
    var size = match[1];
    var float = match[2];

    // Remove the size information from the alt text
    token.attrs[2][1] = altText.replace(/width:(\d+%)+ float:([a-z]+)/, '');

    // Add the size information to the src attribute
    token.attrs[token.attrJoin('style','width:' + size + ' ;float:'+float+' ;')];
  }

  // Call the default renderer
  return defaultRender(tokens, idx, options, env, self);
};


//==================
    
    var output = md.render(markdown);
    return output ;
  }