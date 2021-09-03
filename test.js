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

  ["C#","1#"],
  ["D#","2#"],
  ["F#","4#"],
  ["G#","5#"],
  ["A#","6#"],

  ["C#m","1#~"],
  ["D#m","2#~"],
  ["F#m","4#~"],
  ["G#m","5#~"],
  ["A#m","6#~"],

  ["Csus4" ,"1[sus4]"],
  ["C7sus4" ,"1[sus4]"],
  ["Cdim" ,"1[dim]"],
  ["Cdim7" ,"1[dim]"],
  ["Cadd9" ,"1[add9]"],
  ["Cmaj" ,"1"],
  ["Cmin" ,"1~"],
  ["Cm7b5" ,"1[m7-5]"],
  ["Cm7(b5)" ,"1[m7-5]"],
  ["Cm7-5" ,"1[m7-5]"],

  ["N.C.",""],
];

tests.forEach((t) => {
  console.log(t[0]);
  assert.equal(toICN(t[0]), t[1]);
});
