# MCQ Quiz Application

A modern, responsive MCQ (Multiple Choice Question) quiz application built with React, Tailwind CSS, and React Router.

## Features

- **Interactive Quiz Interface**: Clean, modern UI with smooth transitions
- **Real-time Feedback**: Immediate feedback for correct/incorrect answers
- **Progress Tracking**: Visual progress indicators and navigation
- **Detailed Explanations**: Comprehensive feedback with short notes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Summary Page**: Complete performance overview with insights

## Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Create React App** - Build tool and development server

## Quick Start

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Quiz header with progress
│   │   ├── AnswerOption.js    # Individual answer option component
│   │   └── Navigation.js      # Navigation buttons and progress dots
│   ├── pages/
│   │   ├── QuestionsPage.js   # Main quiz question page
│   │   ├── CorrectAnswerPage.js # Correct answer feedback
│   │   ├── IncorrectAnswerPage.js # Incorrect answer feedback
│   │   └── SummaryPage.js     # Final results and performance overview
│   ├── App.js                 # Main app component with routing
│   ├── index.js               # React entry point
│   └── index.css              # Global styles and Tailwind imports
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Customization Guide

### Adding/Modifying Questions

Edit the `quizData` array in `src/App.js`:

```javascript
const quizData = [
  {
    id: 1,
    question: "Your question here?",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correctAnswer: 1, // Index of correct answer (0-based)
    explanation: "Detailed explanation of the correct answer.",
    shortNotes: [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ]
  },
  // Add more questions...
];
```

### Styling Customization

The application uses Tailwind CSS classes. You can customize:

1. **Colors**: Modify color classes in components (e.g., `bg-blue-600`, `text-green-500`)
2. **Spacing**: Adjust padding/margin classes (e.g., `p-6`, `mb-8`)
3. **Typography**: Change font sizes and weights (e.g., `text-2xl`, `font-semibold`)

### Adding New Features

1. **New Question Types**: Extend the `AnswerOption` component
2. **Additional Feedback**: Modify the feedback sections in correct/incorrect pages
3. **Custom Navigation**: Update the `Navigation` component
4. **Enhanced Summary**: Extend the `SummaryPage` with new metrics

## Routing Structure

- `/` - Main questions page
- `/correct` - Correct answer feedback page
- `/incorrect` - Incorrect answer feedback page  
- `/summary` - Final results and performance overview

## State Management

The app uses React's built-in state management:

- `currentQuestionIndex` - Tracks current question
- `selectedAnswer` - User's selected answer
- `isAnswerCorrect` - Whether the answer is correct
- `quizResults` - Array of all quiz results
- `showFeedback` - Controls feedback display

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Single column layout
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Full-width layout with maximum constraints

## Performance Optimizations

- Lazy loading of components
- Efficient state updates
- Optimized re-renders
- Smooth transitions and animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
