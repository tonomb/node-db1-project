const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/accounts", (req, res) => {
  // can pass in limit, sortby and sortdir parameters 
  console.log(req.body);
  if(req.body.limit){
    db.select("*")
      .from("accounts")
      .orderBy(req.body.sortby || 'id', req.body.sortdir)
      .limit(req.body.limit)
      .then((accounts) => {
        res.status(200).json({ accounts });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
      });
  } else {
    db.select("*")
      .from("accounts")
      .then((accounts) => {
        res.status(200).json({ accounts });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
      });
  }

});

server.get("/accounts/:id", (req, res) => {
  db.select("*")
    .from("accounts")
    .where("id", req.params.id)
    .then((account) => {
      res.status(200).json(account);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    });
});

server.post("/accounts", (req, res) => {
  db.insert(req.body)
    .into("accounts")
    .then((id) => {
      //returns id of las created
      if (id) {
        res.status(201).json({ id });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.errno === 19) {
        res.status(400).json({ message: "please include a name and budget" });
      } else {
        res.status(500).json({ message: "something went wrong" });
      }
    });
});

server.put("/accounts/:id", (req, res) => {
  db("accounts")
    .where("id", req.params.id)
    .update(req.body)
    .then((count) => {
      if (count) {
        res.status(200).json({ updated: count });
      } else {
        res.status(400).json({ message: "something went wrong" });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
});

server.delete("/accounts/:id", (req, res) => {
  db("accounts")
    .where('id', req.params.id)
    .del()
    .then((count) => {
      if (count) {
        res.status(200).json({ deleted: count });
      } else {
        res.status(400).json({ message: "something went wrong" });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
});

module.exports = server;
