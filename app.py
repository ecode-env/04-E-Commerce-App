import os
from random import randint

# Set Git username and email globally
os.system('git config --global user.name "eyobScript"')
os.system('git config --global user.email "eyobbmulugeta@gmail.com"')

for i in range(1, randint(1, 10)):
    d = str(i) + ' days ago'

    # Writing to file
    with open('file.txt', 'a') as file:
        file.write(d)

    # Git commands
    os.system('git add .')
    os.system('git commit --date="' + d + '" -m "commit"')

# Push changes to remote repository
os.system('git push origin main')
