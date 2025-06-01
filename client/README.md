# User Directory Frontend

A responsive React application that displays and manages user data from an external API, built with modern web technologies.

## Features

- **Modern UI**: Clean, responsive design with a table-like layout
- **User Details**: Modal view for detailed user information
- **Data Management**: Client-side user deletion
- **Interactive Components**: User-friendly interactions and animations
- **Responsive Design**: Optimized for all screen sizes

## Tech Stack

- **React 19** with TypeScript
- **CSS Modules** for styling
- **React Query** for data fetching and caching
- **Vitest & Testing Library** for testing
- **Vite** for fast development and building

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd client
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Testing

Run the tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
client/
├── src/
│   ├── api/               # API services
│   ├── components/        # UI components
│   │   ├── Modal/         # Modal component
│   │   ├── UserDetail/    # User detail component
│   │   └── UserList/      # User list component
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
└── tests/                 # Test files
```

## Design Decisions

- **Component Structure**: Components are organized by feature with their own styles and tests
- **CSS Modules**: Scoped styling to prevent conflicts
- **React Query**: Efficient data fetching with caching
- **TypeScript**: Type safety throughout the application
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Accessibility**: ARIA attributes and keyboard navigation

## Development Rules

- All components should have associated test files
- CSS follows BEM-like naming in modules
- TypeScript types should be defined for all data structures
- Components should be as reusable as possible
- Accessibility considerations in all UI elements

## License

This project is licensed under the MIT License.
