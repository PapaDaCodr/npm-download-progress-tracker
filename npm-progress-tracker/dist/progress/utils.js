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
            format: colors_1.default.white('{packageName}') + ' |' +
                colors_1.default.green('{bar}') + '| ' +
                colors_1.default.green('{percentage}%') + ' || ' +
                colors_1.default.cyan('Speed: {speed}') + ' || ' +
                colors_1.default.yellow('ETA: {eta}') + ' || ' +
                colors_1.default.magenta('{downloaded}'),
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });
    }
    start() {
        this.bar.start(100, 0);
    }
    update(options) {
        const downloaded = (options.transferred && options.total) ?
            `${(options.transferred / (1024 * 1024)).toFixed(2)}/${(options.total / (1024 * 1024)).toFixed(2)} MB` : '';
        this.bar.update(options.progress, {
            packageName: options.packageName,
            speed: options.speed ? `${options.speed.toFixed(2)} MB/s` : 'N/A',
            eta: options.timeLeft ? `${Math.round(options.timeLeft)}s` : 'N/A',
            stage: options.stage || 'downloading',
            downloaded: downloaded
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
