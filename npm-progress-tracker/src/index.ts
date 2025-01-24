import { EventEmitter } from 'events';
import { ProgressBar } from './progress/utils';
import { DownloadStats, InstallStats } from './types';



class NpmProgressTracker extends EventEmitter {
  private startTime: number;
  private progressBar: ProgressBar;
  private isTracking: boolean;
  private currentProgress: number = 0;

  constructor() {
    super();
    this.startTime = Date.now();
    this.progressBar = new ProgressBar();
    this.isTracking = false;
  }

  public trackDownload(packageName: string): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.progressBar.start();

    this.on('download-progress', (stats: DownloadStats) => {
      const progress = (stats.transferred / stats.total) * 100;
      
      this.progressBar.update({
        progress,
        packageName,
        speed: stats.speed,
        timeLeft: stats.eta
      });

      if (progress === 100) {
        this.emit('download-complete', {
          packageName,
          totalTime: Date.now() - this.startTime
        });
      }
    });
  }

  public trackInstallation(packageName: string): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.progressBar.start();

    this.on('install-progress', (stats: InstallStats) => {
      this.progressBar.update({
        progress: stats.progress,
        packageName,
        stage: stats.stage,
        elapsedTime: Date.now() - this.startTime
      });

      if (stats.progress === 100) {
        this.emit('install-complete', {
          packageName,
          totalTime: Date.now() - this.startTime
        });
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
  }

  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }
}

export default NpmProgressTracker;
export * from './types';
export * from './types';