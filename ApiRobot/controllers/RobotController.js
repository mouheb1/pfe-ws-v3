const Robot = require('../models/entity/Robot');
const History = require('../models/entity/History');
const { historyService } = require('../services/history.service');
const { ObjectId } = require('mongodb');
// recuperer les  données depuis mongo DB
exports.getRobots = async (req, res) => {
    try {
        const page = parseInt(req.query?.page || 1);
        const limit = parseInt(req.query?.limit || 10);
        let filter = {}

        if (req.query) {
            filter = {
                ...req.query
            }
        }
        const pipeline = []

        // Agregé les données stockées depuis MongoDB
        pipeline.push(
            {
                $lookup: { // Joindre les données depuis utilisateurs
                    from: 'users',
                    localField: 'userId', // Créer une clé étrangère
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true // Ajouter robot (modal), nom, prénom, email sous forme de tableau
                }
            },
            {
                $lookup: {
                    from: 'histories',
                    localField: '_id',
                    foreignField: 'robotId',
                    as: 'histories'
                }
            },
            {
                $addFields: {
                    totalPiecesPalatize: { // Calculer la somme des pièces palatisée de chaque robot et les ajouter dans historique
                        $sum: {
                            $map: {
                                input: "$histories",
                                as: "history",
                                in: { $toInt: "$$history.palatizedPieces" }
                            }
                        }
                    }
                }
            },
            {
                $project: { // Projection des données 
                    "reference": 1,
                    "ip_robot": 1,
                    "totalPieces": 1,
                    "totalPiecesPalatize": { $ifNull: ["$totalPiecesPalatize", 0] },
                    "user._id": 1,
                    "user.nom": 1,
                    "user.prenom": 1,
                    "user.email": 1,
                    "user.password": 1,
                    "user.role": 1
                }
            }
        );

        // Search filter
        if (filter.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            pipeline.push({
                $match: {
                    $or: [
                        { 'reference': searchRegex },
                        { 'ip_robot': searchRegex },
                        { 'user.nom': searchRegex },
                        { 'user.prenom': searchRegex },
                        { 'user.email': searchRegex }
                    ]
                }
            });
        }

        // Pagination
        const skip = (page - 1) * limit;
        const totalDocuments = await Robot.countDocuments(pipeline.length > 0 ? { $and: pipeline.map(stage => stage.$match || {}) } : {});
        const totalPages = Math.ceil(totalDocuments / limit);
        pipeline.push({ $skip: skip }, { $limit: limit });

        const robots = await Robot.aggregate(pipeline);

        res.json({
            robots,
            totalPages,
            currentPage: page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un robot par son ID
exports.getRobotById = async (req, res) => {
    try {
        const robot = await Robot.findById(req.params.id);
        if (robot) {
            res.json(robot);
        } else {
            res.status(404).json({ message: "Robot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRobot = async (req, res) => {
    try {
        const existingRobot = await Robot.findOne({ reference: req.body.reference });

        if (existingRobot) {
            return res.status(400).json({ message: "Un autre robot existe déjà avec cette référence." });
        }

        const robot = new Robot({
            _id: new ObjectId(),
            reference: req.body.reference,
            userId: req.body.userId,
            ip_robot: req.body.ip_robot,
            totalPieces: req.body.totalPieces
        });
        const newRobot = await robot.save();

        res.status(201).json(newRobot);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Une erreur s'est produite lors de la création du robot." });
    }
};

// Mettre à jour un robot par son ID
exports.updateRobot = async (req, res) => {
    try {
        const existingRobot = await Robot.findOne({ _id: req.params.id });
        if (!existingRobot) {
            return res.status(404).json({ message: "Le robot spécifié n'existe pas." });
        }
        // Mettre à jour les champs du robot selon les données fournies dans la requête
        if (existingRobot.reference) { existingRobot.reference = req.body.reference; }

        existingRobot.userId = req.body.userId;
        existingRobot.ip_robot = req.body.ip_robot;
        existingRobot.totalPieces = req.body.totalPieces;

        const updatedRobot = await existingRobot.save();

        const history = await History.findOne({ robotId: existingRobot._id })
        history.totalPieces = req.body.totalPieces
        await history.save()

        return res.status(200).json(updatedRobot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un robot par son ID
exports.deleteRobot = async (req, res) => {
    try {
        const result = await Robot.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            historyService.deleteMany(req.params.id);
            res.json({ message: "Robot deleted" });
        } else {
            res.status(404).json({ message: "Robot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

