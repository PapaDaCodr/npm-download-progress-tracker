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
        //last 100 installations for accuracy
        if (this.metrics.length > 100) {
            this.metrics.shift();
        }
    }
    
    public estimateInstallTime(packageSize: number, currentNetworkSpeed: number): number {
        // Base time calculation (in milliseconds)
        const baseDownloadTime = (packageSize / (currentNetworkSpeed || 1024 * 1024)) * 1000;
        
        // Added installation overhead (like 1.5x the download time)
        const estimatedInstallTime = baseDownloadTime * 1.5;
        
        // Minimum estimation of 5 seconds
        return Math.max(estimatedInstallTime, 5000);
    }
}