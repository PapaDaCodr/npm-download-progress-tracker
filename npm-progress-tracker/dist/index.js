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
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("./progress/utils");
class NpmProgressTracker extends events_1.EventEmitter {
    constructor() {
        super();
        this.currentProgress = 0;
        this.startTime = Date.now();
        this.progressBar = new utils_1.ProgressBar();
        this.isTracking = false;
    }
    trackDownload(packageName) {
        if (this.isTracking)
            return;
        this.isTracking = true;
        this.progressBar.start();
        this.on('download-progress', (stats) => {
            const progress = (stats.transferred / stats.total) * 100;
            this.progressBar.update({
                progress,
                packageName,
                speed: stats.speed,
                timeLeft: stats.eta
            });
            if (progress === 100) {
                this.emit('download-complete', {
                    packageName,
                    totalTime: Date.now() - this.startTime
                });
            }
        });
    }
    trackInstallation(packageName) {
        if (this.isTracking)
            return;
        this.isTracking = true;
        this.progressBar.start();
        this.on('install-progress', (stats) => {
            this.progressBar.update({
                progress: stats.progress,
                packageName,
                stage: stats.stage,
                elapsedTime: Date.now() - this.startTime
            });
            if (stats.progress === 100) {
                this.emit('install-complete', {
                    packageName,
                    totalTime: Date.now() - this.startTime
                });
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
    }
    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0)
            return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
}
exports.default = NpmProgressTracker;
__exportStar(require("./types"), exports);
__exportStar(require("./types"), exports);
