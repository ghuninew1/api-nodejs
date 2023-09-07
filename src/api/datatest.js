const Datatest = require('./models/Datatest');

module.exports = app => {
  app.post('/api/datatest', async (req, res) => {
    const payload = req.body;
    const datatest = new Datatest(payload);
    try {
      await datatest.save();
      res.status(201).json(datatest);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.get('/api/datatest', async (req, res) => {
    try {
      const datatest = await Datatest.find();
      res.status(200).json(datatest);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.get('/api/datatest/:id', async (req, res) => {
    try {
      const datatest = await Datatest.findById(req.params.id);
      res.status(200).json(datatest);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.put('/api/datatest/:id', async (req, res) => {
    try {
      const payload = req.body;
      const datatest = await Datatest.findByIdAndUpdate(req.params.id, payload, {
        new: true
      });
      res.status(200).json(datatest);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.delete('/api/datatest/:id', async (req, res) => {
    try {
      const datatest = await Datatest.findByIdAndDelete(req.params.id);
      res.status(200).json(datatest);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
};