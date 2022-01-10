const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important
const axios = require('axios')
const api_key = '04c547857520b4a9bbe5ee0d32db370e6cfed'
const urlDb = 'https://recipestp-2fc5.restdb.io/rest/'

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

passport.use(
  new JwtStrategy(jwtOptions, async function(payload, next) {
    const db = await axios.get(urlDb + 'r-users', { headers: { 'x-api-key': api_key } });
    const user = db.data.find(user => user._id === payload._id)

    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })
)

app.use(express.json())
app.use(passport.initialize())

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

// READ ALL RECIPES
app.get('/recipes', async function (req, res) {
  const db = await axios.get(`${urlDb}r-recipes`, { headers: { 'x-api-key': api_key } })
  let qTitle = db.data.map(e => { return { "id": e._id, "title": e.title } }); // map renvoie un nvo tableau de ce qu'on veut 
  // on,peut apres faire un foreach dessus pour les titles en li
  res.json(qTitle)
})

// READ ONE RECIPE
app.get('/recipes/:id', async function (req, res) {
  let recipe = getOneRecipe(req.params.id);
  let qTitle = {"id" : recipe._id, "title" : recipe.title};
  res.json(qTitle)
})

// READ ALL USERS
app.get('/users', async function (req, res) {
  const db = await axios.get(`${urlDb}r-users`, { headers: { 'x-api-key': api_key } })
  console.log(db.data);
  res.send(db.data)
})

//CREATE Recipes
app.post('/recipes', passport.authenticate('jwt', { session: false }), express.json(), async function(req,res){
  req.body["creator"] = req.user._id;
  const db = await axios.post(`${urlDb}r-recipes`, req.body,{
    headers: {
      "x-api-key": api_key
    }
  })
  res.send('Recette créée !')
})

//CREATE Users
app.post('/users', express.json(), async function (req, res) {
  try {
    const db = await axios.post(`${urlDb}r-users`, req.body, {
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

app.put('/recipes/:id',  passport.authenticate('jwt', { session: false }), express.json(), async function(req,res) {
  if (getOneRecipe(req.params.id) == req.user._id) {
    const db = await axios.put(`${urlDb}r-recipes/${req.params.id}`, req.body, {headers: {"x-api-key": api_key }})
    res.send("Recette modifiée !")
  }
})

//DELETE

app.delete('/recipes/:id',  passport.authenticate('jwt', { session: false }), async function (req, res) {
  const db = await axios.delete(`${urlDb}r-recipes/${req.params.id}`, { headers : {'x-api-key' : api_key} })
  res.json("Recette supprimée.")
})

getOneRecipe = async function(id) {
  const db = await axios.get(`${urlDb}r-recipes/${id}`, { headers : {'x-api-key' : api_key} })
  return db.data
}


//Login

app.get('/private', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('private. user:' + req.user._id)
})

app.post('/login', async function (req, res) {
  const name = req.body.name
  const password = req.body.password

  if (!name || !password) {
    res.status(401).json({ error: 'name or password was not provided.' })
    return
  }

  // usually this would be a database call:
  const db = await axios.get(urlDb + 'r-users', { headers: { 'x-api-key': api_key } })

  const user = db.data.find(user => user.name === name)
  
  if (!user || user.password !== password) {
    res.status(401).json({ error: 'name / password do not match.' })
    return
  }

  const userJwt = jwt.sign({ _id: user._id }, secret)

  res.json({ jwt: userJwt })
})