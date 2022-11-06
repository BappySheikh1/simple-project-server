const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const app = express()
const port =process.env.PORT || 5000 ;

// Midleware
app.use(cors())
app.use(express.json())


const uri = process.env.ACCESS_URL_MONGODB;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
function verifyJWT(req,res,next){
    const authHeaders=req.headers.authorization
    if(!authHeaders){
        return res.status(401).send({message:'unAuthorization access'})
    }
    const token =authHeaders.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_JWT_TOKEN_SECRET,function(err,decoded){
        if(err){
            return res.status(403).send({message : 'Forbidden access'})
        }
        req.decoded = decoded
        next();
    })
}


async function run(){
    try{
       const userCollection=client.db('UserDataColllection').collection('users');
       const userCollectionPost=client.db('UserDataColllection').collection('userPost');
       

       app.post('/jwt', (req,res)=>{
        const user=req.body
        const token=jwt.sign(user,process.env.ACCESS_JWT_TOKEN_SECRET,{expiresIn:'1d'})
        res.send({token})
       })

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
   app.get('/usersPost',verifyJWT,async(req,res)=>{
    const decoded=req.decoded
    
    if(decoded.email !== req?.query?.email){
        res.status(403).send({message : 'Forbidden access'})
    }
    let query={}
    if(req?.query?.email){
        query={
            email: req?.query?.email
        }
    }
      const cursor=userCollectionPost.find(query)
      const result=await cursor.toArray()
      res.send(result)
   })

  
    app.post('/usersPost',async (req,res)=>{
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