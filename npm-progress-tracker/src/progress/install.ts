export class InstallTracker {
    private startTime: number = 0;
    private totalSteps: number;
    private currentStep: number;

    constructor(totalSteps: number) {
        this.totalSteps = totalSteps;
        this.currentStep = 0;
    }

    public beginInstall() {
        this.startTime = Date.now();
        console.log('Installation started...');
    }

    public endInstall() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        console.log(`Installation completed in ${this.formatTime(duration)}.`);
    }

    public updateProgress(step: number) {
        this.currentStep += step;
        const progress = (this.currentStep / this.totalSteps) * 100;
        console.log(`Installation progress: ${progress.toFixed(2)}%`);
    }

    private formatTime(duration: number): string {
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        return `${minutes}m ${seconds}s`;
    }
}