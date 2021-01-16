const express = require('express');
const router = express.Router()
const User = require('../models/user')
const amqp = require('amqplib');
const dotenv = require('dotenv');
const { registerValidation } = require("../validation/validation");


router.post('/setUser',async (req,res)=>{
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const userExisted = await User.findOne({ email: req.body.email });
  if (userExisted) return res.send("User already registered");
  const saveUser = new User({
      name:req.body.name,
      email:req.body.email
  })
  saveUser.save()
  .then((dataObj)=>{
      var theID = dataObj._id;
      amqp.connect(process.env.AMQP_CONN)
      .then((connection)=>{
        connection.createChannel()
        .then((channel)=>{
          var queue = 'task_queue';
          var message = String(theID);
          channel.assertQueue(queue);
          channel.sendToQueue(queue, Buffer.from(message));
        })
        .catch((error)=>{
          console.log(error);
        })
      })
      .catch((error)=>{
        console.log(error);
      }) 
        res.json(dataObj);
})
  .catch(error=>{
      res.json(error)
  })
})


router.get('/getUser/:id',(req,res)=>{
  User.findOne({_id:req.params.id})
  .then((result)=>{
      res.json(result)
  })
  .catch((err)=>{
      res.json(err);
  })
})

module.exports = router;