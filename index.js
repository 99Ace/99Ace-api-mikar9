const express = require('express');
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
const Mail = require('nodemailer/lib/mailer');
const cors = require("cors");
const async = require('hbs/lib/async');
require('dotenv').config()

async function main() {
    let app = express();
    app.use(express.json());
    app.use(cors());
    // Load in data
    await MongoUtil.connect(process.env.MONGO_URL, process.env.DBNAME);
    let db = MongoUtil.getDB();

    // ROUTES
    // READ - ALL DATA
    app.get('/m9User/read', async (req,res)=> {
        try {
            let data = await db.collection(process.env.COLLECTION).find().toArray();
            res.status(200)
            res.send(data)
            console.log('data sent')
        } 
        catch(e)  {
            res.status(500);
            res.send({
                message : "No data available"
            })
        }
    })
    // CREATE - NEW DATA
    app.post('/m9User/create', async (req,res)=> {
        let first_name = req.body.first_name;
        let last_name = req.body.last_name; 
        let position = req.body.position;
        console.log(first_name,last_name,position);

        try {
            let result = await db.collection(process.env.COLLECTION).insertOne({
                first_name : first_name,
                last_name : last_name,
                position : position
            })
            res.status(200);
            res.send(result)
        } catch (e) {
            res.status(500);
            res,send({
                message:"Unable to insert new User"
            })
            console.log(e)
        }
    })
    // UPDATE - ONE DATA
    app.put("/m9User/:id/update", async (req,res)=>{
        try{
            let results = await db.collection(process.env.COLLECTION).updateOne(
            {
                _id : ObjectId(req.params.id)
            }, 
            {
                "$set" : {
                    "first_name" : req.body.first_name,
                    "last_name" : req.body.last_name,
                    "position" : req.body.position
                }
            });

            res.status(200);
            res.send({
                results,
                "message":"User profile updated"
            })
        } catch (e) {
            res.status(500);
            res.send({
                'message':"Unable to update User"
            })
            console.log(e);
        }
    })

    // DELETE - ONE DATA
    app.delete("/m9User/:id/delete", async(req,res)=>{
        try {
            await db.collection(process.env.COLLECTION).deleteOne({
                _id:ObjectId(req.params.id)
            })
            console.log(req.params.id)
            res.status(200);
            res.send ({
                "message" : "Player is deleted"
            });
        } catch (e) {
            res.status(500);
            res.send ({
                "message" : "Error removing User from database"
            });
            console.log(e);
        }
    })
    // FIND ONE - ONE DATA
    app.get('/m9User/:id/findone', async (req,res)=>{
        try {
            let data = await db.collection(process.env.COLLECTION).find({
                "_id" : ObjectId(req.params.id)
            }).toArray();
            res.status(200)
            res.send(data[0])
            console.log('data sent')
        } 
        catch(e)  {
            res.status(500);
            res.send({
                message : "No data available"
            })
        }
    })
    // SEARCH FOR FIRST_NAME
    app.get('/m9User/search/:first_name/first_name', async (req,res)=>{
        try {
            let data = await db.collection(process.env.COLLECTION).find({
                "first_name" : req.params.first_name,
            }).toArray();
            res.status(200)
            res.send(data)
            console.log('data sent')
        } 
        catch(e)  {
            res.status(500);
            res.send({
                message : "No data available"
            })
        }
    })
    // SEARCH FOR LAST_NAME
    app.get('/m9User/search/:last_name/last_name', async (req,res)=>{
        console.log(req.params.last_name)
        try {
            let data = await db.collection(process.env.COLLECTION).find({
                "last_name" : req.params.last_name
            }).toArray();
            res.status(200)
            res.send(data)
            console.log('data sent')
        } 
        catch(e)  {
            res.status(500);
            res.send({
                message : "No data available"
            })
        }
    })
    // SEARCH FOR POSITION
    app.get('/m9User/search/:position/position', async (req,res)=>{
        try {
            let data = await db.collection(process.env.COLLECTION).find({
                "position" : req.params.position
            }).toArray();
            res.status(200)
            res.send(data)
            console.log('data sent')
        } 
        catch(e)  {
            res.status(500);
            res.send({
                message : "No data available"
            })
        }
    })

    app.listen(process.env.PORT, () => {
        console.log("Server started")
    })
    // app.listen(3000, () => {
    //     console.log("Server started")
    // })
    
}
main()