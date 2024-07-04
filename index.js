import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "hero",
  password: "1020",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});


// Route to handle the search request
app.get('/search', async (req, res) => {
  const { query, propertyType, location } = req.query;
  
  let sqlQuery = 'SELECT * FROM house_properties WHERE 1=1';
  const params = [];

  if (query) {
    params.push(`%${query}%`);
    sqlQuery += ` AND (property_name LIKE $${params.length} OR description LIKE $${params.length})`;
  }

  if (propertyType && propertyType !== 'Property Type') {
    params.push(propertyType);
    sqlQuery += ` AND property_type = $${params.length}`;
  }

  if (location && location !== 'Location') {
    params.push(location);
    sqlQuery += ` AND location = $${params.length}`;
  }

  try {
    const { rows } = await pool.query(sqlQuery, params);
    res.render('searchResults', { properties: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.get('/properties', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM house_properties');
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { message: '' });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up.ejs", { message: '' });
});

app.post("/sign-up", async (req, res) => {
  const name = req.body.username;
  const email = req.body.userid;
  const password = req.body.password;
  const phone = req.body.phone;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      res.render('sign-up.ejs', { message: 'Email already exists. Try logging in.' });
    } else {
      const result = await db.query(
        "INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4)",
        [name, email, password, phone]
      );
      res.render('sign-up.ejs', { message: 'Sign-Up Successful' });
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("index.ejs");
      } else {
        res.render("login.ejs", { message: 'Invalid email or password. Please try again.' });
      }
    } else {
      res.render("login.ejs", { message: 'Invalid email or User not found' });
    }
  } catch (err) {
    console.log(err);
    res.render("login.ejs", { message: 'An error occurred. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";

// const app = express();
// const port = 3000;

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "hero",
//   password: "1020",
//   port: 5432,
// });
// db.connect();
// app.use(bodyParser.urlencoded({ extended: true }));


// const users = [
//   { email: '123@gmail.com', password: '12345' },
//   { email: 'user2@example.com', password: 'password2' }
// ];


// app.use(express.static("public"));
// app.get("/", (req, res) => {
//     res.render("index.ejs");
//   });
//   app.get("/contact", (req, res) => {
//     res.render("contact.ejs");
//   });
// app.get("/login",(req,res)=>{
//   const message='';
//   res.render('login.ejs', { message: '' });
//   res.render("login.ejs");
// })
// app.get("/sign-up", (req, res) => {
//   const message='';
//   res.render('sign-up.ejs', { message: '' });


// res.render("sign-up.ejs");
// });

// app.post("/sign-up", async (req, res) => {
// const name=req.body.username;
// const email = req.body.userid;
// const password = req.body.password;
// const phone=req.body.phone;
// console.log(email,password);

// try {
//     const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
//     email,
//     ]);

//     if (checkResult.rows.length > 0) {
//     res.send("Email already exists. Try logging in.");
//     } else {
//     const result = await db.query(
//         "INSERT INTO users (name,email, password,phone) VALUES ($1, $2,$3,$4)",
//         [name,email, password,phone]

//     );
//     res.render('sign-up.ejs',{ message: 'Sign-UP Successful' });

   
//     console.log(result);
//     // res.render("index.ejs");
//     }
// } catch (err) {
//     console.log(err);
// }
// });
// app.post("/login",async(req,res)=>{
//   const email = req.body.email;
// const password = req.body.password;
// res.render(email,password);
// console.log(email,password);
//   // Find the user in the array
// // const user = users.find(u => u.email === email && u.password === password);

// try {
//   const result= await db.query("SELECT * FROM users WHERE email = $1", [
//     email,
//   ]);
//   if (result.rows.length > 0) {
//     const user = result.rows[0];
//     const storedPassword = user.password;

//     if (password === storedPassword) {
//       res.render("index.ejs");
//     } else {
//       res.render('/', { message: 'Invalid email or password. Please try again.' });
//     }
//   } else {
//     res.render('/',{ message: 'Invalid email or User not found' });
//   }
// } catch (err) {
//   console.log(err);
// }
// });



// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
  