# npm-progress-tracker 📦

A powerful Node.js package that provides real-time tracking of npm package installations with beautiful progress bars and advanced analytics.

[![npm version](https://badge.fury.io/js/npm-progress-tracker.svg)](https://www.npmjs.com/package/npm-progress-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 📊 Real-time download progress tracking with speed monitoring
- 📦 Package size analysis with dependency breakdown
- ⚡ Network speed detection and optimization
- 🔄 Smart installation time estimation based on historical data
- 📈 Beautiful progress bars with detailed metrics
- 🎯 Installation stage tracking (download, dependencies, peer deps)
- ⌛ Accurate time remaining estimation
- 🔍 Package cache detection
- 🌐 Global and local installation support
- 💻 Cross-platform compatibility (Windows, macOS, Linux)

## 🚀 Installation

```bash
npm install -g npm-progress-tracker
```

## Usage

Instead of using `npm install`, simply use:

```bash
npm-track <package-name> #Install a specific package
```
or
```bash
npm-track #Install all packages in package.json
```

or

```bash
npm-track -g #Install all packages in package.json globally
```

## Examples

1. Install a single package:

```bash
npm-track express
```

2. Install multiple packages:
```bash
npm-track express lodash moment
```

3. Install dev dependencies:
```bash
npm-track -D typescript @types/node
```

4. Install all dependencies from package.json:
```bash
npm-track
```

## 📊 Progress Information

The progress bar displays:

express [██████████░░░░░] 67% || Speed: 1.2MB/s || ETA: 00:30 || 5.2/10.5 MB


### Command Options

| Option | Description |
|--------|-------------|
| `-D, --save-dev` | Save packages as development dependencies |
| `-g, --global` | Install packages globally |
| `--verbose` | Show detailed progress information |



### Analysis Output

Package Size Analysis:
├─ Main Package: 2.5MB
├─ Dependencies: 15.8MB
└─ Total Size: 18.3MB

Estimated Installation Time: 0h 1m 30s

## 🛠 Technical Details

### Network Speed Detection
The package automatically detects your network speed for accurate download time estimation.

### Installation Analytics
Tracks and learns from previous installations to provide more accurate time estimates.

### Progress Tracking Stages
1. Package Analysis
2. Download Progress
3. Installation Progress
4. Dependency Resolution
5. Final Installation

## 🤝 Contributing
I was inspired by [npm-progress-bar](https://github.com/npm/npm-progress-bar) and [npm-progress-bar](https://github.com/npm/npm-progress-bar) 
and wanted to create a more accurate and informative package. 
so I created this package, I hope you find it useful.
The yarn version is out now 
isaacobenzy is the author of the yarn version.
Contributions are welcome! Please check our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

MIT © [MIT]

## 💖 Support

If you find this package helpful, please consider giving it a star ⭐️
