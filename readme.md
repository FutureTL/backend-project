This is a backend project I am developing using the chai and code yt channel backend series.

I will be updating the entire running of the project and its entire steps in this readme file

1. creating a folder and then opening it in VS Code. Once opened, the project will be initialized. In the terminal write -
        npm init (this is a command to load the package.json file.Before this command make sure that node is installed using npm i node)

2. Create a readme.md file and mention what all information you want like I am mentioning.

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

dev dependency - is during the development of the project and not taken to production . So we can install nodemon as a dev dependency.  to install it as a dev dependency-
        npm i -D nodemon

We go to package.json file and in scripts add -
        "dev": "nodemon src/index.js"
So, now when we run the command npm run dev, nodemon will authomatically restart the server for the script within in index.js

In the package.json, also add - "type": "module" , as we will be working using modules, so we can use the import statement.

To push these changes to github:
        git status (to see that your file structure is ok)
        git add .   (to add all the new files created)
        git commit -m "setup project files part-1"
        git push

STEP-3 Installing prettier
prettier helps in professional settings so that all the developers working on a project are on the same page.To install it as a development dependency:
        git i -D prettier

Now we have to setup two of its files through the bash terminal in root directory
        touch .prettierrc .prettierignore

in .prettierrc write all the common things like tabWidth, semi, etc
in .prettierignore mention all the files where you dont want to use pretiier like .env files where using prettier is more disastrous than helpful.

Then push these changes to github, now you know how to.



                        NEXT PART OF CONNECTING WITH DATABASE

mongoDb Atlas- sub service of MongoDb where they give free database service online

1. Create an account and setup mongoDB atlas databse.

2. Write the variables you want in your .env file like port number, mongodb_url which you get from mongodb setup online.

While connecting to the database, two things should be kept in mind-

1. using a try and catch block or promises 
2. Connecting to the database often involves latency so we should use async await function. Always remember that our database is in another continent, so delay in getting data so use async await.


3. Naming our database in constants.js file

4.      npm i monngose expree dotenv

                APPROACH-1(Directly writing the code in index.js file)

1. import mongoose in the file
2. using effi and try catch block , write async function for the database connection.

3. inside the throw block, often after making the database connect command we use listeners of express, which signifies that the database is connected but our express app is not able to talk to it. 


                APPROACH-2 (writing in db file)
1. Interesting point- mongoose.connect() returns a promise so trying to access it directly throws an error , so we should wait for the promise to be fulfilled.

        So, we should use await before the mongoose.connect().



When we are done connecting the database, database setup complete but our application has still not started listening.

Url se jab bhi koi data aata hai wo mostly req.params se aata hai.

We use app.use() , mostly when we have to setup a middleware or some configurations.


IMPORTANT POINT-console.error() writes to stderr, whereas console.log() writes to stdout as described in the doc.

In a default run of nodejs, both stdout and stderr go to the console, but obviously, they could be directed different places and could be used differently. For example, when using tools such as forever, the two streams are logged to separate log files so they can be examined separately.

The presumption is that console.error() may contain more serious information that might want to be looked at separately, but that is really up to how you use console.log() vs. console.error() in your own program.

                        SETUP OF APP
1. Install cors and cookie-parser using:
        npm i cors cookie-parser

these are also added as configurations in app.js

2. Cors allows us to specify which all websites can interact with the backend code. Cross origin resource sharing

3. Cookies are created by server and can be accessed only by the server. These help in user authentication. 

These cookies are injected into the website of the client/user, so that whenever the client makes a request, the server can easily verify using cookie id and session.

4. Middlewares- stand in between the client and the server. 


                Writing code in UTILS
Higher order functions ae those which can accept other functions as parameters

1. We are again and again using the try catch block so we create a wrapper for it, and put it in utils folders for the code that is going to be used again and again.


2. we can also standardize the code for error.
        We can read more about it in node js api error on net.
        Applications running on node js generally experience 4 category of error:
        1. standard js errors <evalError>,<SyntaxError>,<TypeError> etc.
        2. system errors triggered by OS constraints like trying to access a file that does not exist.(OS related error)
        3. user related error
        4. AssertionError which are expectional logic voilation errors that must not exist. These are raised by node:assert module.


INFORMATION ABOUT SOME IMPORTANT TOPICS:

1. ODM- Object document mapper-these are commonly used to interact with no sql databases like mongodb, using object-oriented code.

2. Mongodb jab bhi eg, user ko save krta hai ek enique id generate krta hai, and stores the data in the form of 
   bson not json

3. Another powerful thing that we can do in mongodb is using aggregation pipelines. These are installed using the command:
                npm i mongoose-aggregate-paginate-v2
and in the code file we add it like a plugin in video.model.js file.


4. Mongoose middleware/hooks-mostly included in models file. There are pre and post hooks.

We can apply pre hooks on our code to perform a certain action before data goes in database for eg, ecrypting the password.

We can apso apply post hooks.

5. Mongoose also provides methods some are built in and some can also be customised. Like in our code in models we will add a method to compare the password a user puts in to his saved ecrypted password. 

We can achieve this by using the bcrypt lib only. So it allows not only to hash passwords but also to compare two encrypted passwords.

6.                        JsonWebToken

Access tokens have shorter expiry date than refresh tokens.
In our code we will not store the access tokens in the database but we will store the refresh tokens.

I have generated 64 lengthrandom string using token genrator tool online-
         https://it-tools.tech/token-generator 

Using the custom methods in mongoose we generated the jwt tokens- access, refresh

Refresh token has less information in the payload as compared to access token.

                FILE UPLOAD
File upload in express can be done in 2 ways:
        1. using express file-upload
        2. using multer
        any of the above can be used but for this project we will be using multer.

What method we will follow for uploading files:
1. We will first take files from the user and store in our local server. Here we will use MULTER.
2. from the local server then the file will be uploaded on a third party service like cloudinary.
3. Finally after this we can delete the file from our server.

This file upload code will be added in utility, as it is quite reusable.Then it can be added wherever necessary.

Once we are done with creating the cloudinary code we will move on to multer.

Multer is a middleware that is used to handle files in multipart/form-data, used for uploading files. Multipart means that the form contains both text fields as well as files(pdf,images etc).Multipart means the browser will process the text fields separately than the file fields.

Multer will not process a form that is not multipart.

In this part for eg-

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})


'/profile' represents router where file is to be uploaded.
upload.single part is the middleware where our multer comes into picture

function(req,res,next) represents the controller.


Detailed implementation of MULTER-https://blog.logrocket.com/multer-nodejs-express-upload-file/



Now we have started writing the code for our routes. 
We create user route and user controller and then import it in app.js

In app.js we imported userRouter from users route and this code redirects app.use("/api/v1/users", userRoute) to userRoute which is a register route to register the details of the user. These details will be added moving forward.

After redirecting to user route, it is further redirected to user controller.

So, the sequence is app.js -> users route -> users controller.

IMPORTANT PT- In import statement we can give a name of our choose only when we use export default.

Now we use POSTMAN and test our setup, we download it and go to collections-> click on + on top -> select post method-> type url eg, http://localhost:3000/api/v1/users/register , and we should get 200, ok message.


                                REGISTER CONTROLLER 

Logic for registering user-
        1. get user details from frontend.
        2. validation-not empty or all the fields are correct.
        3. check if user already exists:username, email
        4. check for images, avatar
        5. upload them to cloudinary, check avatar
        6. create user object-create entry in db(we are using mongodb where mostly mostly objects are created)
        //when we make entries in the db we get response as it is whatever we have created everything is received back in the form of response.
        7. remove password and refresh token field from response.
        8. check for user creation.(check if response is actually received.)
        9. return res

-Some used in javascript- if all fields dont satisfy the condition we are checking for it returns false.
-even if one field satisfies, it returns true.

-what is optional chaining?-



-Trim() is a built in string function used to remove white spaces from both the ends of the string.



                        WORKING WITH POSTMAN
-we use json to send data only when text values are to be sent.
-it cannot be used when we also want to send files.
-for files we select form-data.


                        ACCESS TOKEN AND REFRESH TOKEN
-Access token are short lived whereas the refresh tokens are long lived.These are comparative terms.

-I have an access token, then I am authenticated and loggined in and suppose it expires after 15 mins due to security reasons, then as refresh token is longer lived and given to both the user and saved to the server, I will be authenticated using the refresh token-> if the authentication is successful, then I will again be granted the access token.

We will create an endpoint for the user to hit and get his access tokens refreshed. How will this happen?
       -When the user hits endpoint we will take the    refresh tokens and compare against the one we have stored in our database.
       -If they match then both the access and refresh token will be refreshed.

IMPT POINTS: when we write req.cookies, here cookies refrences the cookie-parser middleware. 







