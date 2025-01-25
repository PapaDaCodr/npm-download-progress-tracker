import { EventEmitter } from 'events';
import { ProgressBar, formatTime, formatETA } from './progress/utils';
import { DownloadStats, InstallStats } from './types';
import { InstallationEstimator } from './progress/time-estimation';
import { analyzePackageSize } from './analysis/package-size';
import colors from 'colors';
import cliProgress from 'cli-progress';

class NpmProgressTracker extends EventEmitter {
  private startTime: number;
  private progressBar: ProgressBar;
  private isTracking: boolean;
  private currentProgress: number = 0;
  private estimator: InstallationEstimator;
  private analysisBar: cliProgress.SingleBar;

  constructor() {
    super();
    this.startTime = Date.now();
    this.progressBar = new ProgressBar();
    this.isTracking = false;
    this.estimator = new InstallationEstimator();
    
    // Initialize analysis progress bar
    this.analysisBar = new cliProgress.SingleBar({
      format: colors.cyan('Analyzing {packageName} ') + 
              colors.green('{bar}') + 
              colors.cyan(' {percentage}%'),
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true
    });
  }

  public trackDownload(packageName: string): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.progressBar.start();
    this.currentProgress = 0;

    // Remove any existing listeners to prevent duplicates
    this.removeAllListeners('download-progress');
    this.removeAllListeners('download-complete');

    this.on('download-progress', (stats: DownloadStats) => {
      const progress = stats.total > 0 
        ? Math.min((stats.transferred / stats.total) * 100, 100)
        : 0;
      
      this.currentProgress = progress;
      this.progressBar.update({
        progress,
        packageName,
        speed: stats.speed,
        timeLeft: stats.eta,
        transferred: stats.transferred,
        total: stats.total
      });

      if (progress >= 100) {
        this.emit('download-complete', {
          packageName,
          totalTime: Date.now() - this.startTime
        });
        this.finish();
      }
    });
  }

  public trackInstallation(packageName: string): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.progressBar.start();
    this.currentProgress = 0;
    this.removeAllListeners('install-progress');
    this.removeAllListeners('install-complete');

    this.on('install-progress', (stats: InstallStats) => {
      this.currentProgress = stats.progress;
      this.progressBar.update({
        progress: stats.progress,
        packageName,
        stage: stats.stage,
        elapsedTime: Date.now() - this.startTime,
        packageCount: stats.packageCount,
        completedCount: stats.completedCount,
        speed: undefined,
        timeLeft: undefined
      });

      if (stats.progress >= 100) {
        this.emit('install-complete', {
          packageName,
          totalTime: Date.now() - this.startTime
        });
        this.finish();
      }
    });
  }

  public getCurrentProgress(): number {
    return this.currentProgress;
  }

  public updateProgress(type: 'download' | 'install', stats: DownloadStats | InstallStats): void {
    if ('progress' in stats) {
      this.currentProgress = stats.progress;
    }
    this.emit(`${type}-progress`, stats);
  }

  public finish(): void {
    this.progressBar.complete();
    this.removeAllListeners();
    this.isTracking = false;
    this.currentProgress = 0;
  }

  private formatTime(milliseconds: number): string {
    return formatTime(milliseconds);
  }

  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  public async preInstallAnalysis(packageName: string): Promise<void> {
    try {
        this.analysisBar.start(100, 0, { packageName });
        
        this.analysisBar.update(30, { packageName });
        const sizeInfo = await analyzePackageSize(packageName);
        
        this.analysisBar.update(60, { packageName });
        const totalSize = sizeInfo.size + 
            Object.values(sizeInfo.dependencies).reduce((a, b) => a + b, 0);
        
        this.analysisBar.update(100, { packageName });
        this.analysisBar.stop();

        // Display results
        console.log(colors.white('\nPackage Size Analysis:'));
        console.log(colors.green(`├─ Main Package: ${this.formatBytes(sizeInfo.size)}`));
        console.log(colors.green(`├─ Dependencies: ${this.formatBytes(
            Object.values(sizeInfo.dependencies).reduce((a, b) => a + b, 0)
        )}`));
        console.log(colors.green(`└─ Total Size: ${this.formatBytes(totalSize)}`));
        
        // Using a realistic network speed (1MB/s as default)
        const networkSpeed = 1024 * 1024; // 1MB/s
        const estimatedTime = this.estimator.estimateInstallTime(totalSize, networkSpeed);
        
        // Only show estimation if it's meaningful
        if (estimatedTime > 0) {
            console.log(colors.yellow(`\nEstimated Installation Time: ${
                this.formatTime(estimatedTime)
            }`));
        }
    } catch (error) {
        this.analysisBar.stop();
        console.log(colors.yellow('\nUnable to analyze package size. Continuing with installation...'));
    }
  }
}

export default NpmProgressTracker;
export * from './types';
export * from './types';