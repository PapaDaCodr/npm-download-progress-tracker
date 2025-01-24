# npm-progress-tracker

A powerful Node.js package that provides real-time tracking of npm package installations with beautiful progress bars.

## Features

- 📊 Real-time download progress tracking
- ⏱️ Download speed monitoring
- 🔄 Installation progress with stages
- ⌛ Time remaining estimation
- 📈 Green progress bar visualization
- 📦 Package size tracking

## Installation

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

Common options:
- `-D` or `--save-dev`: Save packages as dev dependencies
- `-g` or `--global`: Install packages globally

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

// The progress bar shows:
// package-name [===========] 45% || Speed: 1.2MB/s || ETA: 30s || 5.2/10.5 MB