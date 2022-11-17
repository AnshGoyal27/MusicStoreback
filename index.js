const express=require('express');
const app=express();
require("dotenv").config()
var cors = require('cors')
app.use(cors({
    origin:'https://musicstorebm.netlify.app'
}))

const useRouter=require('./routes/routes');





app.use(express.json());
app.use(express.urlencoded());

app.use('/',useRouter);

const server=app.listen(process.env.PORT || 1234,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Server Started ",server.address().port);
    }
})
