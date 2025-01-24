export declare class InstallTracker {
    private startTime;
    private totalSteps;
    private currentStep;
    constructor(totalSteps: number);
    beginInstall(): void;
    endInstall(): void;
    updateProgress(step: number): void;
    private formatTime;
}
