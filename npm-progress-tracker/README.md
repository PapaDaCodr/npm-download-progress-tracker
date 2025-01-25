
For more details, see the [full documentation](https://github.com/PapaDaCodr/npm-progress-tracker).



# npm-progress-tracker & yarn-progress-tracker 📦

Beautiful progress bars and real-time analytics for npm and yarn package installations.

[![npm version](https://badge.fury.io/js/npm-progress-tracker.svg)](https://www.npmjs.com/package/npm-progress-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📊 Real-time download progress with speed monitoring
- 📦 Package size analysis and dependency breakdown
- ⚡ Smart installation time estimation
- 🌐 Global and local installation support
- 💻 Cross-platform (Windows, macOS, Linux)

## Install

```sh
# For npm users
npm install -g npm-progress-tracker

# For yarn users
yarn global add yarn-progress-tracker
```

## Usage

Replace your package manager's install command:

```sh
# NPM
npm-track <package-name>

# Yarn
yarn-track <package-name>
```

### Examples

```sh
# Install single package
npm-track express    # or yarn-track express

# Install multiple packages
npm-track lodash moment    # or yarn-track lodash moment

# Install dev dependencies
npm-track -D typescript    # or yarn-track -D typescript

# Install from package.json
npm-track               # or yarn-track
```

### Options

| Option | Description |
|--------|-------------|
| `-D, --save-dev` | Save as dev dependency |
| `-g, --global` | Install globally |
| `--verbose` | Show detailed progress (npm only) |

## Progress Display

```
express [██████████░░░░░] 67% || Speed: 1.2MB/s || ETA: 00:30 || 5.2/10.5 MB

Package Size Analysis:
├─ Main Package: 2.5MB
├─ Dependencies: 15.8MB
└─ Total Size: 18.3MB
```

## License

MIT © [isaacobenzy](https://github.com/isaacobenzy) [OseiAnsah](https://github.com/papadacodr) [OwusuKenneth](https://github.com/Owusu1946)

For more details, visit:
- 

npm-progress-tracker


- 

yarn-progress-tracker