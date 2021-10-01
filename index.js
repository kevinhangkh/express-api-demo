const express = require('express');
const Joi = require('joi');
const app = express();

//Needed to parse JSON POST request body
app.use(express.json());

const courses = [
    {id: 1, name: 'Introduction to Probabilities'},
    {id: 2, name: 'Watercolor painting'},
    {id: 3, name: 'Yoga and breathing'},
    {id: 4, name: 'Harmonica basics'},
]

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course)
        res.status(404).send(`The course with the given id ${id} was not found!`);

    res.send(course);
})

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body); // result.error
    if (error)
        return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    //Find the course
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course)
        return res.status(404).send(`The course with the given id ${id} was not found!`);

    //Validate
    const { error } = validateCourse(req.body); // result.error
    if (error)
        return res.status(400).send(error.details[0].message);

    //Update and send updated course
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    //Find the course
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course)
        return res.status(404).send(`The course with the given id ${id} was not found!`);

    //Remove course from array
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    console.log(courses);

    res.send(course);
})

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course);
}