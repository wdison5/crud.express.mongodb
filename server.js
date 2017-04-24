const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient


app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())

app.set('view engine', 'ejs')


var db

MongoClient.connect('mongodb://wdison:wdison@127.0.0.1:27017/wdison', (err, database) => {
	// ... start the server
	if (err){
		//  	database.close()
		return console.log(err)
	} 
	db = database
	app.listen(3000, () => {
		console.log('listening on 3000')
	})
})

app.get('/', (req, res) => {
	db.collection('quotes').find().toArray((err, results) => {
	  	// send HTML file populated with quotes here
	})

	db.collection('quotes').find().toArray((err, result) => {
		if (err) return console.log(err)
			console.log(result)
		// renders index.ejs
		res.render('index.ejs', {quotes: result})
	})
})

app.post('/quotes', (req, res) => {
	console.log(req.body)

	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)
			console.log('saved to database')
		res.redirect('/')
	})
})

app.put('/quotes', (req, res) => {
	db.collection('quotes')
	.findOneAndUpdate({name: 'Yoda'}, {
		$set: {
			name: req.body.name,
			quote: req.body.quote
		}
	}, {
		sort: {_id: -1},
		upsert: true
	}, (err, result) => {
		if (err) return res.send(err)
			res.send(result)
	})
})

app.delete('/quotes', (req, res) => {
	db.collection('quotes').findOneAndDelete({name: req.body.name},
		(err, result) => {
			if (err) return res.send(500, err)
				res.send(JSON.stringify('A darth vadar quote got deleted'))
		})
})

