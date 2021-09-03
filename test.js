var assert = require('assert');
const toICN = require("./toICN-core.js");
const tests = [
  ["C" ,"1"],
  ["Dm","2"],
  ["Em","3"],
  ["F" ,"4"],
  ["G" ,"5"],
  ["Am","6"],
  ["Bm","7"],

  ["Cm","1~"],
  ["D" ,"2~"],
  ["E" ,"3~"],
  ["Fm","4~"],
  ["Gm","5~"],
  ["A" ,"6~"],
  ["B" ,"7~"],

  ["Csus4" ,"1[sus4]"],
  ["C7sus4" ,"1[sus4]"],
  ["Cdim" ,"1[dim]"],
  ["Cdim7" ,"1[dim]"],
  ["Dmsus4","2[sus4]"],
  ["Dmsus4","2[sus4]"],
];

tests.forEach((t) => {
  console.log(t[0]);
  assert.equal(toICN(t[0]), t[1]);
});
