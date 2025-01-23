import cliProgress from 'cli-progress';
import colors from 'colors';
import { ProgressOptions } from '../types';

export class ProgressBar {
    private bar: cliProgress.SingleBar;

    constructor() {
        this.bar = new cliProgress.SingleBar({
            format: '{packageName} |' + colors.cyan('{bar}') + '| {percentage}% || Speed: {speed} || ETA: {eta}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591'
        });
    }

    public start(): void {
        this.bar.start(100, 0);
    }

    public update(options: ProgressOptions): void {
        this.bar.update(options.progress, {
            packageName: options.packageName,
            speed: options.speed ? `${options.speed.toFixed(2)} MB/s` : 'N/A',
            eta: options.timeLeft ? `${Math.round(options.timeLeft)}s` : 'N/A',
            stage: options.stage || 'downloading'
        });
    }

    public complete(): void {
        this.bar.stop();
    }
}

export function formatTime(milliseconds: number): string {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    
    return `${hours}h ${minutes}m ${seconds}s`;
}

export function calculateSpeed(bytes: number, milliseconds: number): string {
    const speedInBytesPerSecond = bytes / (milliseconds / 1000);
    const speedInKbps = speedInBytesPerSecond / 1024;
    return `${speedInKbps.toFixed(2)} KB/s`;
}

