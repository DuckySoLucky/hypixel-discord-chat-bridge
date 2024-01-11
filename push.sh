source ~/.nvm/nvm.sh 
pkill -f node 
cd /home/node/bridge 
git pull 
git fetch --all 
git reset --hard 
nvm use 16 
node index.js
