const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./configs/burj-al-arab-c498b-firebase-adminsdk-sjs42-09f9c08545.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



const port = 5000

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ockyj.mongodb.net/burj-al-arab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("burj-al-arab").collection("bookings");

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking)

        console.log(newBooking);
    })
    app.get('/bookings', (req, res) => {
        const bearer = req.headers.authorization;

        if(bearer && bearer.startsWith('Bearer ') ){
     const idToken = bearer.split(' ')[1]
     console.log({idToken});
     admin
     .auth()
     .verifyIdToken(idToken)
     .then((decodedToken) => {
         let tokenEmail = decodedToken.email;
        if(tokenEmail==req.query.email){
              bookings.find({email:req.query.email})
            .toArray((err,documents) => {
              res.send(documents)
          })  
        }
         // ...
     })
     .catch((error) => {
         // Handle error
     });

        }
        else{
            res.status(401).send('Un-authorized access')
        }
      
    })
});



app.listen(port)