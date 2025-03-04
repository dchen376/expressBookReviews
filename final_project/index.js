const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check session-based authentication
    
    if (req.session.authorization) {
        let token = req.session.authorization['token'];


        if (!token) {
            return res.status(403).json({ message: "Missing authentication token" });
        }

        // Verify JWT token
        jwt.verify(token, "secret-key", (err, customer) => {
            if (!err) {
                req.customer = customer;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "Customer not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "Customer not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
