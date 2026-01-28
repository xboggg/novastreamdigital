#!/bin/bash
cd /var/www/novastream
git checkout -- .
git pull origin main
npm install
npm run build
echo "Deployed at $(date)" >> /var/www/novastream/deploy.log
