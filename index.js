const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port= process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors({
  origin: ["http://localhost:5173","https://candid-truffle-a6f421.netlify.app"],
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    withCredentials: true,
  }))
app.use(express.json());
 
  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pb63j1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7) 

    const artCollection = client.db('artDB').collection('art')
    const craftCollection = client.db('islam88758').collection('artCraftDb')

    app.get('/art',async(req,res)=>{
      const cursor = artCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/art', async(req,res)=>{
        const newArt = req.body;
        console.log(newArt)
        const result = await artCollection.insertOne(newArt)
        res.send(result)
    })

    app.get('/craft', async(req,res)=>{
      const cursor = craftCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
 
    app.get('/craft',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await artCollection.findOne(query)
      res.send(result)
    })



    app.delete('/art/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await artCollection.deleteOne(query)
      res.send(result)
    }) 
    


    app.put('/art/:id',async(req,res)=>{
      const id =req.params.id;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true}
      const updatedArt = req.body;
      const art ={
        $set:{
          subcategory_name: updatedArt.subcategory_name,
          item_name: updatedArt.item_name, 
          short_description: updatedArt.short_description,
          price: updatedArt.price,
          rating: updatedArt.rating,
          customization: updatedArt.customization,
          processing_time: updatedArt.processing_time,
          stockStatus: updatedArt.stockStatus, 
          image: updatedArt.image,
        }
      }
      const result = await artCollection.updateOne(filter,art,option)
      res.send(result)
    } )






    // Send a ping to confirm a successful connection 
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('art and carft server is running')
})

app.listen(port,()=>{
    console.log(`art and carft server is running${port}`)
})