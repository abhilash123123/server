var express = require('express')
var router = express.Router()
var pool = require('./db')


//get all orders
router.get('/api/get/allorders', (req, res, next) => {
  pool.query("SELECT * FROM orders ORDER BY date_created DESC", (q_err, q_res) => {
    res.json(q_res.rows)
  })
})


//get a particular order
router.get('/api/get/order', (req, res, next) => {
  const post_id = req.query.post_id

  pool.query(`SELECT * FROM orders
              WHERE pid=$1`, [post_id],
    (q_err, q_res) => {
      res.json(q_res.rows)
    })
})


// router.post('/api/post/posttodb', (req, res, next) => {
//   const values = [req.body.title, req.body.body, req.body.uid, req.body.username]
//   pool.query(`INSERT INTO posts(title, body, user_id, author, date_created)
//               VALUES($1, $2, $3, $4, NOW() )`, values, (q_err, q_res) => {
//           if(q_err) return next(q_err);
//           res.json(q_res.rows)
//     })
// })


//update an order
router.put('/api/put/modifyOrder', (req, res, next) => {
  const values = [req.body.title, req.body.body, req.body.uid, req.body.pid, req.body.cost]
  pool.query(`UPDATE posts SET title= $1, body=$2, user_id=$3, cost=$5, date_created=NOW()
              WHERE pid = $4`, values,
    (q_err, q_res) => {
      console.log(q_res)
      console.log(q_err)
    })
})


//cancel order
router.delete('/api/delete/order', (req, res, next) => {
  const post_id = req.body.post_id
  pool.query(`DELETE FROM orders WHERE pid = $1`, [post_id],
    (q_err, q_res) => {
      res.json(q_res.rows)
      console.log(q_err)
    })
})


// router.put('/api/put/modifyorders', (req, res, next) => {
//   const values = [req.body.comment, req.body.user_id, req.body.post_id, req.body.username, req.body.cid]

//   pool.query(`UPDATE orders SET
//               comment = $1, user_id = $2, post_id = $3, author = $4, date_created=NOW()
//               WHERE cid=$5`, values,
//     (q_err, q_res) => {
//       res.json(q_res.rows)
//       console.log(q_err)
//     })
// })


//Search orders
router.get('/api/get/searchOrders', (req, res, next) => {
  search_query = String(req.query.search_query)
  pool.query(`SELECT * FROM orders
              WHERE search_vector @@ to_tsquery($1)`,
    [search_query], (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res.rows);
    });
});

//Save posts to db  
router.post('/api/post/messagetodb', (req, res, next) => {

  const cost = String(req.body.cost)
  const user_id = String(req.body.message_to)
  const title = String(req.body.title)
  const body = String(req.body.body)

  const values = [cost, user_id, title, body]
  pool.query(`INSERT INTO posts(cost, user_id, title, body, date_created)
              VALUES($1, $2, $3, $4, NOW())`,
    values, (q_err, q_res) => {
      if (q_err) return next(q_err);
      console.log(q_res)
      res.json(q_res.rows);
    });
});



module.exports = router
