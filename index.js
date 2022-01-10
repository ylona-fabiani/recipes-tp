const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important
const axios = require('axios')
const api_key = '04c547857520b4a9bbe5ee0d32db370e6cfed'

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

// READ ALL RECIPES
app.get('/recipes', async function (req, res) {
  const db = await axios.get('https://recipestp-2fc5.restdb.io/rest/r-recipes', { headers: { 'x-api-key': api_key } })
  let qTitle = db.data.map(e => { return { "id": e._id, "title": e.title } }); // map renvoie un nvo tableau de ce qu'on veut 
  // on,peut apres faire un foreach dessus pour les titles en li
  res.json(qTitle)
})

// READ ONE RECIPE
app.get('/recipes/:id', async function (req, res) {
  const db = await axios.get(`https://recipestp-2fc5.restdb.io/rest/r-recipes/${req.params.id}`, { headers : {'x-api-key' : api_key} })
  let qTitle = {"id" : db.data._id, "title" : db.data.title}; // map renvoie un nvo tableau de ce qu'on veut 
                                                              // on,peut apres faire un foreach dessus pour les titles en li
  res.json(qTitle)
})

app.get('/users', async function (req, res) {
  const db = await axios.get('https://recipestp-2fc5.restdb.io/rest/r-users', { headers: { 'x-api-key': api_key } })
  console.log(db.data);
  res.send(db.data)
})

//CREATE
app.post('/recipes', express.json(), async function(req,res){
  const db = await axios.post('https://recipestp-2fc5.restdb.io/rest/r-recipes', req.body,{
    headers: {
      "x-api-key": api_key
    }
  })
  res.send('Recette créée !')
})

app.post('/users', express.json(), async function (req, res) {
  try {
    const db = await axios.post('https://recipestp-2fc5.restdb.io/rest/r-users', req.body, {
      headers: {
        "x-api-key": api_key
      }
    })
    res.send('Utilisateur Créée')
  }
  catch(err) {
    res.send('pb telephone')
  }
})

//UPDATE

app.put('/recipes/:id', express.json(), async function(req,res){
  const db = await axios.put(`https://recipestp-2fc5.restdb.io/rest/r-recipes/${req.params.id}`, req.body,{
    headers: { "x-api-key": api_key }
  })
  res.send("Recette modifiée !")
})

//DELETE

app.delete('/recipes/:id', async function (req, res) {
  const db = await axios.delete(`https://recipestp-2fc5.restdb.io/rest/r-recipes/${req.params.id}`, { headers : {'x-api-key' : api_key} })
  res.json("Recette supprimée.")
})


//Login

const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const secret = 'thisismysecret'
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

const users = [{ name: 'rouree', password: '0000' }]

passport.use(
  new JwtStrategy(jwtOptions, function(payload, next) {
    const user = users.find(user => user.name === payload.name)

    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })
)

app.use(passport.initialize())
app.use(express.json())

app.get('/private', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('private. user:' + req.user.name)
})

app.post('/login', async function (req, res) {
  const name = req.body.name
  const password = req.body.password

  if (!name || !password) {
    res.status(401).json({ error: 'name or password was not provided.' })
    return
  }

  // usually this would be a database call:
  const db = await axios.get('https://recipestp-2fc5.restdb.io/rest/r-users', { headers: { 'x-api-key': api_key } })

  console.log(db);

  const user = db.data.find(user => user.name === name)
  

  if (!user || user.password !== password) {
    res.status(401).json({ error: 'name / password do not match.' })
    return
  }

  const userJwt = jwt.sign({ name: user.name }, secret)

  res.json({ jwt: userJwt })
})