const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const { EventHubClient } = require('azure-event-hubs')
const client = EventHubClient.createFromConnectionString(process.env["EVENTHUB_CONNECTION_STRING"], process.env["EVENTHUB_NAME"])

const MARKET = require('./markets')
const TYPES = ['Sports', 'Lotto', 'Bingo', 'Poker', 'Slots'];
const SPORT = ['Tennis', 'Cricket', 'Horse Racing', 'Football'];
const WON_LOSS = ['Won', 'Lost', 'Lost', 'Lost', 'Lost'];

const bet_events = []

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/events/bets/generate/:id', (req, res) => {
  const customerId = req.params.id
  bet_events.push(customerId)
})

app.post('/events/bets/stop/:id', (req, res) => {
  const customerId = req.params.id
  bet_events = bet_events.filter(i => i != customerId)
})

app.listen(process.env.PORT || 8090, () => {
  console.log('Server started')
})

setInterval(() => {
  if (bet_events.length > 0) {
    
    const wonLost = randomPickFromArray(WON_LOSS)
    const sport = randomPickFromArray(SPORT)

    bet_events.forEach(async id => {
      const eventData = { 
        partitionKey: id,
        type: randomPickFromArray(TYPES),
        sport,
        odds: Math.floor(Math.random() * 21) + '/' + Math.floor(Math.random() * 21),
        market: randomPickFromArray(MARKET[sport]),
        betDate: new Date(),
        amount: Math.floor(Math.random() * 100),
        wonLost,
        wonAmount: (wonLost == 'Won' ? Math.floor(Math.random() * 1000) : 0)
      }

      const delivery = await client.send({ body: JSON.stringify(eventData) })

      console.log("message sent successfully.", delivery.id)
    })
  }
}, 10000)

function randomPickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}