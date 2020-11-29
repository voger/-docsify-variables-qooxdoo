var variablesObj = null;
var variablesFile = null;



function resolveVariable(variable) {
  if (variablesFile && variablesObj === null) {
    initializeVariablesObject();
  }

  var normalizedVariable = variable;

  if(!normalizedVariable.startsWith("$")) {
    normalizedVariable = "$." + normalizedVariable;
  }

  var returnVal = null;
  try {
    var jsonPath = require("jsonpath-plus").JSONPath;
    returnVal = jsonPath({path: variable, json: variablesObj});
  } catch(e) {
    returnVal = "#{" + variable + "}";
  }

  return returnVal;
};

function initializeVariablesObject() {
  var returnVal = null;

  if (variablesFile && variablesObj === null) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", variablesFile, false);
    xhttp.send();
    returnVal = JSON.parse(xhttp.response);
  }

  return returnVal;
}

function install(hook, vm) {
  variablesFile = vm.config.variablesFile;
  hook.beforeEach(function(content) {
    return content.replace(/#{(.*)}/g, function(a, b){return resolveVariable(b)})
  });
}

if (!window.$docsify) {
  window.$docsify = {}
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(install)
