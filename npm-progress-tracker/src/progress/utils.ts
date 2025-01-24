import cliProgress from 'cli-progress';
import colors from 'colors';
import { ProgressOptions } from '../types';

export class ProgressBar {
    private bar: cliProgress.SingleBar;

    constructor() {
        this.bar = new cliProgress.SingleBar({
            format: colors.white('{packageName}') + ' |' + 
                   colors.green('{bar}') + '| ' + 
                   colors.green('{percentage}%') + ' || ' +
                   colors.cyan('Speed: {speed}') + ' || ' +
                   colors.yellow('ETA: {eta}') + ' || ' +
                   colors.magenta('{downloaded}'),
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });
    }

    public start(): void {
        this.bar.start(100, 0);
    }

    public update(options: ProgressOptions): void {
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

