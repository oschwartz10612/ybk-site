const router = require('express').Router();
const express = require('express');
const mysql = require('../config/mysql');

const authCheck = function(req, res, next) {
  if (!req.user) {
    res.redirect('/home?login=y');
  } else {
    next();
  }
};

//****PAGES****//
router.get('/', authCheck, function(req, res) {
  res.render('pages/dashboard', {
    user: req.user,
    dashboard: true
  });
});

router.get('/inspiration', authCheck, function(req, res) {
  let sql = 'SELECT * FROM assignments WHERE user_id = ?';
  let query = mysql.query(sql, req.user.user_id, (err, result) => {
      if (err) throw err;
      if (result[0] != null) {
        var data = result[0];
        delete data.user_id;

        res.render('pages/inspiration', {
          user: req.user,
          data: data,
          inspiration: true
        });
      } else {
        res.render('pages/inspiration', {
          user: req.user,
          inspiration: true
        });
    }
  });
});

router.get('/calendar', authCheck, function(req, res) {
    res.render('pages/calendar', {user: req.user, calendar: true});
});

router.get('/roster', authCheck, function(req, res) {
    res.render('pages/roster', {user: req.user, roster: true});
});

//*****FORMS*****//
router.post('/form', express.urlencoded({
  extended: true
}), function(req, res) {
  const table = req.body.table;
  delete req.body.table;
  const values = Object.values(req.body);
  const keys = Object.keys(req.body);

  //Update table
  let sql = 'SELECT * FROM ' + table + ' WHERE user_id = ?';
  var data = values;
  let query = mysql.query(sql, req.user.user_id, (err, result) => {
    if (err) throw err;
    if (result[0] != null) {

      let sql = 'UPDATE ' + table + ' SET ';
      if (keys.length == 1) {
        sql = sql + keys[0] + ' = ? WHERE user_id = ?'

      } else {
        for (var i = 0; i < keys.length - 1; i++) {
          sql = sql + keys[i] + ' = ?, '
        }
        sql = sql + keys[keys.length - 1] + ' = ? WHERE user_id = ?';
      }
      data.push(req.user.user_id);

      let query = mysql.query(sql, data, (err, result) => {
        if (err) throw err;
      });
    } else {

      //new submittion
      let submittion = req.body;
      submittion.user_id = req.user.user_id;

      let sql = 'INSERT INTO ' + table + ' SET ?';
      let query = mysql.query(sql, submittion, (err, result) => {
        if (err) throw err;
      });
    }
  });
  res.redirect('back');
});

module.exports = router;
