var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles')

// GET all roles (not deleted)
router.get('/', async function (req, res, next) {
  try {
    let data = await roleSchema.find({})
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

// GET role by id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findOne(
      { _id: req.params.id, isDeleted: false }
    );
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

// CREATE new role
router.post('/', async function (req, res, next) {
  try {
    let newRole = new roleSchema({
      name: req.body.name,
      description: req.body.description
    })
    await newRole.save()
    res.status(201).send(newRole);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
})

// UPDATE role
router.put('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(req.params.id,
      req.body, {
      new: true
    })
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

// SOFT DELETE role
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(req.params.id,
      { isDeleted: true }, {
      new: true
    })
    if (result) {
      res.status(200).send({
        message: "Role deleted successfully",
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

module.exports = router;
