set -e
cp -a UrAI/. .
rm -rf UrAI
npm install
npm run build
