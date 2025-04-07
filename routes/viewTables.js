// routes/viewTables.js
const express = require('express');
const router = express.Router();

router.get('/create', (req, res) => {
    res.render('tables/create', { title: 'Create Table', user: req.user });
});

module.exports = router;
