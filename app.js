const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { request } = require('https');


//importing the css file



//Information on books

const books = [{
    bookName: "Rudest Book Ever",
    bookAuthor: "Shwetabh Gangwar",
    bookPages: 200,
    bookPrice: 240,
    bookState: "Available",
    isDeleted : false
},
{
    bookName: "Do Epic Shit",
    bookAuthor: "Ankur Wariko",
    bookPages: 200,
    bookPrice: 240,
    bookState: "Available",
    isDeleted : false
}]

// assigning the express module to the app
const app = express()

const deletedBooks = []

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use( bodyParser.json() );
   app.use( bodyParser.urlencoded({
    extended : true
   }))

   // Adding express as a middleware
   app.use(express.urlencoded({ extended: true}));

   app.get("/", function (req, res) {
    res.render("home", {
        data: books,
        deletedBooks : deletedBooks
    } )
})


   app.post("/", (req, res)=>{
    const inputBookName = req.body.bookName
    const inputBookAuthor = req.body.bookAuthor
    const inputBookPages = req.body.bookPages
    const inputBookPrice = req.body.bookPrice

    books.push({
       bookName : inputBookName,
       bookAuthor: inputBookAuthor,
       bookPages : inputBookPages,
       bookPrice : inputBookPrice,
       bookState : "Available",
    });
    res.render("home", {
        data: books
      }, () => {
        res.redirect('/');
      });
   })
   
   app.post("/issue", function(req, res) {
    var requestedBookName = req.body.bookName
    books.forEach(book => {
        if (book.bookName = requestedBookName){
            book.bookState = "Issued"
        }
    })
    res.render('home', {
        data : books
    }, () =>{
        res.redirect('/')
    });
  });
  app.post("/return", function(req, res) {
    var requestedBookState = req.body.bookState
    books.forEach(book => {
        if (book.bookState = requestedBookState){
            book.bookState = "Available"
        }
    })
    res.render('home', {
        data : books
    }, ()=>{
        res.redirect('/')
    });
  });

  app.post('/delete', (req, res) => {
    const requestedBookName = req.body.bookName;
  
    let deletedBook = null;
    let index = -1;
  
    books.forEach((book, i) => {
      if (book.bookName === requestedBookName) {
        deletedBook = books.splice(i, 1)[0];
        index = i;
      }
    });
  
    if (deletedBook) {
      deletedBooks.push(deletedBook);
    }
  
    res.redirect('/');
  });
  
  app.get('/', (req, res) => {
    res.render('home', {
      data: books,
      deletedBooks: deletedBooks
    });
  });
  


 app.get("/", function (req, res) {
    const deletedBooks = books.filter(book => book.isDeleted);
    res.render("home", {
      books: books.filter(book => !book.isDeleted),
      deletedBooks: deletedBooks
    });
  });
  
  
  app.post("/retrieve", function(req, res) {
    const bookName = req.body.bookName;
    const book = books.find(book => book.bookName === bookName);
  
    if (book) {
      book.isDeleted = false;
      res.redirect("/#book-" + encodeURIComponent(bookName));
    } else {
      res.send("Book not found.");
    }
  });
  
  
  

   
app.listen(7000,  (req,res) => {
    console.log("App is running on Port 7000")
})