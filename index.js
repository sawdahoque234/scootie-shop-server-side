const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId
app.use(cors());
app.use(express.json())
const port =process.env.PORT || 5000
app.get('/', (req, res) => {
    res.send('Welcome Your Dream Scootie Shop !!!!')
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eoyrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('scootie_shop')
        const vehiclesCollection = database.collection('vehicles')
        const ordersCollection=database.collection('orders')
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection("reviews");

        //getvehicle
        app.get('/vehicles',  async (req, res) => {
            const cursor=vehiclesCollection.find({})
            const vehicles = await cursor.toArray();
            res.send(vehicles);
        })
        //get details product
        app.get('/vehicles/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const vehicle= await vehiclesCollection.findOne(query)
            res.json(vehicle);
        })
        //get my orders
        app.get("/orders/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await ordersCollection
              .find({ email: req.params.email })
              .toArray();
            res.send(result);
          });
        //get allorder
        app.get('/orders', async (req, res) => {
            const cursor=ordersCollection.find({})
            const orders = await cursor.toArray();
            res.send(orders);
        })
         //post or addproducts
         app.post('/vehicles', async (req, res) => {
            const vehicle= req.body;
            console.log(vehicle)
            const result = await vehiclesCollection.insertOne(vehicle);
            res.json(result)
        })
        // post order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result=await ordersCollection.insertOne(order)
            console.log('orders',order)
            res.json(result)
        })
        //post users
        app.post('/users', async (req, res) => {
            const result = await usersCollection.insertOne( req.body);
            console.log(result);
            res.json(result);
        });
//put admin
        app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();
            if (result) {
                const documents = await usersCollection.updateOne(filter, {
                  
                    $set:{role:"admin" },
                });
                console.log(documents)
            }
            
            res.json(result)
        
          });


        //get reviews
        app.get('/reviews',  async (req, res) => {
            const cursor=reviewsCollection.find({})
            const reviews = await cursor.toArray();
            res.send(reviews);
            })
            //post reviews
            app.post('/addreviews', async (req, res) => {
            const review= req.body;
            console.log(review)
            const result = await reviewsCollection.insertOne(review);
            res.json(result)
            })
        //updatestatus
        app.put("/statusUpdate/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await ordersCollection.updateOne(filter, {
              $set: {
                status: req.body.status,
              },
            });
            res.send(result);
            console.log(result);
          });
        
        //admin check
        
        app.get("/admin/:email", async (req, res) => {
            const result = await usersCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
            });


        //delete orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query={_id:ObjectId(id)}
            const result=await ordersCollection.deleteOne(query)
            res.json(result)
        })
        //product delete from manage product
        app.delete('/vehicles/:id', async (req, res) => {
            const id = req.params.id
            const query={_id:ObjectId(id)}
            const result=await vehiclesCollection.deleteOne(query)
            res.json(result)
        })
        
    }
    
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


//listen
app.listen(port, () => {
    console.log('Server is running',port)
})