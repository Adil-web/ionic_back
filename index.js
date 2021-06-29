const express = require('express')
const router = require('./router/router')
const authRouter = require('./router/authRouter')
// const elasticSearch = require('elasticsearch')
const PORT = process.env.port || 8080
const app = express()

app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use('/api', router)
app.use('/auth', authRouter)


app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))

// axios.post('https://demo-api.simbase.eu/')

// const esClient = elasticSearch.Client({
//     host: "http://127.0.0.1:9200",
// })

// app.post("/products", (req, res) => {
//     esClient.index({
//         index: 'products',
//         body: {
//             "id": req.body.id,
//             "name": req.body.name,
//             "price": req.body.price,
//             "description": req.body.description,
//         }
//     })
//     .then(response => {
//         return res.json({"message": "Indexing successful"})
//     })
//     .catch(err => {
//         return res.status(500).json({"message": "Error"})
//     })
// })

// app.get("/products", (req, res) => {
//     const searchText = req.query.text
//     esClient.search({
//         index: "products",
//         body: {
//             query: {
//                 match: {"name": searchText.trim()}
//             }
//         }
//     })
//     .then(response => {
//         return res.json(response)
//     })
//     .catch(err => {
//         return res.status(500).json({"message": "Error"})
//     })
// })

// app.get("api/user", (req, res) => {
//     const searchText = req.query.text
//     esClient.search({
//         index: "person",
//         body: {
//             query: {
//                 match: {"name": searchText.trim()}
//             }
//         }
//     })
//     .then(response => {
//         return res.json(response)
//     })
//     .catch(err => {
//         return res.status(500).json({"message": "Error"})
//     })
// })