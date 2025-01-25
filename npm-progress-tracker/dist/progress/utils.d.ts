import { ProgressOptions } from '../types';
export declare class ProgressBar {
    private bar;
    constructor();
    start(): void;
    update(options: ProgressOptions): void;
    complete(): void;
}
export declare function formatTime(milliseconds: number): string;
export declare function calculateSpeed(bytes: number, milliseconds: number): string;
export declare function formatETA(seconds: number): string;
