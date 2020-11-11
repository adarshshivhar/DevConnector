## Dependencies

- ### Regular Dependencies

    -  bcryptjs 2.4.3
    -  config 3.3.2 :- It is used to create global values that we can use throughout our application
    -  express 4.17.1
    -  express-validator 6.6.1
    -  gravatar 1.8.1
    -  jsonwebtoken 8.5.1
    -  mongoose 5.10.13
    -  request  2.88.2

- ### Dev Dependencies

	- concurrently 5.3.0
	- nodemon 2.0.6

- ### Express.js
	Express.js is a web application framework for Node.js. It provides various features that make web application development fast and easy which otherwise takes more time using only Node.js.

	Express.js is based on the Node.js middleware module called connect which in turn uses http module. So, any middleware which is based on connect will also work with Express.js.
    
    - #### Middleware
       - I talked briefly about middleware as functions that execute after the server receives the request and before the controller action sends the response, but there are a few more things that are specific to middleware. The biggest thing is that middleware functions have access to the response (res) and request (req) variables and can modify them or use them as needed. Middleware functions also have a third parameter which is a next function. This function is important since it must be called from a middleware for the next middleware to be executed. If this function is not called then none of the other middleware including the controller action will be called.
       -  
       
       
            
    - #### Routing
    	Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
        
        Each route can have one or more handler functions, which are executed when the route is matched.
        
        In other words, the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
		
        Route definition takes the following structure:
        ```javascript
		app.METHOD(PATH, HANDLER)
		```
        Where:
        - app is an instance of express.
		- METHOD is an HTTP request method, in lowercase.
		- PATH is a path on the server.
		- HANDLER is the function executed when the route is matched.
		
    - #### Routes-api
    	It consist of 4 routes
        - #### USER
        	- Here you can register new user
        	  - method - `post`
        	  - api- `/api/users`
        	  - validation code overview :-
        	  	```javascript
             	 router.post('/',[
                        check('name', 'Name is required').not().isEmpty(),
                        check('email', 'Please Enter a Valid Email').isEmail(),
                        check(
                          'password',
                          'Please enter a password with 6 or more characters'
                        ).isLength({ min: 6 }),
                      ],
                      (req, res) => {
                        const errors = validationResult(req);
                        if (!errors.isEmpty()) {
                            return res.status(400).json({ errors: errors.array() });
                        }
                        res.send('User route');
                      }
                    );
                ```
              - user register logic code overview:-
                ```javascript
                async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  return res.status(400).json({ errors: errors.array() });
                }

                const { name, email, password } = req.body;

                try {
                  let user = await User.findOne({ email });

                  // See if user exists
                  if(user) {
                    res.status(400).json({ errors: [{ msg: 'User already exists' }] });
                  }

                  // Get users gravatar
                  const avatar = gravatar.url(email, {
                      s: '200',
                      r: 'pg',
                      d: 'mm'
                  });

                  user = new User({
                      name,
                      email,
                      avatar,
                      password
                  });

                  // Encrypt password using bycrypt
                  const salt = await bcrypt.genSalt(10);

                  user.password = await bcrypt.hash(password, salt);

                  await user.save();

                  // Return jsonwebtoken

                  res.send('User registered');
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send('Server error');
                  }
                }
                ```
             - Implementing JWT
               ```javascript
			   //Return jsonwebtoken
                  const payload = {
                    user: {
                      id: user.id,
                    },
                  };

                  jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    { expiresIn: 360000 },
                    (err, token) => {
                      if (err) throw err;
                      res.json({ token });
                    }
                  );
			   ```
    
        - #### PROFILE
        - #### POST
        - #### AUTH
    - #### Express Validators:- This will help us to validate the data which user sends.This is actually a middleware that checks data for us. For Ex:- `check('username').isEmail()` this rule will check that email id is in correct format or not.
      ```javascript
	  const { check, validationResult } = require('express-validator/check');
	  ```
- ### Mongoose
     Mongoose is one of the Node.js libraries that provides MongoDB object mapping, in a simple manner "Mongoose is a library of Node.js, it provides interaction with MongoDB using Object-Relation- Mapping".

	Mongoose provides a straight-forward, schema-based solution to model our application data. It includes built-in type casting, validation, query building, business logic hooks and more.
    
    Connecting to MongoDB:- 
    ```javascript
    const mongoose = require('mongoose');
    const config = require('config');
    //MongoDB Cloud URI
    const db = config.get('mongoURI');

    const connectDB = async () => {
      try {
        await mongoose.connect(db, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        console.log('MongoDB Connected...');
      } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
      }
    };

    module.exports = connectDB;
	```
- ### Models
	
    In order to interact with our database we have create models
    This project consist of 3 models:-
    - User
    	This model consist of following fields
        - name
        - email
        - password
        - avatar:- It allows you to attach profile image to your email.
        - date
        - code overview:- 
        ```javascript
		const mongoose = require('mongoose');
        const UserSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            avatar: {
                type: String,

            },
            date: {
                type: Date,
                default: Date.now
            }
        });
		module.exports = User = mongoose.model('user', UserSchema);
			```
    - Profile
    - Post

- ### JWT(JSON Web Token) 
	Json Web Token is also act like a middleware which helps to authenticate the user.Valid user get the json web token in return while login. JWT consist of three things:- 
	- Header:- Algo and token type
	- Payload:- Data
	- Verify Signature