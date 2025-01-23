# README.md for npm-progress-tracker

# npm-progress-tracker

A package to track the download speed, time, and progress of npm package installations.

## Installation

To install the package, run:

```
npm install npm-progress-tracker
```

## Usage

### Importing the Package

```typescript
import { DownloadTracker, InstallTracker } from 'npm-progress-tracker';
```

### Download Tracking

To track the download speed and time of npm packages:

```typescript
const downloadTracker = new DownloadTracker();
downloadTracker.startTracking();

// After download is complete
downloadTracker.stopTracking();
```

### Installation Tracking

To track the installation time and progress of npm packages:

```typescript
const installTracker = new InstallTracker();
installTracker.beginInstall();

// After installation is complete
installTracker.endInstall();
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.