const express = require('express')
const app = express()
const port = 5000
const routers = require("./routers/routes.js")
const cors = require('cors');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors(
    {
          origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
    }
))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


app.use("/api",routers)

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
