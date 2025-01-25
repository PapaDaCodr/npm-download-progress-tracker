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
                   colors.yellow('Time remaining: {eta}') + ' || ' +
                   colors.magenta('{downloaded}'),
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true,
            fps: 10 // Limit update frequency
        });
    }

    public start(): void {
        this.bar.start(100, 0);
    }

    public update(options: ProgressOptions): void {
        const downloaded = (options.transferred && options.total) ? 
            `${(options.transferred / (1024 * 1024)).toFixed(2)}/${(options.total / (1024 * 1024)).toFixed(2)} MB` : '';

        const formattedSpeed = options.speed 
            ? `${options.speed.toFixed(2)} MB/s`
            : 'N/A';

        const formattedETA = options.timeLeft 
            ? formatETA(options.timeLeft)
            : 'N/A';

        this.bar.update(options.progress, {
            packageName: options.packageName,
            speed: formattedSpeed,
            eta: formattedETA,
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

export function formatETA(seconds: number): string {
    if (!seconds || !isFinite(seconds)) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

