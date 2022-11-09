var djot = {};
var initialized = false;

Module['onRuntimeInitialized'] = () => {
  const djot_open = Module.cwrap("djot_open", "number", []);
  const djot_close = Module.cwrap("djot_open", null, ["number"]);
  djot.state = djot_open();
  const djot_to_ast_json =
      Module.cwrap("djot_to_ast_json", "string" ,["number", "string", "boolean"]);
  djot.to_ast_json = (s, sourcepos) => {
    return djot_to_ast_json(djot.state, s, sourcepos);
  }
  const djot_to_matches_json =
      Module.cwrap("djot_to_matches_json", "string" ,["number", "string"]);
  djot.to_matches_json = (s) => {
    return djot_to_matches_json(djot.state, s);
  }
  const djot_to_html =
      Module.cwrap("djot_to_html", "string" ,["number", "string", "boolean"]);
  djot.to_html = (s, sourcepos) => {
    return djot_to_html(djot.state, s, sourcepos);
  }
  document.getElementById("input").onkeyup =
    debounce(convert, 100);
  document.getElementById("mode").onchange = convert;
  document.getElementById("sourcepos").onchange = convert;
  convert();
}

const debounce = (func, delay) => {
    let debounceTimer
    return function() {
        const context = this
        const args = arguments
            clearTimeout(debounceTimer)
                debounceTimer
            = setTimeout(() => func.apply(context, args), delay)
    }
}

function convert() {
  var mode = document.getElementById("mode").value;
  var text = document.getElementById("input").value;
  var sourcepos = document.getElementById("sourcepos").checked;
  document.getElementById("preview").innerHTML = "";
  document.getElementById("result").innerHTML = "";

  if (mode == "ast") {
    document.getElementById("result").innerText =
      JSON.stringify(JSON.parse(djot.to_ast_json(text, sourcepos)), null, 2);
  } else if (mode == "matches") {
    document.getElementById("result").innerText =
      JSON.stringify(JSON.parse(djot.to_matches_json(text)), null, 2);
  } else if (mode == "html") {
    document.getElementById("result").innerText = djot.to_html(text, sourcepos);
  } else if (mode == "preview") {
    document.getElementById("preview").innerHTML = djot.to_html(text, sourcepos);
    MathJax.typeset();
  }
}