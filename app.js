const Joi = require('joi');
const express = require('express');
const fs = require('fs');
const { title } = require('process');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/movies', (req, res) =>{
    //let movies = JSON.stringify(JSON.parse(fs.readFileSync('movies.json')));
    let movies = getDirectory();
    //res.send(movies);
    movies.then(movieDirectory =>{
        res.send(JSON.stringify(movieDirectory));
    }).catch(movieError =>{
        console.log(movieError);
        res.send("There was a problem");
    });
});

app.post('/api/movies', (req, res)=>{
    const { error } = validateMovie(req.body);

    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    let movies = getDirectory();

    movies.then(movieDirectory =>{
        const newMovie = {
            "id": movieDirectory.movies.length,
            "title": req.body.title,
            "releaseDate": req.body.releaseDate,
            "director": req.body.releaseDate,
            "producer": req.body.producer
        };
        movieDirectory.movies.push(newMovie);
        console.log(newMovie);
        fs.writeFileSync('movies.json', JSON.stringify(movieDirectory, null, 2));
        res.send(newMovie);
    }).catch(movieError =>{
        console.log(movieError);
        res.send("There was an issue with the post");
    });
});

app.listen(port, () =>{
    console.log(`Listening on port ${port}`);
});

function getDirectory()
{
    let promiseForMovies = new Promise((resolve, reject) =>{
        try{
            let movies = JSON.parse(fs.readFileSync('movies.json'));
            resolve(movies);
        }
        catch(error)
        {
            reject(error);
        }
    });
    
    return promiseForMovies;
}

function validateMovie(course)
{
    //Invalid entry handling
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        releaseDate: Joi.string().min(1).required(),
        director: Joi.string().min(1).required(),
        producer: Joi.string().min(1).required()
    });
    return schema.validate(course);
}