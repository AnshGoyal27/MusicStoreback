const userModel = require('../models/DatabaseModel')

module.exports={
    async deleteplaylist(obj){
        await userModel.findOneAndUpdate({'User-ID':obj.userid},{Playlist:obj.playlist},(err,doc)=>{
            if(err){
                console.log(err);
            }
        }).clone()
    },
    async SubOver(id){
        await userModel.findOneAndUpdate({'User-ID':id},{Subscriber:'false'},(err,doc)=>{
            if(err){
                console.log(err);
            }
        })
    },
    async PaymentDone(id,time){
        if(time==='month'){
            await userModel.findOneAndUpdate({'User-ID':id},{Subscriber:'true',Subscription:new Date().setMonth(new Date().getMonth() + 1)},(err,doc)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Subscribeedddddd       ",doc);
                }
            }).clone();
        }
        else if(time==='year'){
            await userModel.findOneAndUpdate({'User-ID':id},{Subscriber:'true',Subscription:new Date().setFullYear(new Date().getFullYear() + 1)},(err,doc)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Subscribeedddddd       ",doc);
                }
            }).clone();
        }
        
    },
    async addplaylist(obj){
        await userModel.findOne({'User-ID':obj.userid}).exec()
        .then((doc)=>{
            console.log(doc);
            if(!doc){
                const createUser=this.addUser(obj.userid);
                if(createUser._id){
                    this.AddPlaylist(createUser,obj.playlistname,obj.playlist)
                    return '300'
                }
                else{
                    console.log(err);
                    return err;
                }
            }
            else{
                this.AddPlaylist(doc,obj.playlistname,obj.playlist)
                return'300'
            }
        })
        .catch((err)=>{
            console.log(err);
            return err;
        })
    },
    async addUser(loginid){
        const result = await userModel.create({'User-ID':loginid,'Playlist':[],'Subscriber':'false','Subscription':new Date()});
        if(result._id){
            return result;
        }
        else{
            console.log('Error Adding User');
        }
    },
    async AddPlaylist(user,playllistname,playlist){
        if(user.Playlist.length===0){
            const arr=[{playlistname:playllistname,playlist:playlist}]
            userModel.findOneAndUpdate({'User-ID':user['User-ID']},{Playlist:arr},(err,doc)=>{
                if(err){
                    console.log(err);
                    return err
                }
                else{
                    console.log(doc);   
                    return '300'
                }
            })
        }
        else{
            const arr=[]
            let found=true;
            user.Playlist.forEach((Element)=>{
                if(Element.playlistname===playllistname){
                    const obj={playlistname:playllistname,playlist:playlist};
                    arr.push(obj);
                    found=false;
                }
                else{
                    arr.push(Element)
                }
            })
            if(found){
                arr.push({playlistname:playllistname,playlist:playlist})
            }
            userModel.findOneAndUpdate({'User-ID':user['User-ID']},{Playlist:arr},(err,doc)=>{
                if(err){
                    console.log(err);
                    return err
                }
                else{
                    console.log(doc);
                    return '300'   
                }
            })
        }
    },
    async getData(userid){
        let playlist=[]
        await userModel.findOne({'User-ID':userid}).exec()
        .then((doc)=>{
            console.log('Docccccccccccc',doc);
            playlist=doc.Playlist;
        })
        .catch((err)=>{
            console.log(err);
            playlist=false;
        })
        return playlist
    },
    async subcheck(userid){
        return await userModel.findOne({'User-ID':userid}).exec()
        .then((doc)=>{
            const date=new Date();
            if(!doc){
                this.addUser(userid);
            }
            else{
                if(doc['Subscriber']==='true'){
                    if(date<=doc['Subscription']){
                        return 'Subscribed'
                    }
                    else{
                        this.SubOver(userid);
                        return 'Not Subscribed'
                    }
                }
                else{
                    return 'Not Subscribed';
                }
            }
        })
        .catch((err)=>{
            console.log(err);
            return err;
        })
    }
}