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
            const cursor = serviceCollections.find(query);
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.get("/all-services", async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/all-services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollections.findOne(query)
            res.send(result)
        })

        // app.get("/review",async(req,res)=>{
        //     const query={}
        //     const cursor=reviewCollections.find(query)
        //     const result=await cursor.toArray()
        //    res.send(result)
        //     console.log(result)

        // })

        app.get("/review/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query={}
            const cursor = reviewCollections.find(query) 
            const result = await cursor.toArray()
            const filtered=result.filter(data=>data.id!==id)
            res.send(filtered)
            console.log(result)
        })

        app.post("/review", async (req, res) => {
            const user = req.body;
            const result = await reviewCollections.insertOne(user)
       
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