This is a backend project I am developing using the chai and code yt channel backend series.

I will be updating the entire running of the project and its entire steps in this readme file

1. creating a folder and then opening it in VS Code. Once opened, the project will be initialized. In the terminal write -
        npm init (this is a command to load the package.json file.Before this command make sure that node is installed using npm i node)

2. Create a readme.md file and mention what all information you want I am mentioning.

3. To upload project to git the following commands-
        git -init
        git add .   (the . means that all the files will be added)
        git commit -m "any message"  

I faced an issue here as before this step I installed git in my laptop. Its extension is not provided by VS CODE. So install it manually.

After this step, you will have to tell github your identity so run the following command to let github know who you are.

        git config --global user.email "your github email"
        git config --global user.name "your name on github handle"(eg my name is FutureTL)

After this step you can go to github and start a new repository, give it any name you want.

After this step you can come back to your vs code and write the command

        git branch -M main   
(this will change the master branch name to main. see the lower left side of vs code)

        git remote add origin https://-------- take this command from your repository.
this command will tell git where it has to push our project.

        git push -u origin main

Part-2

1.In your project make a folder- "public" and inside it make another folder "temp". We intend to push these folder to git but will mot accept as git allows only when files are present inside the folder.

For this purpose we create .gitkeepit file. 

2.In the main folder we create a .gitignore file and also .env file.

Using gitignore generators from google, we can bring in a structure which is commonly followed.


Nodemon- restarts the server once the file is saved. otherwise we manually have to restart the server.

dev dependency - is druing the development of the project and not taken to production . So we can install nodemon as a dev dependency.  to install it as a dev dependency-
        npm i -D nodemon

We go to package.json file and in scripts add -
        "dev": "nodemon src/index.js"
So, now when we run the command npm run dev, nodemon will authomatically restart the server for the script within in index.js