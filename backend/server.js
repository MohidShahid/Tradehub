const app = require("./app")


process.on("uncaughtException", (error) => {
  console.error("Unexpected error:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Unexpected error:", error);
});

app.listen(process.env.PORT, ()=>{
    console.log("App is running on http://localhost:4000");
})