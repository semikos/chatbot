@echo off
git add . 
git commit -m "message2"
git push -f origin master
git push -f tfs master
git push heroku master
pause