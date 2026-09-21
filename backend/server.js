require("dotenv").config();
const app = require("./app")
const connectDB = require("./config/connectDB")




process.on("uncaughtException", (error) => {
  console.error("Unexpected error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

async function boot (){
  await connectDB();

app.listen(process.env.PORT, ()=>{
    console.log("App is running on http://localhost:8000");
})
}

boot();