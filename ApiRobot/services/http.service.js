const express = require('express');
const cors = require('cors');
const userController = require('../controllers/UserController');
const robotController = require('../controllers/RobotController');
const historyController = require('../controllers/HistoryController');
const globalController = require('../controllers/GlobalController');
const { envirement } = require('../configures/global.configure');


const app = express();

app.use(express.json());
app.use(cors());


// Routes pour manipuler les utilisateurs
app.post('/sign-in', userController.SignIn);
app.post('/sign-up', userController.SignUp);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);
app.post('/users', userController.createUser);
app.patch('/users/:id', userController.updateUser);
app.patch('/users', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Routes pour manipuler les robots
app.get('/robots', robotController.getRobots);
app.get('/robots/:id', robotController.getRobotById);
app.post('/robots', robotController.createRobot);
app.patch('/robots/:id', robotController.updateRobot);
app.delete('/robots/:id', robotController.deleteRobot);


app.get('/history', historyController.getAllHistory);

app.get('/global', globalController.getAllLengthCollections);
app.get('/robot-stats', globalController.getrobotStats);


app.post('/api/export-pdf', globalController.createStatsPdf)


app.listen(envirement.http.port, envirement.http.hostname, () => {
    console.log(`Server HTTP is running on ws://${envirement.http.hostname}:${envirement.http.port}`);
});
