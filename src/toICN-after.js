let isAutoKeyDetection = true;
let isKeyWritten = false;
let detectedKey;
let keyChords;
let isAutoDetected = false;

//ChordやKeyを読む
let rawKeyChords = exports.readKeyChords(webSiteName);
keyChords = rawKeyChords.keyChords;
detectedKey = rawKeyChords.key;

// キーが書かれていないときは、キーを自動判定する
if(detectedKey.keyNo == -1){
  detectedKey = exports.autoDetectKey(keyChords);

  isAutoDetected = true;
}

// キーの手動設定
var result = prompt("Key:" + detectedKey.key + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。");
let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
let specifiedKey = new exports.Key(resultMatch?resultMatch[1]:"");
if(specifiedKey.keyNo != -1){isAutoKeyDetection = false;}

//表示書き換え関係
exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
