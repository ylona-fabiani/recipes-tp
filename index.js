const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important
const axios = require('axios')
const api_key = '04c547857520b4a9bbe5ee0d32db370e6cfed'

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

//READ

app.get('/recipes', async function (req, res) {
  const db = await axios.get('https://recipestp-2fc5.restdb.io/rest/r-recipes', { headers : {'x-api-key' : api_key} })
  let qTitle = db.data.map(e => {return {"id" : e._id, "title" : e.title}}); // map renvoie un nvo tableau de ce qu'on veut 
                                                              // on,peut apres faire un foreach dessus pour les titles en li
  res.json(qTitle)
})

app.get('/users', async function (req, res) {
  const db = await axios.get('https://recipestp-2fc5.restdb.io/rest/r-users', { headers : {'x-api-key' : api_key} })
  console.log(db.data);
  res.send(db.data)
})

//CREATE
app.post('/recipes', express.json(), async function(req,res){
  const db = await axios.post('https://recipestp-2fc5.restdb.io/rest/recipes', req.body,{
    headers: {
      "x-api-key": api_key
    }
  })
  res.send('Recette Créée')
})

app.post('/users', express.json(), async function(req,res){
  const db = await axios.post('https://recipestp-2fc5.restdb.io/rest/recipes', req.body,{
    headers: {
      "x-api-key": api_key
    }
  })
  res.send('Recette Créée')
})

//UPDATE

//DELETE
