# npm-progress-tracker

A powerful Node.js package that provides real-time tracking of npm package downloads and installations with detailed progress information.

## Features

- 📊 Real-time download progress tracking
- ⏱️ Download speed monitoring
- 🔄 Installation progress with stages
- ⌛ Time remaining estimation
- 📈 Green progress bar visualization
- 📦 Package size tracking

## Installation

```bash
npm install npm-progress-tracker
```

import { NpmProgressTracker } from 'npm-progress-tracker';

const tracker = new NpmProgressTracker();

// Track package download
tracker.trackDownload('your-package-name');

// Track package installation
tracker.trackInstallation('your-package-name');

// The progress bar shows:
// package-name [===========] 45% || Speed: 1.2MB/s || ETA: 30s || 5.2/10.5 MB