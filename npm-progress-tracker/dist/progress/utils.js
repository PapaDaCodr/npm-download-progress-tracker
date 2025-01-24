"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSpeed = exports.formatTime = exports.ProgressBar = void 0;
const cli_progress_1 = __importDefault(require("cli-progress"));
const colors_1 = __importDefault(require("colors"));
class ProgressBar {
    constructor() {
        this.bar = new cli_progress_1.default.SingleBar({
            format: '{packageName} |' + colors_1.default.cyan('{bar}') + '| {percentage}% || Speed: {speed} || ETA: {eta}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591'
        });
    }
    start() {
        this.bar.start(100, 0);
    }
    update(options) {
        this.bar.update(options.progress, {
            packageName: options.packageName,
            speed: options.speed ? `${options.speed.toFixed(2)} MB/s` : 'N/A',
            eta: options.timeLeft ? `${Math.round(options.timeLeft)}s` : 'N/A',
            stage: options.stage || 'downloading'
        });
    }
    complete() {
        this.bar.stop();
    }
}
exports.ProgressBar = ProgressBar;
function formatTime(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}
exports.formatTime = formatTime;
function calculateSpeed(bytes, milliseconds) {
    const speedInBytesPerSecond = bytes / (milliseconds / 1000);
    const speedInKbps = speedInBytesPerSecond / 1024;
    return `${speedInKbps.toFixed(2)} KB/s`;
}
exports.calculateSpeed = calculateSpeed;
