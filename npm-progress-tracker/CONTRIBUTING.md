# Contributing to npm-progress-tracker 🤝

Thank you for your interest in contributing to npm-progress-tracker! This document provides guidelines and steps for contributing.

## Development Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/PapaDaCodr/npm-progress-tracker.git
cd npm-progress-tracker
```

2. Install dependencies using npm-track:
```bash
npm install -g npm-progress-tracker  # Install npm-track globally first
npm-track                           # Install project dependencies
```

3. Build the project:
```bash
npm run build
```

## Project Structure

- `/src` - Main source code
  - `/analysis` - Package analysis utilities
  - `/progress` - Progress tracking and estimation
  - `/types` - TypeScript interfaces
  - `cli.ts` - Command-line interface
  - `index.ts` - Main tracker class

## Testing

1. Run the test suite:
```bash
npm-track -D # Install dev dependencies first
npm test
```

2. Test the CLI locally:
```bash
npm run build
node dist/cli.js express
```

## Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Follow the coding style:
   - Use TypeScript for all new files
   - Maintain type safety
   - Add JSDoc comments for public methods
   - Follow existing code formatting

3. Update tests when adding new features

## Progress Bar Customization

When adding new progress bar features:

1. Update the ProgressOptions interface in `types/index.ts`
2. Implement the feature in `progress/utils.ts`
3. Add corresponding methods in the main NpmProgressTracker class

## Submitting Changes

1. Commit your changes:
```bash
git add .
git commit -m "feat: description of your changes"
```

2. Push to your fork:
```bash
git push origin feature/your-feature-name
```

3. Create a Pull Request

## Pull Request Guidelines

- Provide a clear description of the changes
- Include any relevant issue numbers
- Ensure all tests pass
- Update documentation if needed
- Add examples for new features

## Code Style Guide

- Use meaningful variable names
- Keep functions focused and small
- Add comments for complex logic
- Use TypeScript features appropriately
- Follow existing error handling patterns

## Documentation

When adding new features, update:
- README.md for user-facing changes
- JSDoc comments for API changes
- Example files if applicable

## Need Help?

- Open an issue for bugs
- Start a discussion for feature requests
- Ask questions in the issues section

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
