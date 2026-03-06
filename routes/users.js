var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users')

// GET all users (not deleted)
router.get('/', async function (req, res, next) {
  try {
    let data = await userSchema.find({}).populate({ path: 'role', select: 'name description' })
    let result = data.filter(function (e) {
      return (!e.isDeleted)
    })
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne(
      { _id: req.params.id, isDeleted: false }
    ).populate({ path: 'role', select: 'name description' });
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// CREATE new user
router.post('/', async function (req, res, next) {
  try {
    let newUser = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      role: req.body.roleId
    })
    await newUser.save()
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
})

// UPDATE user
router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      req.body, {
      new: true
    }).populate({ path: 'role', select: 'name description' })
    if (result && !result.isDeleted) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

// SOFT DELETE user
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      { isDeleted: true }, {
      new: true
    })
    if (result) {
      res.status(200).send({
        message: "User deleted successfully",
        data: result
      })
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

// ENABLE user (set status to true)
router.post('/enable', async function (req, res, next) {
  try {
    let email = req.body.email;
    let username = req.body.username;

    let user = await userSchema.findOne({
      email: email,
      username: username,
      isDeleted: false
    })

    if (user) {
      user.status = true;
      await user.save();
      res.status(200).send({
        message: "User enabled successfully",
        data: user
      })
    } else {
      res.status(404).send({
        message: "User not found with provided email and username"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
})

// DISABLE user (set status to false)
router.post('/disable', async function (req, res, next) {
  try {
    let email = req.body.email;
    let username = req.body.username;

    let user = await userSchema.findOne({
      email: email,
      username: username,
      isDeleted: false
    })

    if (user) {
      user.status = false;
      await user.save();
      res.status(200).send({
        message: "User disabled successfully",
        data: user
      })
    } else {
      res.status(404).send({
        message: "User not found with provided email and username"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
})

module.exports = router;
