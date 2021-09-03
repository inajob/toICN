let keyElm = document.getElementsByClassName('key')[0];
let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/Key: ([A-G](#|b){0,1})m{0,1}/):null;
let key = keyMatch?keyMatch[1]:"C";
Array.prototype.slice.bind(document.getElementsByClassName("chord"))().concat(Array.prototype.slice.bind(document.getElementsByTagName("rt"))()).forEach((e) => {
  module = {exports:{}};
