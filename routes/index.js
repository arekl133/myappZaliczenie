var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET team */
router.get('/team', async function(req, res, next) {
  const id = req.query.id;
  let team;
  if (id) {
    team = await req.db.db('myapp')
        .collection('teams')
        .findOne(ObjectId(id));
  } else {
    team = {
      teamName: "",
      MyEmail: "",
      MyAge: "",
     
    }
  }
  res.render('team', { title: 'Edytuj drużynę', team: team });
});





router.post('/team', async function (req, res, next) {
  try {
    let team = {
      _id: req.body._id ? ObjectId(req.body._id) : undefined,
      teamName: req.body.team_name,
      MyEmail: req.body.email,
      MyAge: req.body.my_age,
      
    };
   
    if (team._id) {
      await req.db.db('myapp').collection("teams").replaceOne({_id: team._id}, team);
  } else {
      await req.db.db('myapp').collection("teams").insertOne(team);
  }
    res.redirect('/teams');
  } catch (err) {
    console.error(err);
  }

  //next();
});





/* DELETE team */
router.get('/team-delete', async function (req, res, next) {
  try {
    let id = req.query.id;
    await req.db.db('myapp').collection("teams").findOneAndDelete({_id: ObjectId(id)});
    res.redirect('/teams');
  } catch (err) {
    console.error(err);
  }
  //next();
});

/* GET teams. */
router.get('/teams', async function(req, res, next) {
  const pageSize = 5;
  
  let sort = parseInt(req.query.sort);
  sort = sort ? sort : 1;
  
  const search = req.query.search;
  const query = search ? {
    teamName:
    {$regex: search, $options: 'i'}
  } : {};
  
  //Najprostszy sposób
  // let query = search ? {
  //   $where:`function() {
  //     return this.teamName.toLowerCase().indexOf('${search.toLowerCase()}') >= 0;
  //   }`
  // } : {} ;

//Wyszukiwanie pełnotekstowe
  // let query = search ? {
  //     teamName: {
  //         $regex: search,
  //         $options: 'i',
  //   },
  //     $text: {
  //         $search: search,
  //         $language: 'english',
  //         $caseSensitive: false,

  //       }
      
  // // } : {};

  const count = await req.db.db('myapp')
  .collection('teams')
  .count(query);

  const maxPage = Math.floor(count / pageSize);
  let page = parseInt(req.query.page);
  page = page >= 0 ? page : 0;
  page = page <= maxPage ? page : maxPage;
  const prevPage = page > 0 ? page -1 : 0;
  const nextPage = page < 0 ? page + 1: page+1 ;

 
  const teams = await req.db.db('myapp')
      .collection('teams')
      .find(query)
      .collation({
        locale: 'pl'
      })
      .sort(['teamName',sort])
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
  res.render('teams', 
  { 
    title: 'Teams',
    teams: teams,
    search: search,
    sort: sort,
    page: page + 1,
    prevPage: prevPage,
    nextPage: nextPage,
    count : count
   });
});



module.exports = router;