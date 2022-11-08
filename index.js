const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.get("/services", async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query);
            const result = await cursor.limit(3).toArray()
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