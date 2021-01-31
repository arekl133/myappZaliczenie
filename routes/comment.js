var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/comment', function(req, res, next) {
  res.render('comment', { title: 'Formularz Komentarzy' });
});


/* POST */
router.post('/formproblem', async function(req, res){
  try{
    var myDate = new Date();
    let com = {
      commentNick: req.body.comment_nick,
      warrningText: req.body.warrning,
      myDate:  req.body.my_date,
    };
    await req.db.db("myapp").collection("warrningcol").insertOne(com);
    res.render('comment', {title: 'Komentarze', problemtab: com});
  }catch(err){
    console.error(err);
  }
});


/*Get */

// router.get("/formproblem", async function (req, res, next){
//   const problem = await req.db.db("myapp").collection("warrningcol")
//   .find({})
//   .toArray();

//   res.render('comment' ,{title: 'tablica', form: problem});
  
// });
router.get('/formproblem', async function(req, res, next){
  const problem = await req.db.db("myapp").collection("warrningcol")
  .find({})
  .collation({
    locale: 'pl'
  })
   .sort(['commentNick' , 1])
  .toArray()
 
  
res.render('problemtab', {title: 'problemtab', problemtab: problem});

});

/* DELETE team */
router.get('/problemtab-delete', async function (req, res, next) {
  try {
    let id = req.query.id;
    await req.db.db('myapp').collection("warrningcol").findOneAndDelete({_id: ObjectId(id)});
    
    res.redirect('/formproblem');
  } catch (err) {
    console.error(err);
  }
  //next();
});





module.exports = router;