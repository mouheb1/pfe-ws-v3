const Robot = require('../models/entity/Robot');
const User = require('../models/entity/User');

exports.SignIn = async (req, res) => {
    // Vérifier si l'utilisateur existe déjà avec le même nom, email, numéro de robot ou numéro de téléphone
    try {
        const existingUser = await User.findOne({
            $and: [
                { email: req.body.email },
                { password: req.body.password }
            ]
        });

        // Si l'utilisateur existe déjà, renvoyer une erreur
        if (!existingUser) {
            return res.status(400).json({ message: "Verifier si l'email ou bien password bien saisie!" });
        }
        res.status(200).json(existingUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.SignUp = async (req, res) => {
    // Vérifier si l'utilisateur existe déjà avec le même  email
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email }
            ]
        });

        // Si l'utilisateur existe déjà, renvoyer une erreur
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà avec ces informations." });
        }

        // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
        const user = new User({ nom: req.body.nom, prenom: req.body.prenom, password: req.body.password, email: req.body.email, role: req.body.role });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Récupérer tous les utilisateurs
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query?.page || 1);
        const limit = parseInt(req.query?.limit || 10);
        let filter = {}

        if (req.query) {
            filter = {
                ...req.query
            }
        }

        let pipeline = [];
        if (filter.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            pipeline.push({
                $or: [
                    { 'email': searchRegex },
                    { 'nom': searchRegex },
                    { 'prenom': searchRegex },
                    { 'role': searchRegex },
                ]
            });
        }

        // Pagination
        const skip = (page - 1) * limit;
        const totalDocuments = await User.countDocuments(pipeline.length > 0 ? { $and: pipeline } : {});
        const totalPages = Math.ceil(totalDocuments / limit);
        pipeline.push({ $skip: skip }, { $limit: limit });

        const users = await User.aggregate(pipeline);
        res.json({
            users,
            totalPages,
            currentPage: page,
            limit
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    // Vérifier si l'utilisateur existe déjà avec le même nom, email, numéro de robot ou numéro de téléphone
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email }
            ]
        });

        // Si l'utilisateur existe déjà, renvoyer une erreur
        if (existingUser) {
            return res.status(400).json({ message: " Email existe  " });
        }

        // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
            // Ajoutez d'autres propriétés de l'utilisateur ici selon votre schéma
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Mettre à jour un utilisateur par son ID

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.send(updatedUser);
    } catch (error) {
        console.error('Error:', error); // Log toute erreur
        res.status(400).send(error);
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Extracting the 'id' parameter from the request parameters
        console.log(id, "id of user ");

        // Checking if the 'id' parameter is provided
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        // Finding the user by ID
        const user = await User.findByIdAndDelete(id);

        // If user doesn't exist, return a 404 response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sending a success response
        res.json({ message: "User deleted" });
    } catch (error) {
        // Handling errors
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};