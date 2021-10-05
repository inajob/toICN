var assert = require('assert');
const m = require("./src/toICN-core.js");

let settings = {
  key: null,
  isAutoKeyDetection: true,
  level: 2,
  minorMode: false,
};

console.log("== Key ==");
const keyTests = [
  ["C",false,0,"C","Am","C/Am"],
  ["B",false,11,"B","G#m","B/G#m"],
  ["Ab",true,8,"Ab","Fm","Ab"],
  ["D#m",true,6,"F#","D#m","D#m"],
];
keyTests.forEach((t) => {
  console.log(t[0]);
  key = new m.Key(t[0],t[1]);
  assert.equal(key.keyNo, t[2]);
  assert.equal(key.majorScaleName, t[3]);
  assert.equal(key.minorScaleName, t[4]);
  assert.equal(key.key, t[5]);
});

console.log("== toICN ==")

settings.key = new m.Key("C");

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

  ["C/E" ,"1"],
  ["ConE" ,"1"],

  ["Am7(9)" ,"6[7]"],
  ["Am7" ,"6[7]"],
  ["Ddim7" ,"2[dim]"],
  ["D#dim7" ,"2#[dim]"],
  ["D#dim" ,"2#[dim]"],
  ["F#m7-5" ,"4#[m7-5]"],

  ["C9" ,"1[7]"],

  ["C♯","1#"],
  ["D♭","1#"],
  ["C＃","1#"],

  ["N.C.",""],
];

tests.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
});

settings.minorMode = true;

const testsMinor = [
  ["Am" ,"1"],
  ["A" ,"1~"],
  ["C" ,"3"],
  ["Cm" ,"3~"],
];

testsMinor.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
})

settings.minorMode = false;

settings.level = 1;

const testslv1 = [
  ["C7" ,"1"],
  ["C" ,"1"],

  ["C7sus4" ,"1[sus4]"],
];

testslv1.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
});

settings.level = 4;

const testslv4 = [
  ["C/E" ,"1/3"],
  ["ConE" ,"1/3"],

  ["Am7(9)" ,"6[!7(9)!]"],
  ["C9" ,"1[!7(9)!]"],
];

testslv4.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
});

settings.level = 2;
settings.key = new m.Key("B");

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
  assert.equal(m.toICN(t[0],settings), t[1]);
});

settings.minorMode = true;

const tests2Minor = [
  ["G#m" ,"1"],
  ["G#" ,"1~"],
  ["B" ,"3"],
  ["Bm" ,"3~"],
];

tests2Minor.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
});

settings.minorMode = false;

settings.key = new m.Key("Ab");
const tests3 = [
  ["Ab",   "1"],
]

tests3.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
});

settings.key = new m.Key("D#m");

const tests4 = [
  ["F#",   "1"],
]

tests4.forEach((t) => {
  console.log(t[0]);
  assert.equal(m.toICN(t[0],settings), t[1]);
});

console.log("== updateChords ==")

settings.key = new m.Key("C");
// TODO: isAutokeyDetection test

const updateChordsTest = [
  [
    [
      {type: "chord", v: "C", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "Am", elm: {nodeValue: "C", parentNode:{ classList: {add: ()=>{}}}}},
    ],
    true,
    ["1", "6"]
  ],
  [
    [
      {type: "chord", v: "C", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "Am", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
    ],
    false,
    ["1", "6"]
  ],
  [
    [ // Key: C -> A -> Am
      {type: "key", v: "Key: C", elm: {nodeValue: "Key: C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "C", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "Am", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "key", v: "Key: A", elm: {nodeValue: "Key: A", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "A", elm: {nodeValue: "A", parentNode:{classList: {add: ()=>{}}}}},
      {type: "key", v: "Key: Am", elm: {nodeValue: "Key: Am", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "C", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
    ],
    true,
    ["Key: C", "1", "6", "Key: A (-3)", "1", "Key: Am (+3)", "1"]
  ],
  [
    [ // Key: C -> A -> Am
      {type: "key", v: "Key: C", elm: {nodeValue: "Key: C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "C", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "Am", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
      {type: "key", v: "Key: A", elm: {nodeValue: "Key: A", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "A", elm: {nodeValue: "A", parentNode:{classList: {add: ()=>{}}}}},
      {type: "key", v: "Key: Am", elm: {nodeValue: "Key: Am", parentNode:{classList: {add: ()=>{}}}}},
      {type: "chord", v: "C", elm: {nodeValue: "C", parentNode:{classList: {add: ()=>{}}}}},
    ],
    false,
    ["Key: C", "1", "6", "Key: A", "6~", "Key: Am", "1"]
  ],
];

updateChordsTest.forEach((t) => {
  console.log(t[0]);
  settings.isAutoKeyDetection = t[1]
  m.updateChords(t[0], settings);
  console.log(t[0].elm);
  t[0].forEach((e, i) => {
    assert.equal(e.elm.nodeValue, t[2][i]);
  });
})

const autoDetectTest = [
  // パッヘルベルのカノン
  ["Pachelbel's Canon", "D,A,Bm,F#m,G,D,G,A,D,A,Bm,F#m,G,D,G,A,", "D/Bm"],
  // きらきら星
  ["Twinkle Twinkle Little Star", "C,C,F,C,F,C,G,C,C,F,C,G,C,F,C,G,C,C,F,C,F,C,G,C", "C/Am"],
  // 大きな古時計
  ["My Grandfather's Clock", "G,D7,Em7,C,G,D,G,G,D7,Em7,C,G,D,G,G,Em7,Am,D,G,Em7,A7,D,G,D,Em7,C,G,D,G", "G/Em"]
];

autoDetectTest.forEach((t) => {
  console.log(t[0]);
  let keyChords = t[1].split(",").map(x => ({type: "chord", v:x, elm:null}))
  let detectedKey = m.autoDetectKey(keyChords);
  assert.equal(detectedKey.key, t[2]);
});