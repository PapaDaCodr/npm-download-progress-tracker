export interface ProgressData {
    downloadSpeed: number;
    downloadTime: number;
    installationTime: number;
    progress: number;
}
export interface TrackerOptions {
    verbose?: boolean;
    onProgress?: (data: ProgressData) => void;
}
export interface DownloadStats {
    transferred: number;
    total: number;
    speed: number;
    eta: number;
}
export interface InstallStats {
    progress: number;
    stage: 'dependencies' | 'devDependencies' | 'peerDependencies';
    packageCount: number;
    completedCount: number;
}
export interface ProgressOptions {
    progress: number;
    packageName: string;
    speed?: number;
    timeLeft?: number;
    stage?: string;
    elapsedTime?: number;
}
