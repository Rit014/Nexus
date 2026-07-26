const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/ai/suggest-tasks
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

// POST /api/ai/summarize-project
router.post('/summarize-project', protect, async (req, res) => {
  const { projectName, projectDescription, tasks } = req.body;

  if (!projectName) {
    return res.status(400).json({ msg: 'Project name is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    const taskSummary = tasks && tasks.length > 0
      ? tasks.map(t => `- ${t.title} (Status: ${t.status}, Priority: ${t.priority}${t.dueDate ? `, Due: ${new Date(t.dueDate).toLocaleDateString()}` : ''})`).join('\n')
      : 'No tasks yet';

    const completedCount = tasks?.filter(t => t.status === 'Done').length || 0;
    const totalCount = tasks?.length || 0;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const prompt = `You are a project management assistant.
Analyze the following project and provide a concise 3-sentence status summary.

Project Name: ${projectName}
Project Description: ${projectDescription || 'No description provided'}
Progress: ${completedCount}/${totalCount} tasks completed (${progressPercent}%)

Tasks:
${taskSummary}

Write exactly 3 sentences:
1. Overall project status and progress percentage
2. Most critical pending tasks or blockers
3. A recommendation or encouragement

Keep it professional, clear and actionable. Do not use bullet points or headers.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    res.status(200).json({
      summary,
      stats: {
        total: totalCount,
        completed: completedCount,
        inProgress: tasks?.filter(t => t.status === 'In Progress').length || 0,
        todo: tasks?.filter(t => t.status === 'To-Do').length || 0,
        progress: progressPercent,
      }
    });
  } catch (error) {
    console.error('AI summarize project error:', error.message);
    res.status(500).json({ msg: 'Failed to generate project summary' });
  }
});

module.exports = router;