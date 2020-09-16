var express = require('express');
var signService = require('../services/sign');

const signup = (req, res, next) => {
  const { id, password } = req.body;
  if (id !== 'string') {
    next();
  }

  res.json({ uid });
};

module.exports = { signup };
