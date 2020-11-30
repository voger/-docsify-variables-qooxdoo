var jsonPath = require("jsonpath-plus").JSONPath;

var variablesObj = null;
var variablesFile = null;

function resolveVariable(variable) {
  if (variablesFile && variablesObj === null) {
    variablesObj = initializeVariablesObject();
  }

  var normalizedVariable = variable;

  if (!normalizedVariable.startsWith("$")) {
    normalizedVariable = "$." + normalizedVariable;
  }

  var returnVal = jsonPath({
    path: normalizedVariable,
    json: variablesObj,
    wrap: false,
  });

  if (undefined === returnVal) {
    returnVal = "#{" + variable + "}";
  }

  return returnVal;
}

function initializeVariablesObject() {
  var variablesObj = null;

  try {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", variablesFile, false);
    xhttp.send();

    variablesObj = JSON.parse(xhttp.response);
  } catch (e) {
    variablesObj = null;
  }

  return variablesObj;
}

function install(hook, vm) {
  variablesFile = vm.config.variablesFile;
  hook.beforeEach(function (content) {
    return content.replace(/#{(.*)}/g, function (a, b) {
      return resolveVariable(b);
    });
  });
}

if (!window.$docsify) {
  window.$docsify = {};
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(install);
