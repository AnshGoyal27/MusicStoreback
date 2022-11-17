const express=require('express');
const router=express.Router();
const operations=require('../encrypt/operation');
const userOperations=require('../mongo/operations/operation')
require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_KEY);

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// let currentsession='';

router.post('/save',(request,response)=>{
    const obj=request.body;
    console.log(obj);
    console.log(obj.playlist);
    async function savedata(){
        await userOperations.addplaylist(obj);
        response.status(200).json({message:'hello'})
    }
    savedata()
    
})

router.post('/delete',(request,response)=>{
    const obj=request.body;
    console.log(obj);
    async function deletedata(){
        await userOperations.deleteplaylist(obj);
        response.status(200).json({message:'hello'})
    }
    deletedata()
    
})

// router.post('/login',(request,response)=>{
//     const obj=request.body;
//     currentsession=obj.g_csrf_token;
//     console.log('Loginnnnnnn',obj);

//     response.redirect('http://localhost:3000?token='+obj.credential+'&gcsrf='+obj.g_csrf_token);
// })

router.post('/loginverified',(req,res)=>{
    const obj=req.body;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: obj.credential,
            audience: process.env.GOOGLE_CLIENT,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd']
        console.log('ticketttttt',ticket);
        if(ticket){
            res.send({data:operations.RetrieveData(obj.credential),token:true});
        }
        else{
            res.send({data:'failed',token:false});
        }      
    }
      verify().catch(console.error);
})

router.post('/load',(req,res)=>{
    const obj=req.body;
    async function dataget(){
        const data=await userOperations.getData(obj.userid);
        if(data){
            console.log('Dagtaaaaaaaaaaaaaaaaaaaa',data)
            res.send({playlists:data});
        }
        else{
            res.send({playlists:[]});
        }
    }
    dataget();
    
    
})

router.post('/payment',async (req,res)=>{
    const obj=req.body;
    const succurl = 'http://localhost:1234/paid/' + obj.loggedin.id + '/' + obj.time;
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data:{
                currency:'inr',
                product_data:{
                    name:'Subscription for Music Store'
                },
                unit_amount: obj.price*100
            },
            quantity:1
          }
        ],
        mode: obj.type,
        success_url: succurl,
        cancel_url: `http://localhost:3000`,
    });
    res.header("Access-Control-Allow-Origin","http://localhost:3000");
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header("Access-Control-Allow-Methods","GET,POST");
    res.header("Access-Control-Allow-Headers","Origin,Content-Type,Authorization");
    res.send({url:session.url});
})

router.get('/paid/:userid/:time',(req,res)=>{
    async function dopayment(){
        await userOperations.PaymentDone(req.params['userid'],req.params['time']);
        res.redirect('http://localhost:3000');
    }
    dopayment();
})

router.post('/issubscribed',(req,res)=>{
    const obj=req.body;
    async function issubscribed(){
        const sub=await userOperations.subcheck(obj.userid);
        res.send({sub:sub});
    }
    issubscribed();
})



module.exports=router;


