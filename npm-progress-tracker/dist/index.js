"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("./progress/utils");
const time_estimation_1 = require("./progress/time-estimation");
const package_size_1 = require("./analysis/package-size");
const colors_1 = __importDefault(require("colors"));
const cli_progress_1 = __importDefault(require("cli-progress"));
class NpmProgressTracker extends events_1.EventEmitter {
    constructor() {
        super();
        this.currentProgress = 0;
        this.startTime = Date.now();
        this.progressBar = new utils_1.ProgressBar();
        this.isTracking = false;
        this.estimator = new time_estimation_1.InstallationEstimator();
        // Initialize analysis progress bar
        this.analysisBar = new cli_progress_1.default.SingleBar({
            format: colors_1.default.cyan('Analyzing {packageName} ') +
                colors_1.default.green('{bar}') +
                colors_1.default.cyan(' {percentage}%'),
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true
        });
    }
    trackDownload(packageName) {
        if (this.isTracking)
            return;
        this.isTracking = true;
        this.progressBar.start();
        this.currentProgress = 0;
        // Remove any existing listeners to prevent duplicates
        this.removeAllListeners('download-progress');
        this.removeAllListeners('download-complete');
        this.on('download-progress', (stats) => {
            const progress = stats.total > 0
                ? Math.min((stats.transferred / stats.total) * 100, 100)
                : 0;
            this.currentProgress = progress;
            this.progressBar.update({
                progress,
                packageName,
                speed: stats.speed,
                timeLeft: stats.eta,
                transferred: stats.transferred,
                total: stats.total
            });
            if (progress >= 100) {
                this.emit('download-complete', {
                    packageName,
                    totalTime: Date.now() - this.startTime
                });
                this.finish();
            }
        });
    }
    trackInstallation(packageName) {
        if (this.isTracking)
            return;
        this.isTracking = true;
        this.progressBar.start();
        this.currentProgress = 0;
        // Remove any existing listeners to prevent duplicates
        this.removeAllListeners('install-progress');
        this.removeAllListeners('install-complete');
        this.on('install-progress', (stats) => {
            this.currentProgress = stats.progress;
            this.progressBar.update({
                progress: stats.progress,
                packageName,
                stage: stats.stage,
                elapsedTime: Date.now() - this.startTime,
                packageCount: stats.packageCount,
                completedCount: stats.completedCount,
                // Add default values for required properties
                speed: undefined,
                timeLeft: undefined
            });
            if (stats.progress >= 100) {
                this.emit('install-complete', {
                    packageName,
                    totalTime: Date.now() - this.startTime
                });
                this.finish();
            }
        });
    }
    getCurrentProgress() {
        return this.currentProgress;
    }
    updateProgress(type, stats) {
        if ('progress' in stats) {
            this.currentProgress = stats.progress;
        }
        this.emit(`${type}-progress`, stats);
    }
    finish() {
        this.progressBar.complete();
        this.removeAllListeners();
        this.isTracking = false;
        this.currentProgress = 0;
    }
    formatTime(milliseconds) {
        return (0, utils_1.formatTime)(milliseconds);
    }
    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0)
            return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
    async preInstallAnalysis(packageName) {
        try {
            this.analysisBar.start(100, 0, { packageName });
            this.analysisBar.update(30, { packageName });
            const sizeInfo = await (0, package_size_1.analyzePackageSize)(packageName);
            this.analysisBar.update(60, { packageName });
            const totalSize = sizeInfo.size +
                Object.values(sizeInfo.dependencies).reduce((a, b) => a + b, 0);
            this.analysisBar.update(100, { packageName });
            this.analysisBar.stop();
            // Display results
            console.log(colors_1.default.white('\nPackage Size Analysis:'));
            console.log(colors_1.default.green(`├─ Main Package: ${this.formatBytes(sizeInfo.size)}`));
            console.log(colors_1.default.green(`├─ Dependencies: ${this.formatBytes(Object.values(sizeInfo.dependencies).reduce((a, b) => a + b, 0))}`));
            console.log(colors_1.default.green(`└─ Total Size: ${this.formatBytes(totalSize)}`));
            // Use a realistic network speed (1MB/s as default)
            const networkSpeed = 1024 * 1024; // 1MB/s
            const estimatedTime = this.estimator.estimateInstallTime(totalSize, networkSpeed);
            // Only show estimation if it's meaningful
            if (estimatedTime > 0) {
                console.log(colors_1.default.yellow(`\nEstimated Installation Time: ${this.formatTime(estimatedTime)}`));
            }
        }
        catch (error) {
            this.analysisBar.stop();
            console.log(colors_1.default.yellow('\nUnable to analyze package size. Continuing with installation...'));
        }
    }
}
exports.default = NpmProgressTracker;
__exportStar(require("./types"), exports);
__exportStar(require("./types"), exports);
