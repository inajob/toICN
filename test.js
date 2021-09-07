var assert = require('assert');
const m = require("./src/toICN-core.js");

console.log("== Key ==");
const keyTests = [
  ["C",0,"C","Am"],
  ["B",11,"B","G#m"],
  ["Ab",8,"Ab","Fm"],
  ["D#m",6,"F#","D#m"],
];
keyTests.forEach((t) => {
  console.log(t[0]);
  key = new m.Key(t[0]);
  assert.equal(key.keyNo, t[1]);
  assert.equal(key.majorScaleName(), t[2]);
  assert.equal(key.minorScaleName(), t[3]);
  degree = Math.floor( Math.random() * 21 ) - 10;
  key.modulation(degree);
  assert.equal(key.keyNo, (t[1]+12+degree) % 12);
});

console.log("== toICN ==")

key = new m.Key("C");

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

  ["C/E" ,"1/3"],
  ["ConE" ,"1/3"],

  ["Am7" ,"6[7]"],
  ["Ddim7" ,"2[dim]"],
  ["D#dim7" ,"2#[dim]"],
  ["D#dim" ,"2#[dim]"],
  ["F#m7-5" ,"4#[m7-5]"],

  ["C9" ,"1[!!7(9)!!]"],

  ["C♯","1#"],
  ["D♭","1#"],
  ["C＃","1#"],

  ["N.C.",""],
];

tests.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],key), t[1]);
});

key = new m.Key("B");

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
  assert.equal(m.toICN(t[0],key), t[1]);
});

key = new m.Key("Ab");
const tests3 = [
  ["Ab",   "1"],
]

tests3.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],key), t[1]);
});

key = new m.Key("D#m");

const tests4 = [
  ["F#",   "1"],
]

tests4.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],key), t[1]);
});

console.log("== updateChords ==")

key = new m.Key("C");
isAutoKeyDetection = true;
previousKey = new m.Key();

const updateChordsTest = [
  [
    [
      {type: "chord", v: "C", elm: {firstChild: {nodeValue: "C"}, classList: {add: ()=>{}}}},
      {type: "chord", v: "Am", elm: {firstChild: {nodeValue: "C"}, classList: {add: ()=>{}}}},
    ],
    ["1", "6"]
  ],
  [
    [ // Key: C -> A -> Am
      {type: "key", v: "key: C", elm: {firstChild: {nodeValue: "key: C"}, classList: {add: ()=>{}}}},
      {type: "chord", v: "C", elm: {firstChild: {nodeValue: "C"}, classList: {add: ()=>{}}}},
      {type: "chord", v: "Am", elm: {firstChild: {nodeValue: "C"}, classList: {add: ()=>{}}}},
      {type: "key", v: "key: A", elm: {firstChild: {nodeValue: "key: A"}, classList: {add: ()=>{}}}},
      {type: "chord", v: "A", elm: {firstChild: {nodeValue: "A"}, classList: {add: ()=>{}}}},
      {type: "key", v: "key: Am", elm: {firstChild: {nodeValue: "key: Am"}, classList: {add: ()=>{}}}},
      {type: "chord", v: "C", elm: {firstChild: {nodeValue: "C"}, classList: {add: ()=>{}}}},
    ],
    ["key: C", "1", "6", "key: A (-3)", "1", "key: Am (+3)", "1"]
  ],

];

updateChordsTest.forEach((t) => {
  console.log(t[0]);
  m.updateChords(t[0]);
  console.log(t[0].elm);
  t[0].forEach((e, i) => {
    assert.equal(e.elm.firstChild.nodeValue, t[1][i]);
  });
})
