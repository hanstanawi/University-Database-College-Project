const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
const pg = require('pg');
const app = express();

const config = {
    user: 'postgres',
    database: 'university',
    password: '188188',
    port: 5432                  
};

const pool = new pg.Pool(config);

// const connect = "postgres://hanstanawi:188188@localhost/university"

app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.render('homelayout');
});

app.get('/dept', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query('SELECT * FROM departments', function(err, result){
            if(err){
                return console.error('error running query', err)
            }
            res.render('index', {departments: result.rows});
            done();
        });
    });
});

app.post('/dept/add', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("INSERT INTO departments (id, name, chairman, chairman_start_date, location) VALUES($1, $2, $3, $4, $5)",
        [req.body.id, req.body.name, req.body.chairname, req.body.date, req.body.location]);

        done();
        res.redirect('/dept');
    });
});

app.delete('/dept/delete/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("DELETE FROM departments WHERE id = $1",
            [req.params.id]);

        done();
        res.sendStatus(200);
    });
});

app.post('/dept/edit', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("UPDATE departments SET name = $1, chairman= $2, chairman_start_date=$3, location=$4 WHERE id=$5",
            [req.body.name, req.body.chairname, req.body.date, req.body.location, req.body.id]);

        done();
        res.redirect('/dept');
    });
});


//courses
app.get('/course/', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query('SELECT * FROM course ', function(err, result){
            if(err){
                return console.error('error running query', err)
            }
            res.render('courseindex', {course: result.rows});
            done();
        });
    });
});

app.post('/course/add', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("INSERT INTO course (id, name, semester, year, department_id) VALUES($1, $2, $3, $4, $5)",
        [req.body.id, req.body.name, req.body.semester, req.body.year, req.body.department_id]);

        done();
        res.redirect('/course');
    });
});

app.delete('/course/delete/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("DELETE FROM course WHERE id = $1",
            [req.params.id]);

        done();
        res.sendStatus(200);
    });
});

app.post('/course/edit', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("UPDATE course SET name = $1, semester= $2, year=$3, department_id=$4 WHERE id=$5",
            [req.body.name, req.body.semester, req.body.year, req.body.department_id, req.body.id]);

        done();
        res.redirect('/course');
    });
});


// teachers
app.get('/teachers', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query('SELECT * FROM teachers', function(err, result){
            if(err){
                return console.error('error running query', err)
            }
            
            res.render('teacherindex', {teachers: result.rows});
            done();
        });
    });
});


app.get('/teachers/search/:str', function(req, res){
    var namesearch = req.params.str;
    pool.connect(function(err, client, done){
        if(err) {
            console.error("error", err);
            res.status(500).send("Error");
        }
        else{
            client.query('SELECT * FROM teachers WHERE LOWER(name) like LOWER($1)', [`%${namesearch}%`], function(err, result){
                if(err){
                    console.error('error running query', err);
                    res.status(500).send("Error running query");
                }
                if(result.rows.length > 0){
                    res.render('teacherindex', {teachers: result.rows});
                }
                else{
                    res.render('teacherindex', {teachers: [{ssn: "No Results Found"}]});
                }
                done();
            });
        }
        
    });
});


app.post('/teachers/add', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("INSERT INTO teachers (ssn, name, address, office, bdate, phone, sex, rank, speciality, department_id, photo) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [req.body.ssn, req.body.name, req.body.address, req.body.office, req.body.bdate, req.body.phone, req.body.gender, req.body.rank, req.body.speciality, req.body.department_id, req.body.photo]);

        done();
        res.redirect('/teachers');
    });
});

app.delete('/teachers/delete/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("DELETE FROM teachers WHERE ssn = $1",
            [req.params.id]);

        done();
        res.sendStatus(200);
    });
});

app.post('/teachers/edit', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("UPDATE teachers SET name = $1, address = $2, office = $3, bdate = $4, phone = $5, sex = $6, rank = $7, speciality = $8, department_id = $9, photo = $10 WHERE ssn=$11",
            [req.body.name, req.body.address, req.body.office, req.body.bdate, req.body.phone, req.body.gender, req.body.rank, req.body.speciality, req.body.department_id, req.body.photo, req.body.ssn]);

        done();
        res.redirect('/teachers');
    });
});



//students
app.get('/students/', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query('SELECT * FROM students ', function(err, result){
            if(err){
                return console.error('error running query', err)
            }
            res.render('studentindex', {students: result.rows});
            done();
        });
    });
});

app.get('/students/search/:str', function(req, res){
    var namesearch = req.params.str;
    pool.connect(function(err, client, done){
        if(err) {
            console.error("error", err);
            res.status(500).send("Error");
        }
        else{
            client.query('SELECT * FROM students WHERE LOWER(name) like LOWER($1)', [`%${namesearch}%`], function(err, result){
                if(err){
                    console.error('error running query', err);
                    res.status(500).send("Error running query");
                }
                if(result.rows.length > 0){
                    res.render('studentindex', {students: result.rows});
                }
                else{
                    res.render('studentindex', {students: [{ssn: "No Results Found"}]});
                }
                done();
            });
        }
        
    });
});

app.post('/students/add', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("INSERT INTO students (sid, name, bdate, sex, email, phone, department_id, photo) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
        [req.body.sid, req.body.name, req.body.bdate, req.body.sex, req.body.email, req.body.phone, req.body.department_id, req.body.photo]);

        done();
        res.redirect('/students');
    });
});

app.delete('/students/delete/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("DELETE FROM students WHERE sid = $1",
            [req.params.id]);

        done();
        res.sendStatus(200);
    });
});

app.post('/students/edit', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("UPDATE students SET name = $1, bdate = $2, sex = $3, email = $4, phone = $5, department_id = $6, photo = $7 WHERE sid=$8",
            [req.body.name, req.body.bdate, req.body.sex, req.body.email, req.body.phone, req.body.department_id, req.body.photo, req.body.sid]);

        done();
        res.redirect('/students');
    });
});

app.get('/takes', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query('SELECT * FROM takes', function(err, result){
            if(err){
                return console.error('error running query', err)
            }
            res.render('takeindex', {takes: result.rows});
            done();
        });
    });
});

app.post('/takes/add', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("INSERT INTO takes (sid, course_id, student_name, course_name) VALUES($1, $2, $3, $4)",
        [req.body.sid, req.body.course_id, req.body.student_name, req.body.course_name]);

        done();
        res.redirect('/takes');
    });
});

app.post('/takes/edit', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("UPDATE takes SET student_name = $1, course_name=$2 WHERE sid = $3 AND course_id = $4",
            [req.body.student_name, req.body.course_name, req.body.sid, req.body.course_id]);

        done();
        res.redirect('/takes');
    });
});

app.delete('/takes/delete/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("DELETE FROM takes WHERE sid = $1",
            [req.params.id]);

        done();
        res.sendStatus(200);
    });
});

app.get('/teaches', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query('SELECT * FROM teaches', function(err, result){
            if(err){
                return console.error('error running query', err)
            }
            res.render('teachindex', {teaches: result.rows});
            done();
        });
    });
});

app.post('/teaches/add', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("INSERT INTO teaches (teacher_id, course_id, teacher_name, course_name) VALUES($1, $2, $3, $4)",
        [req.body.teacher_id, req.body.course_id, req.body.teacher_name, req.body.course_name]);

        done();
        res.redirect('/teaches');
    });
});

app.post('/teaches/edit', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("UPDATE teaches SET teacher_name = $1, course_name=$2 WHERE teacher_id = $3 AND course_id = $4",
            [req.body.teacher_name, req.body.course_name, req.body.teacher_id, req.body.course_id]);

        done();
        res.redirect('/teaches');
    });
});

app.delete('/teaches/delete/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err) {
            return console.error("error", err);
        }
        client.query("DELETE FROM teaches WHERE teacher_id = $1",
            [req.params.id]);

        done();
        res.sendStatus(200);
    });
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});
