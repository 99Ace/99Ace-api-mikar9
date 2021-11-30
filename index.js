const express = require('express');
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
const Mail = require('nodemailer/lib/mailer');
const cors = require("cors")
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
    app.get('/m9User', async (req,res)=> {
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
    app.post('/m9User', async (req,res)=> {
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
    app.put("/m9User/:id", async (req,res)=>{
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
    app.delete("/m9User/:id", async(req,res)=>{
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

    app.listen(process.env.PORT, () => {
        console.log("Server started")
    })
}
main()