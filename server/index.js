const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User');
const employeeModel = require('./models/page');
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true
}));
app.use(cookieParser());

mongoose.connect('mongodb+srv://akhil03092002:2YtskbeToosCQqsp@cluster0.rntrqtz.mongodb.net/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB is connected'))
.catch(err => console.error('Error connecting to MongoDB', err));

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json("Token is missing");
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY || "default-secret-key", (err, user) => {
            if (err) {
                return res.status(403).json("Error with token");
            } else {
                if (user.role === "admin") {
                    next();
                } else {
                    return res.status(403).json("Not authorized");
                }
            }
        });
    }
};

app.get('/dashboard', verifyUser, (req, res) => {
    res.json("Success");
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
    .then(hash => {
        UserModel.create({ name, email, password: hash })
        .then(user => res.json("Success"))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(500).json(err));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (response) {
                    const token = jwt.sign({ email: user.email, role: user.role },
                        process.env.JWT_SECRET_KEY || "default-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token);
                    return res.json({ status: "Success", role: user.role });
                } else {
                    return res.status(401).json("Incorrect password");
                }
            });
        } else {
            return res.status(404).json("No record found");
        }
    });
});

app.get('/', (req, res) => {
    employeeModel.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

// app.get('/getUser/:id', (req, res) => {
//     const id = req.params.id;
//     employeeModel.findById(id)
//     .then(user => {
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json(user);
//     })
//     .catch(err => res.status(500).json(err));
// });

app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;
    employeeModel.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => res.status(500).json(err));
});


app.put('/updateUser/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, age } = req.body;
    employeeModel.findByIdAndUpdate(id, {
        name: name,
        email: email,
        age: age
    }, { new: true })
    .then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    })
    .catch(err => res.status(500).json(err));
});

app.delete('/deleteUser/:id', (req, res) => {
    const id = req.params.id;
    employeeModel.findByIdAndDelete(id)
    .then(deletedUser => {
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(deletedUser);
    })
    .catch(err => res.status(500).json(err));
});

app.post("/createUser", (req, res) => {
    const { name, email, age } = req.body;
    employeeModel.create({
        name: name,
        email: email,
        age: age
    })
    .then(newUser => res.json(newUser))
    .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
    console.log("Server is Running");
});
