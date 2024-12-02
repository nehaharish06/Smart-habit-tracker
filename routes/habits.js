const express = require('express');
const router = express.Router();

let habits = [];
let completions = {};

// Add a New Habit
router.post('/', (req, res, next) => {
    const { name, daily_goal } = req.body;
    if (!name || !daily_goal) {
        return next({ status: 400, message: 'Habit name and daily goal are required.' });
    }
    const newHabit = {
        id: habits.length + 1,
        name,
        daily_goal,
        created_at: new Date().toISOString(),
    };
    habits.push(newHabit);
    res.status(201).json({ status: 'success', data: newHabit });
});

// Get All Habits
router.get('/', (req, res) => {
    res.json({ status: 'success', data: habits });
});

// Mark a Habit as Complete for Today
router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const habit = habits.find((h) => h.id === parseInt(id));
    if (!habit) {
        return next({ status: 404, message: 'Habit not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (!completions[id]) completions[id] = new Set();
    completions[id].add(today);

    res.json({ status: 'success', data: { habit_id: id, date: today } });
});

// Weekly Progress Report
router.get('/report', (req, res) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const report = habits.map((habit) => {
        const completedDates = completions[habit.id] || new Set();
        const completionCount = Array.from(completedDates).filter((date) => {
            const dateObj = new Date(date);
            return dateObj >= sevenDaysAgo && dateObj <= today;
        }).length;

        return {
            name: habit.name,
            completion_count: completionCount,
        };
    });

    res.json({ status: 'success', data: report });
});

module.exports = router;
