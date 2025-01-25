# yarn-progress-tracker 🧶

A powerful Node.js package that provides real-time tracking of Yarn package installations with beautiful progress bars and advanced analytics.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 📊 Real-time download progress tracking with speed monitoring
- 📦 Package size analysis with dependency breakdown
- ⚡ Network speed detection and optimization
- 🔄 Smart installation time estimation
- 📈 Beautiful progress bars with detailed metrics
- 🎯 Installation stage tracking
- ⌛ Accurate time remaining estimation
- 🌐 Global and local installation support
- 💻 Cross-platform compatibility (Windows, macOS, Linux)

## 🚀 Installation

```bash
yarn global add yarn-progress-tracker
```

## Usage

Instead of using `yarn add`, simply use:

```bash
yarn-track <package-name> # Install a specific package
```
or
```bash
yarn-track # Install all packages in package.json
```

## Examples

1. Install a single package:
```bash
yarn-track express
```

2. Install multiple packages:
```bash
yarn-track express lodash moment
```

3. Install dev dependencies:
```bash
yarn-track -D typescript @types/node
```

4. Install packages globally:
```bash
yarn-track -g package-name
```

## 📊 Progress Information

The progress bar displays:

express [██████████░░░░░] 67% || Speed: 1.2MB/s || ETA: 00:30 || 5.2/10.5 MB

### Command Options

| Option | Description |
|--------|-------------|
| `-D, --dev` | Save packages as development dependencies |
| `-g, --global` | Install packages globally |

### Analysis Output

```
Package Size Analysis:
├─ Main Package: 2.5MB
├─ Dependencies: 15.8MB
└─ Total Size: 18.3MB

Estimated Installation Time: 0h 1m 30s
```

## 🛠 Technical Details

### Installation Stages
1. Package Analysis
   - Size calculation
   - Dependency tree analysis
   - Network speed detection

2. Download Progress
   - Real-time speed monitoring
   - Accurate size reporting
   - ETA calculation

3. Installation Progress
   - Package resolution
   - Dependency linking
   - Final installation

### Progress Tracking Features
- Automatic network speed detection
- Smart ETA calculation based on package size
- Detailed dependency analysis
- Cross-platform progress bar rendering

## 🔧 Development

To set up the project for development:

```bash
# Clone the repository
git clone https://github.com/yourusername/yarn-progress-tracker.git

# Navigate to project directory
cd yarn-progress-tracker

# Install dependencies
yarn install

# Build the project
yarn build

# Link for local development
yarn link

# Run in development mode
yarn dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT © [isaacobenzy]

## 💖 Support

If you find this package helpful, please consider:
- Giving it a star ⭐️
- Sharing it with others
- Contributing to its development

## 🔗 Related Projects

This project is inspired by the npm-progress-tracker and aims to provide similar functionality for Yarn users.

## 📦 Author

[isaacobenzy](https://github.com/isaacobenzy) - Initial work - [GitHub Profile](https://github.com/isaacobenzy) 