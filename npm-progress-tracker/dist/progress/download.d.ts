/// <reference types="node" />
import { EventEmitter } from 'events';
declare class DownloadTracker extends EventEmitter {
    private startTime;
    private downloadSize;
    private downloaded;
    private downloadSpeed;
    private lastMeasurement;
    private lastBytes;
    private isTracking;
    constructor();
    startTracking(totalSize: number): void;
    updateProgress(bytesReceived: number): void;
    private calculateETA;
    stopTracking(): void;
    getStatus(): {
        isTracking: boolean;
    };
}
export default DownloadTracker;
