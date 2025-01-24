"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallTracker = void 0;
class InstallTracker {
    constructor(totalSteps) {
        this.startTime = 0;
        this.totalSteps = totalSteps;
        this.currentStep = 0;
    }
    beginInstall() {
        this.startTime = Date.now();
        console.log('Installation started...');
    }
    endInstall() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        console.log(`Installation completed in ${this.formatTime(duration)}.`);
    }
    updateProgress(step) {
        this.currentStep += step;
        const progress = (this.currentStep / this.totalSteps) * 100;
        console.log(`Installation progress: ${progress.toFixed(2)}%`);
    }
    formatTime(duration) {
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        return `${minutes}m ${seconds}s`;
    }
}
exports.InstallTracker = InstallTracker;
