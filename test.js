var assert = require('assert');
const toICN = require("./src/toICN-core.js");
key = "C";

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

  ["Cb","7~"], // B
  ["Fb","3~"], // E

  ["Db","1#"],
  ["Eb","2#"],
  ["Gb","4#"],
  ["Ab","5#"],
  ["Bb","6#"],

  ["C#m","1#~"],
  ["D#m","2#~"],
  ["F#m","4#~"],
  ["G#m","5#~"],
  ["A#m","6#~"],

  ["Csus4" ,"1[sus4]"],
  ["C7sus4" ,"1[sus4]"],
  ["Cdim" ,"1[dim]"],
  ["Cdim7" ,"1[dim]"],
  ["Cadd9" ,"1[9]"],
  ["Cmaj" ,"1"],
  ["Cmin" ,"1~"],
  ["Cm7b5" ,"1[m7-5]"],
  ["Cm7(b5)" ,"1[m7-5]"],
  ["Cm7-5" ,"1[m7-5]"],
  ["CM7" ,"1[M7]"],

  ["Am7" ,"6[7]"],
  ["Ddim7" ,"2[dim]"],
  ["D#dim7" ,"2#[dim]"],
  ["D#dim" ,"2#[dim]"],
  ["F#m7-5" ,"4#[m7-5]"],

  ["C9" ,"1[!!7(9)!!]"],

  ["C♯","1#"],
  ["D♭","1#"],

  ["N.C.",""],
];

tests.forEach((t) => {
  console.log(t[0]);
  assert.equal(toICN(t[0]), t[1]);
});

key = "B";
const tests2 = [
  ["B",   "1"],
  ["C#m", "2"],
  ["D#m", "3"],
  ["E",   "4"],
  ["F#",  "5"],
  ["G#m", "6"],
  ["A#m", "7"],
]
tests2.forEach((t) => {
  console.log(t[0]);
  assert.equal(toICN(t[0]), t[1]);
});

key = "Ab";
const tests3 = [
  ["Ab",   "1"],
]

tests3.forEach((t) => {
  console.log(t[0]);
  assert.equal(toICN(t[0]), t[1]);
});

