const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB ERROR : ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get list of players array

const convertCricketTeam = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
  };
};

app.get("/players/", async (request, response) => {
  const a = `
    SELECT * FROM cricket_team
    `;
  const b = await db.all(a);

  response.send(b.map((i) => convertCricketTeam(i)));
});
//post player
app.post("/players/", async (request, response) => {
  const details = request.body;
  const { playerName, jerseyNumber, role } = details;
  const api2 = `
    INSERT INTO cricketTeam(player_name,jersey_number,role)
    VALUES
    ('${playerName}' ,
     ${jerseyNumber} ,
     '${role}')
    `;
  const db3 = await db.run(api2);
  response.send("Player Added to Team");
});
// get each player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const api3 = `
    SELECT * FROM cricketTeam 
    where player_id=${playerId}
    
    `;
  const db2 = await db.get(api3);
  response.send(convertCricketTeam(db2));
});
//put player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const details = request.body;
  const { playerName, jerseyNumber, role } = details;
  const api4 = `
    UPDATE 
      cricket_team
    SET
    player_name=${playerName}
    jersey_number=${jerseyNumber}
    role=${role}
Where player_id=${playerId}
    `;
  await db.run(api4);
  response.send("Player Details Update");
});

//delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const api5 = `
    DELETE 
    * 
    FROM cricket_team 
    where player_id=${playerId}
    
    `;
  await db.run(api5);
  response.send("Player Removed");
});
module.exports = app;
