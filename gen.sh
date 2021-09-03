echo -n "javascript:(" > toICN.js
cat toICN-before.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
cat toICN-core.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
cat toICN-after.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
echo -n ")" >> toICN.js

./README.sh > README.md
