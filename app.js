const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const Post = require("./models/Post");

const app = express();

app.set("view engine", "ejs");
// app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("DB CONNECTED");

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Listening to server`);
        })
    })
    .catch(error => {
        console.log("ERROR IN DB", error);
    })


app.get("/", async (req, res) => {
    var posts = await Post.find();
    res.render("home", { posts });
})


app.get("/blogpost", (req, res) => {
    res.render("blogpost");
})

app.post("/blogpost", (req, res) => {
    const title = req.body.title.trim();
    const content = req.body.content;


    if (title && content) {
        const data = {
            title, content
        }
        Post.create(data)
            .then(() => {
                console.log("Data Saved");
            })
            .catch(error => {
                console.log("Error in Saving data", error);
            });

        res.render("blogpost", { message: "Successfully Created" });
    } else {
        return res.render("blogpost", { errorMessage: "Please Provide everything" });
    }

})

app.get("/updatepost/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    res.render("update", { title: post.title, content: post.content });
});

app.post("/updatepost/:_id", async (req, res) => {
    const title = req.body.title.trim();
    const content = req.body.content;

    if (title && content) {
        const data = {
            title, content
        }
        Post.create(data)
            .then(() => {
                console.log("Updated Successully");
                const id = req.params._id;
                Post.findByIdAndDelete(id)
                    .then(() => {
                        console.log("Deleted successfully")
                    })
                    .catch(error => {
                        console.log("ERROR WHILE DELETING-->", error);
                    })
            })
            .catch(error => {
                console.log("Error in UPDATING data--->", error);
            });

        res.render("update", { message: "Successfully Updated" });
    } else {
        return res.render("update", { errorMessage: "Please Provide everything" });
    }
});

