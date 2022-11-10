const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

//middle Ware
app.use(cors())
app.use(express.json())

//mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbsccmb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollections = client.db("service-review").collection("services");
        const reviewCollections = client.db("service-review").collection("reviews");
        app.get("/services", async (req, res) => {
            const query = {}
            const sort = { time: -1 };
            const cursor = serviceCollections.find(query).sort(sort)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.get("/all-services", async (req, res) => {
            const query = {}
            const sort = { time: -1 };
            const cursor = serviceCollections.find(query).sort(sort)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/all-services", async (req, res) => {
            const service = req.body;
            const result=await serviceCollections.insertOne(service)
            res.send(result)
           
        })

        app.get("/all-services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollections.findOne(query)
            res.send(result)
        })

        app.get("/my-review", async (req, res) => {
            const cursor = reviewCollections.find({})
            const result = await cursor.toArray()
            if (req.query.email) {
                const filtered = result.filter(data => data.email === req.query.email)
                res.send(filtered)
            }
            else {
                res.send(result)

            }

        })

        app.put("/my-review/:id",async(req,res)=>{
           const id=req.params.id;
           const data=req.body;
           console.log(id,data)
           const query={_id:ObjectId(id)}
           const options = { upsert: true };
            const updateDoc={
                $set:{
                    description:data.updateDescription,
                    rating:data.updateRating
                }
            }
            const result= await reviewCollections.updateOne(query,updateDoc,options)
            res.send(result)
            console.log(result)
        })

        app.get("/review/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {}
            const sort = { time: -1 };
            const cursor = reviewCollections.find(query).sort(sort)
            const result = await cursor.toArray()
            const filtered = result.filter(data => data.id === id)
            res.send(filtered)
            console.log(result)
        })

        app.post("/review", async (req, res) => {
            const user = req.body;
            const result = await reviewCollections.insertOne(user)
            res.send(result)

        })

        app.delete("/my-review/:id",async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await reviewCollections.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(er => console.log(er))



app.get("/", (req, res) => {
    res.send("review server is running")
})

app.listen(port, () => {
    console.log(`review server is running on port ${port}`)
})