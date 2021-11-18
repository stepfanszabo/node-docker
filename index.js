const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const axios = require('axios')
const cheerio = require('cheerio')

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config')

const redis = require('redis')
const session = require('express-session')
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("Succesfully connected to Mongo DB"))
        .catch((err) => {
            console.log(err)
            console.log("Connecting to DB...")
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

app.enable("trust proxy")
app.use(cors({}))
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 60000
        }
    })
)

app.use(express.json())

app.get('/', (req, res) => {
    console.log("hejhoo")
    res.send("<h1>Hola, mucho gusto!!</h1>mukodik a fucking automatizacio!")
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

const list = []

app.use('/lufthansa', (req, res) => {
    axios.get('https://www.lufthansa.com/es/en/europe-fares-economy-class')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const scrapedData = [];
            $("table > tbody > tr").each((index, element) => {
                if (index === 0) return true;
                const tds = $(element).find("td");
                const service = $(tds[0]).text();
                const elight = $(tds[1]).text();
                const eclassic = $(tds[2]).text();
                const eflex = $(tds[3]).text();
                const bclass = $(tds[4]).text();
                const tableRow = { service, elight, eclassic, eflex, bclass };
                scrapedData.push(tableRow);
            });
            console.log({scrapedData})
            res.json({scrapedData})
        })
        .catch((error) => console.log(error))

})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))



// const stripe = require('stripe')('sk_test_51Jr7KKC2z3YN7z2CjTOMIMeWutqfvNlgYfmJxy71iEesycmhdqsXKPJA8DDFuDpsX56E0ipH93ao3fKJ8dR8JCqw00J6QpxIyh')
// app.get('/api', (req, res) => {
//     const apiKey = req.query.apiKey

//     res.send({ data: 'Hola, mucho gusto!'})
// })

// app.post('/checkout', async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//         mode: 'subscription',
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price: 'price_1Jr7cVC2z3YN7z2CkaaejslB'
//             }
//         ],
//         success_url: 'http://localhost:3000/api',
//         cancel_url: 'http://localhost:3000/api',
//     })

//     res.send(session)
// })