interface InstallationMetrics {
    packageName: string;
    size: number;
    installTime: number;
    networkSpeed: number;
}

export class InstallationEstimator {
    private metrics: InstallationMetrics[] = [];
    
    public addMetric(metric: InstallationMetrics): void {
        this.metrics.push(metric);
        if (this.metrics.length > 100) {
            this.metrics.shift();
        }
    }
    
    public estimateInstallTime(packageSize: number, currentNetworkSpeed: number): number {
        const baseDownloadTime = (packageSize / (currentNetworkSpeed || 1024 * 1024)) * 1000;
        const estimatedInstallTime = baseDownloadTime * 1.5;
        return Math.max(estimatedInstallTime, 5000);
    }
} 