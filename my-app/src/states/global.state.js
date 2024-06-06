
const pathLogin = "/login";
const ADMIN = "Admin";
const USER = "Utilisateur";
export const state = { 
    wsClient : null , 
    dataColumns : [{name: "vide",totalPiecesPalatize: 0}],
    listRobots : [],
    path : {
             list : [
                {role : ADMIN ,  authPath : "/Dashboard"},
                {role : ADMIN ,  authPath : "/ListUsers"},
                {role : ADMIN ,  authPath :"/ListRobot"},
                {role : ADMIN ,  authPath :"/HistoriquePage"},
                {role : ADMIN ,  authPath :"/Statistiques"},
                {role : USER ,  authPath :"/Statistiques"}
            ],
             logIn : pathLogin 
            },
    user : { role : {admin : ADMIN , utilisateur : ADMIN}}
};