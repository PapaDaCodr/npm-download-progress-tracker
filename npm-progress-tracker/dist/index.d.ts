/// <reference types="node" />
import { EventEmitter } from 'events';
import { DownloadStats, InstallStats } from './types';
declare class NpmProgressTracker extends EventEmitter {
    private startTime;
    private progressBar;
    private isTracking;
    private currentProgress;
    private estimator;
    private analysisBar;
    constructor();
    trackDownload(packageName: string): void;
    trackInstallation(packageName: string): void;
    getCurrentProgress(): number;
    updateProgress(type: 'download' | 'install', stats: DownloadStats | InstallStats): void;
    finish(): void;
    private formatTime;
    private formatBytes;
    preInstallAnalysis(packageName: string): Promise<void>;
}
export default NpmProgressTracker;
export * from './types';
export * from './types';
