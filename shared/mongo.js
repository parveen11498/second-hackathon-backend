const { MongoClient} = require("mongodb");

const mongo={
    db:null, //db conenction
    customers:null,
    posts:null,  //posts colection
     users:null,

    async connect(){
        try {
            //connecting to mongo
            const client = new MongoClient(process.env.MONGO_URL)
            await client.connect();
            console.log("mongodb connected succesfully")
            //selecting the db
            this.db = await client.db(process.env.MONGO_NAME)
            console.log(`Mongo database selected ${process.env.MONGO_NAME}`)
         this.posts=await this.db.collection("posts")
         this.users=await this.db.collection("users")
         console.log("mongo collection initialized")
        } catch (err) {
            throw new Error(err)
        }
    }
};
module.exports=mongo;