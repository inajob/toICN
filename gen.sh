echo -n "javascript:(function(){" > toICN.js
cat ./src/toICN-before.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
cat ./src/toICN-core.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
cat ./src/toICN-after.js |sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
echo -n "})();" >> toICN.js

./template/README.sh > README.md
