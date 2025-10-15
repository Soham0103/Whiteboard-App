const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js')
const canvasRouter = express.Router();
const {createCanvas,loadCanvas,getUserCanvases,updateCanvas,deleteCanvas,shareCanvas, unshareCanvas} = require('../controllers/canvasController.js');



canvasRouter.post('/create',authMiddleware,createCanvas);
canvasRouter.get('/load/:id',authMiddleware,loadCanvas);
canvasRouter.put('/update',authMiddleware,updateCanvas);
canvasRouter.put('/share/:id',authMiddleware,shareCanvas);
canvasRouter.put('/unshare/:id',authMiddleware,unshareCanvas);
canvasRouter.delete('/delete/:id',authMiddleware,deleteCanvas);
canvasRouter.get('/list',authMiddleware,getUserCanvases);

module.exports = canvasRouter;

