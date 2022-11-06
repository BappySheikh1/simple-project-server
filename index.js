const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port =process.env.PORT || 5000 ;

// Midleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://simplePractice:LwzS7DE30WI7glh9@cluster0.frkx4db.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
       const userCollection=client.db('UserDataColllection').collection('users');
       const userCollectionPost=client.db('UserDataColllection').collection('userPost');
       
       app.get('/users',async(req,res)=>{
        const quary = {}
        const cursor = userCollection.find(quary)
        const result = await cursor.toArray()
        res.send(result)
       })

       app.get('/users/:id',async(req,res)=>{
        const id =req.params.id
        const quary ={_id: ObjectId(id)}
        const services= await userCollection.findOne(quary)
        res.send(services)
    })
//    post method
   app.get('/usersPost',async(req,res)=>{
      const quary={}
      const cursor=userCollectionPost.find(quary)
      const result=await cursor.toArray()
      res.send(result)
   })
  
    app.post('/usersPost',async (req,res)=>{
       console.log(req.body);
       const user=req.body
       const result = await userCollectionPost.insertOne(user)
       res.send(result)
    })
   
    app.get('/usersPost/:id',async(req,res)=>{
        const id =req.params.id
        const quary={_id: ObjectId(id)}
        const result=await userCollectionPost.findOne(quary)
        res.send(result)
     })

     app.delete('/usersPost/:id',async (req,res)=>{
        const id =req.params.id
        const quary ={_id: ObjectId(id)}
        const result = await userCollectionPost.deleteOne(quary)
        res.send(result)
     })


    }
    finally{

    }
}
run().catch(err => console.log(err))


app.get('/',(req,res)=>{
    res.send('simple project server i running')
})

app.listen(port ,()=>{
    console.log('simple server in running in port', port);
})