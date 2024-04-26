var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser')

var app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "result"
})

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');


app.get('/',  (req, res) => {
    res.render('login');
});

app.get('/schoolLogin', (req, res) => {
    res.render('schoollogin');
});

app.get('/AdminDashboard', (req, res) => {
    res.render('AdminDashboard');
});

app.post('/schoolLogin', (req, res) => {
    let { email, password } = req.body;
    let sql = "SELECT * FROM school WHERE email='" + email + "' AND password='" + password + "'";
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('AdminDashboard', { data: result[0] });
        } else {
            res.redirect('/')
        }
    })
})

app.get('/AddDivStd', (req, res) => {
    res.render('AddDivStd');
});

app.post('/AddDivStd', (req, res) => {
    let { std, div } = req.body;
    let sql = "INSERT INTO stddiv (`std`, `div`) VALUES ('" + std + "', '" + div + "')";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/AdminDashboard');
    })
})

app.get('/AddStaff', (req, res) => {
    let query = "select * from stddiv";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('AddStaff', { data: result });
    })
});

app.post('/AddStaff', (req, res) => {
    let { name, email, password, standard, division } = req.body;
    let sql = "INSERT INTO staff (name, email, password, sstd, sdiv) VALUES ('" + name + "', '" + email + "', '" + password + "','" + standard + "','" + division + "')";
    con.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/AdminDashboard');
    })
});

app.get('/AddStudent', (req, res) => {
    let query = "select * from stddiv";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('AddStudent', { data: result });
    })
});

app.post('/AddStudent', (req, res) => {
    let { name, email, password, rollno, standard, division } = req.body;
    let sql = "INSERT INTO student (name, email, password,rollno, ststd, stdiv) VALUES ('" + name + "', '" + email + "', '" + password + "','" + rollno + "','" + standard + "','" + division + "')";
    con.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/AdminDashboard');
    })
});
app.get('/StudentView', (req, res) => {
    let query = "select * from student";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('StudentView', { data: result });
    })
});
app.get('/StaffView', (req, res) => {
    let query = "select * from staff";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('StaffView', { data: result });
    })
});

app.get('/staffControl', (req, res) => {
    let query = "select * from staff";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('staffControl', { data: result });
    })
});
app.get('/DeleteStaff/:id', (req, res) => {
    let id = req.params.id;
    let query = "delete from staff where id=" + id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.redirect('/staffControl');
    })
});

app.get('/StaffUpdate/:id', (req, res) => {
    let id = req.params.id;
    let query = "select * from stddiv ";
    let sql = "select * from staff where id=" + id;
    con.query(sql, (err, result) => {
        if (err) throw err;
        let staffData = result[0];
        con.query(query, (err, stddivdata) => {
            if (err) throw err;
            res.render('StaffUpdate', { data: staffData, data1: stddivdata });
        });
    });
});
app.post('/StaffUpdate/:id', (req, res) => {
    let { name, email, password, standard, division } = req.body;
    let id = req.params.id;
    let sql = "UPDATE staff SET name = '" + name + "', email = '" + email + "', password = '" + password + "', sstd = '" + standard + "', sdiv = '" + division + "' WHERE id = " + id;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/staffControl');
    })
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.get('/ViewStdDivison', (req, res) => {
    query = "select * from stddiv";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('ViewStdDivison', { data: result });
    })
})
app.post('/ViewStdDivison', (req, res) => {
    let { standard, division } = req.body;
    query = "select * from student where ststd='" + standard + "' and stdiv='" + division + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('showstddiv', { data: result });
    })
})



app.get('/empLogin', (req, res) => {
    res.render('empLogin');
});

app.get('/EmpDashBoard', (req, res) => {
    res.render('EmpDashBoard');
});

var tempstd, tempdiv;
app.post('/empLogin', (req, res) => {
    let { email, password } = req.body;
    let sql = "SELECT * FROM staff where email='" + email + "' and password='" + password + "'";
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            tempstd = result[0].sstd;
            tempdiv = result[0].sdiv;
            res.render('EmpDashBoard', { data: result[0] });
        } else {
            res.redirect('/empLogin')
        }
    })
})

app.get('/StudentList', (req, res) => {
    let sql = "SELECT * FROM student where ststd='" + tempstd + "' and stdiv='" + tempdiv + "'";
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('StudentList', { data: result });
        }
        else {
            res.redirect('/empLogin')
        }
    })
});
app.get('/ResultAdd/:id', (req, res) => {
    var id = req.params.id;
    var query = "SELECT * FROM student where id=" + id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('ResultAdd', { data: result[0] });
    })
})
app.post('/ResultAdd/:id', (req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var rollno = req.body.rollno;
    var standerd = req.body.standerd;
    var division = req.body.division;
    var sub1 = parseFloat(req.body.sub1);
    var sub2 = parseFloat(req.body.sub2);
    var sub3 = parseFloat(req.body.sub3);
    var sub4 = parseFloat(req.body.sub4);
    var sub5 = parseFloat(req.body.sub5);
    var total = sub1 + sub2 + sub3 + sub4 + sub5;
    var per = (total / 500) * 100;

    var query = "insert into result SET id=" + id + ", name = '" + name + "', email = '" + email + "', rollno = '" + rollno + "',sub1 = '" + sub1 + "', sub2 = '" + sub2 + "', sub3 = '" + sub3 + "', sub4 = '" + sub4 + "', sub5 = '" + sub5 + "', total = '" + total + "', per = '" + per + "', ststd = '" + standerd + "', stdiv = '" + division + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.redirect('/StudentList');
    })
    var query = "SELECT * FROM student where id=" + id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('ResultAdd', { data: result[0] });
    })
})

app.get('/ResultList', (req, res) => {
    let query = "select * from result where ststd='" + tempstd + "' and stdiv='" + tempdiv + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('ResultList', { data: result });
    })
});

app.get('/ResultDelete/:id', (req, res) => {
    let id = req.params.id;
    let query = "delete from result where id=" + id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.redirect('/ResultList');
    })
});
app.get('/ResultUpdate/:id', (req, res) => {
    let id = req.params.id;
    let query = "select * from result where id=" + id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('ResultUpdate', { data: result[0] });
    });
});

app.post('/ResultUpdate/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let rollno = req.body.rollno;
    let standerd = req.body.standerd;
    let division = req.body.division;
    let sub1 = parseFloat(req.body.sub1);
    let sub2 = parseFloat(req.body.sub2);
    let sub3 = parseFloat(req.body.sub3);
    let sub4 = parseFloat(req.body.sub4);
    let sub5 = parseFloat(req.body.sub5);

    var total = sub1 + sub2 + sub3 + sub4 + sub5;
    var per = (total / 500) * 100;

    var update = 'update result set name="' + name + '",email="' + email + '",rollno="' + rollno + '", ststd="' + standerd + '", stdiv="' + division + '", sub1="' + sub1 + '", sub2="' + sub2 + '", sub3="' + sub3 + '", sub4="' + sub4 + '", sub5="' + sub5 + '", total="' + total + '", per="' + per + '" where id="' + id + '"';

    con.query(update, (err, result) => {
        if (err) throw err;
        res.redirect('/ResultList');
    })
})

app.get('/LoginStudent', (req, res) => {
    res.render('stdLogin');
})
app.post('/LoginStudent', (req, res) => {
    let { email, password } = req.body;
    let sql = 'select * from student where email="' + email + '" and password="' + password + '"';
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            let qury = 'select * from result where id="' + result[0].id + '"';
            con.query(qury, (err1, result1) => {
                if (err1) throw err1;
                console.log(result1);
                res.render("stdDashboard", { data: result1[0] });
            })
        }

    })
})


app.listen(4000, () => {
    console.log("server is running on port 4000");
});