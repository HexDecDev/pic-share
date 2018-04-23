var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var db = mongoose.connection;

const Schema = mongoose.Schema;

const PicSchema = new Schema({
    name             : { type: String, required: true },
    filename             : { type: String, required: true },
    tags             : { type: String, required: true },
    category         : { type: String, required: true },
    privateContent   : { type: Boolean,required: true },
    date             : { type: Date,   required: true }
});
const Pic = mongoose.model('Pic', PicSchema);



const UserSchema = new Schema({
    name             : { type: String, required: true },
    password         : { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);
 

const SessionSchema = new Schema({
    id   : {type: String, required: true},
    user : {type: String, required: true},
    setDate : { type: Date,   required: true },
    expDate : { type: Date,   required: true } 
})

const Session = mongoose.model('Session', SessionSchema);

export function ConnectToDB() {
    mongoose.connect('mongodb://localhost/pics');

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('MongoDB connection OK!!');
    });
}


export function addUser(data){

    const user = new User({
        name: data.name,
        password: data.password
    });

    return user.save();
    
}


export function addPicture(data){

    const pic = new Pic({
        name: data.name,
        filename: data.filename,
        tags: data.tags,
        category: data.category,
        privateContent: data.privateContent,
        date: new Date()
    });

    return pic.save();
    
}

export function setSesstion(data)
{
    const session = new Session({
        id: data.id,
        user: data.user,
        setDate: data.setDate,
        expDate: data.expDate

    });

    return session.save();
}


export function checkSession(name)
{
    return Session.count({user: name});  
}

export function checkSessionByCookie(id)
{
    return Session.count({id: id});  
}

export function rewriteSession(name, data)
{
    return Session.findOneAndUpdate({user: name}, 
    {
        $set:{
            id: data.id,
            name: data.name,
            setDate: data.setDate,
            expDate: data.expDate
        }
    })
}

export function getUserFromSession(id)
{
    return Session.find ({id: id});
}

export function removeSession(id)
{
    return Session.find ({id: id}).remove(); 
}

export function checkUser(name)
{
    return User.count({name: name});  
}


export function getUser(name)
{
    return User.find({name: name});
}



export function returnTotalPicsCount(tags, privateContent){
    if (privateContent === true)
    {

        if (tags) return Pic.aggregate([
            {
                $match: {
                    tags: {$eq: tags}
                }
            },
            {
                $group: {
                    _id: tags,
                    count: {$sum: 1}
                }
            }
        ]);
        else return Pic.count({ });
    }
    else 
    {
        if (tags) return Pic.aggregate([
            {
                $match: {
                    tags: {$eq: tags},
                    privateContent: false
                }
            },
            {
                $group: {
                    _id: tags,
                    count: {$sum: 1}
                }
            }
        ]);
        else return Pic.count({privateContent: false });
    }
}


//.skip(2).limit(5)
export function getAllPictures(skip, limit, tags, privateContent){
    if (privateContent === true)
    {
        
        if (tags) return Pic.find({tags:tags}, null, {sort: {date: -1}} ).skip(skip).limit(limit);
        else return Pic.find({}, null, {sort: {date: -1}} ).skip(skip).limit(limit);
    }

    else 
    {
        if (tags) return Pic.find({tags:tags, privateContent: false}, null, {sort: {date: -1}} ).skip(skip).limit(limit);
        else return Pic.find({privateContent: false}, null, {sort: {date: -1}} ).skip(skip).limit(limit);       
    }
}

export function getPicturesByName(skip, limit, text, privateContent){
    if (privateContent === true)
        return Pic.find({name: { "$regex": text, "$options": "i" }}, null, {sort: {date: -1}} ).skip(skip).limit(limit);
    else 
        return Pic.find({name: { "$regex": text, "$options": "i" }, privateContent: false}, null, {sort: {date: -1}} ).skip(skip).limit(limit);
}


export function getPicturesByCategory(cat, privateContent){
    if (privateContent === true) return Pic.find({category: cat}, null, {sort: {date: -1}} );
    else return Pic.find({category: cat, privateContent: false}, null, {sort: {date: -1}} );
}

export function getPictureByID(id){
    return Pic.findById(id);
}

export function deletePicture(id) {
    return Pic.findById(id).remove();
}
