import express from 'express'
import Items from './app/controllers/Items.js'
import fs from 'fs';
import mime from 'mime';


const app = express()
const port = 3001
const items = new Items({
  path: await fs.realpathSync('./data'),
  url: 'http://localhost:3001'
});



/*
File passthrough
*/
app.get('/items/:id/*', async (req, res, next) => {

  const cleanedPath = req.params[0]
  .replace('..', '')
  .replace('//', '/')

  const path = req.params.id+'/'+cleanedPath;
  const realPath = await fs.realpathSync('./data/items/'+path);

  // Send file
  res.sendFile(realPath);

})

/*
Get items by ID
*/
app.get('/items/:id', async (req, res) => {

  const id = req.params.id;
  const item = await items.fetchItemById(id);
  
  res.json(item)

})


app.listen(port, () => {
  console.log(`OMD server running on ${port}`)
})