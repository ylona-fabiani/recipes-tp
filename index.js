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

//CREATE Recipes
app.post('/recipes', express.json(), async function(req,res){
  const db = await axios.post('https://recipestp-2fc5.restdb.io/rest/r-recipes', req.body,{
    headers: {
      "x-api-key": api_key
    }
  })
  res.send('Recette créée !')
})

//CREATE Users
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