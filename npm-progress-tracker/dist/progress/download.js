"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class DownloadTracker extends events_1.EventEmitter {
    constructor() {
        super();
        this.isTracking = false;
        this.startTime = 0;
        this.downloadSize = 0;
        this.downloaded = 0;
        this.downloadSpeed = 0;
        this.lastMeasurement = 0;
        this.lastBytes = 0;
    }
    startTracking(totalSize) {
        this.isTracking = true;
        this.startTime = Date.now();
        this.lastMeasurement = this.startTime;
        this.downloadSize = totalSize;
        this.downloaded = 0;
        console.log("Download tracking started...");
    }
    updateProgress(bytesReceived) {
        this.downloaded = bytesReceived;
        const now = Date.now();
        const timeDiff = now - this.lastMeasurement;
        // Update speed every second
        if (timeDiff >= 1000) {
            const bytesDiff = this.downloaded - this.lastBytes;
            this.downloadSpeed = (bytesDiff / timeDiff) * 1000 / (1024 * 1024); // MB/s
            this.lastMeasurement = now;
            this.lastBytes = this.downloaded;
            const stats = {
                transferred: this.downloaded,
                total: this.downloadSize,
                speed: this.downloadSpeed,
                eta: this.calculateETA()
            };
            this.emit('progress', stats);
        }
    }
    calculateETA() {
        if (this.downloadSpeed === 0)
            return 0;
        const remaining = this.downloadSize - this.downloaded;
        return remaining / (this.downloadSpeed * 1024 * 1024);
    }
    stopTracking() {
        const totalTime = (Date.now() - this.startTime) / 1000;
        const averageSpeed = (this.downloaded / totalTime) / (1024 * 1024);
        console.log(`Download completed:
            Total size: ${(this.downloadSize / (1024 * 1024)).toFixed(2)} MB
            Time: ${totalTime.toFixed(2)}s
            Average speed: ${averageSpeed.toFixed(2)} MB/s`);
        this.emit('complete', {
            totalSize: this.downloadSize,
            totalTime,
            averageSpeed
        });
        this.isTracking = false;
    }
    getStatus() {
        return { isTracking: this.isTracking };
    }
}
exports.default = DownloadTracker;
