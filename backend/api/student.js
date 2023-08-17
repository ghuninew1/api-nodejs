const Student = require("../models/Student");

module.exports = app => {
  app.post('/api/student', async (req, res) => {
    const payload = req.body;
    const student = new Student(payload);
    try {
      await student.save();
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.get('/api/student', async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.get('/api/student/:id', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.put('/api/student/:id', async (req, res) => {
    try {
      const payload = req.body;
      const student = await Student.findByIdAndUpdate(req.params.id, payload, {
        new: true
      });
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  app.delete('/api/student/:id', async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
};