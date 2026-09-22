import mongoose from "mongoose"

export const connectDB = async () => {
    try{
    await mongoose.connect("mongodb+srv://olaemmaogunjobi_db_user:PgWyoSIvBGrGwYfs@cluster0.qusb65r.mongodb.net/notes_db?appName=Cluster0");
    console.log("MONGODB CONNECTED SUCCESSFULLY")
    } catch(error){
      console.error("Error connecting to MONGODB", error)
    }
}