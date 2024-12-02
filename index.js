const express = require('express');
const app = express();
const port = 3000;

// Body parser middleware
app.use(express.json());

// Define some sample routes for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Smart Habit Tracker API');
});

// Include your routes for habits
const habitRoutes = require('./routes/habits'); // Ensure you have a file with this route setup
app.use('/habits', habitRoutes);  // Attach the habit routes under the /habits endpoint

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
