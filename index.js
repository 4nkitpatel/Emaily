const express = require("express"); //commonJS module system node uses not that ES module (import this from that)
const app = express()

app.get("/", (req, res) => {
    res.send({hi : "there"})
})

// if there is not env var define by herouk use 5000 so we will use 5000 in dev but in production herouk internalyy det this env port to its convinience
const PORT = process.env.PORT || 5000
app.listen(PORT)