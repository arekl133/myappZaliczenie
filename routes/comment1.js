var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/comment1', function(req, res, next) {
  res.render('comment1', { title: 'Formularz Komentarzy' });
});


/* POST */
router.post('/formproblem1', async function(req, res){
  try{
    
    let com1 = {
      commentNick1: req.body.comment_nick1,
      specadd: req.body.spec,
      
    };
    await req.db.db("myapp").collection("warrningcol1").insertOne(com1);
    res.render('comment1', {title: 'Komentarze', problemtab1: com1});
  }catch(err){
    console.error(err);
  }
});


router.post('/form',async function(req, res, next){
  try{
    let com1 = {
      _id: ObjectId(req.body._id),
      commentNick1: req.body.comment_nick1,
      specadd: req.body.spec,
    };
    await req.db.db("myapp").collection("warrningcol1").replaceMany({_id:com1._id}, com1);
    res.redirect('problemtab1');
  }catch(err){
console.log(err);
  }
});







router.get('/formproblem1', async function(req, res, next){
  const pageSize = 5;
  
  let sort = parseInt(req.query.sort);
  sort = sort ? sort : 1;

  const search = req.query.search;
  const query = search ? {
    specadd:
    {$regex: search, $options: 'i'}
  } : {};

  const count = await req.db.db('myapp')
  .collection('warrningcol1')
  .count(query);

  const maxPage = Math.floor(count / pageSize);
  let page = parseInt(req.query.page);
  page = page >= 0 ? page : 0;
  page = page <= maxPage ? page : maxPage;
  const prevPage = page > 0 ? page -1 : 0;
  const nextPage = page < 0 ? page + 1: page+1 ;
  const problem1 = await req.db.db("myapp")
  .collection("warrningcol1")
  .find(query)
  .collation({
    locale: 'pl'
  })
   .sort(['commentNick1' , sort])
   .skip(page * pageSize)
   .limit(pageSize)
   .toArray()
 
  
res.render('problemtab1', {
 problemtab1: problem1,
 search: search,
 sort: sort,
 page: page + 1,
 prevPage: prevPage,
 nextPage: nextPage,
 count : count
});

});





/* DELETE team */
router.get('/formprob1-delete1', async function (req, res, next) {
  try {
    let id = req.query.id;
    await req.db.db('myapp').collection("warrningcol1").findOneAndDelete({_id: ObjectId(id)});
    
    res.redirect('/formproblem1');
  } catch (err) {
    console.error(err);
  }
  //next();
});






module.exports = router;