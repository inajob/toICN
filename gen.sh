echo -n "javascript:(" > toICN.js
cat toICN-original.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
echo -n ")" >> toICN.js

./README.sh > README.md
