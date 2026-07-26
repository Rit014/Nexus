const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/suggest-tasks', protect, async (req, res) => {
  const { projectName, projectDescription } = req.body;

  if (!projectName) {
    return res.status(400).json({ msg: 'Project name is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    const prompt = `You are a project management assistant.
Based on the following project, suggest 6 practical and specific tasks.

Project Name: ${projectName}
Project Description: ${projectDescription || 'No description provided'}

Return ONLY a valid JSON array of tasks in this exact format, no extra text, no markdown, no backticks:
[
  {
    "title": "Task title here",
    "description": "Brief task description here",
    "priority": "High",
    "status": "To-Do"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const tasks = JSON.parse(cleaned);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('AI suggest tasks error:', error.message);
    res.status(500).json({ msg: 'Failed to generate task suggestions' });
  }
});

module.exports = router;