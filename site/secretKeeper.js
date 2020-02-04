var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6060);

var path = require('path'); 
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var path = require('path'); 
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',function(req,res){
    res.render('home');
});

app.get('/user',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('user');
});

app.get('/editUser',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('editUser');
});

app.get('/createUser',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('createUser');
});

app.get('/user/:id', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    getUser(res, mysql, context, [req.params.id], complete);
    getRecords(res, mysql, context, [req.params.id], complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 2)
        {
            res.render('user',context);
        }
    }
});

app.put('/user/:id', function(req,res,next) {
    mysql.pool.query("UPDATE records SET record_name=?, record_data=?, record_URL=? WHERE record_id=?", [req.body.edit_record_name, req.body.edit_record_data, req.body.edit_record_URL, req.body.edit_record_id],
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.send();
        res.redirect('/user/'+[req.params.id]);
    });
});

app.post('/user/:id', function(req,res,next) {
    var context = {};
    mysql.pool.query(
        'INSERT INTO records (record_name, record_data, record_URL, user) VALUES (?,?,?,?)',
        [req.body.add_record_name, req.body.add_record_password, req.body.add_record_URL,[req.params.id]], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/user/'+[req.params.id]);
        }
    )
});

app.delete('/user/:id', function(req,res,next) {
    console.log(req.body);
    console.log(req.body.data1);
    mysql.pool.query(
        'DELETE FROM records WHERE record_id=?', req.body.data1, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        }
    )
});

app.get('/editUser:id',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getUser(res, mysql, context, [req.params.id], complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('editUser',context);
        }
    }
});

app.put('/editUser:id',function(req,res,next){
    mysql.pool.query("UPDATE user SET user_first=?,user_last=?, user_name=?, user_password=?, user_email=? WHERE id=?", [req.body.user_first,req.body.user_last,req.body.user_name, req.body.user_password, req.body.user_email, [req.params.id]],
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.end();
    });
});

app.post('/createUser',function(req,res,next){
    var context = {};
    mysql.pool.query(
        'INSERT INTO user (user_first, user_last, user_name, user_password, user_email) VALUES (?,?,?,?,?)',
        [req.body.user_name, req.body.user_password, req.body.user_email], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/home');
        }
    )
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

function getRecords(res, mysql, context, id, complete)
{
    mysql.pool.query("SELECT * FROM records WHERE user=?", [id], function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.records=results;
        console.log(context.records);
        complete();
    });
}

function getUser(res, mysql, context, id, complete)
{
    mysql.pool.query("SELECT * FROM user WHERE id=?", [id], function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.user=results;
        console.log(context.user);
        complete();
    });
}
