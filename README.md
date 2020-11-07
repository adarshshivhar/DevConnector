## Dependencies

- ### Regular Dependencies

    -  `bcryptjs`:- 2.4.3
    -  `config`:- 3.3.2
    -  `express`:- 4.17.1
    -  `express-validator`:- 6.6.1
    -  `gravatar`:- 1.8.1
    -  `jsonwebtoken`:- 8.5.1
    -  `mongoose`:- 5.10.13
    -  `request`:-  2.88.2

- ### Dev Dependencies

	- `concurrently`:- 5.3.0
	- `nodemon`:- 2.0.6

- ### Express.js
	Express.js is a web application framework for Node.js. It provides various features that make web application development fast and easy which otherwise takes more time using only Node.js.

	Express.js is based on the Node.js middleware module called connect which in turn uses http module. So, any middleware which is based on connect will also work with Express.js.
    
    - #### Middleware
       I talked briefly about middleware as functions that execute after the server receives the request and before the controller action sends the response, but there are a few more things that are specific to middleware. The biggest thing is that middleware functions have access to the response (res) and request (req) variables and can modify them or use them as needed. Middleware functions also have a third parameter which is a next function. This function is important since it must be called from a middleware for the next middleware to be executed. If this function is not called then none of the other middleware including the controller action will be called.