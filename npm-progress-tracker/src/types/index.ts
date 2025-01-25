export interface ProgressData {
    downloadSpeed: number; // in bytes per second
    downloadTime: number; // in milliseconds
    installationTime: number; // in milliseconds
    progress: number; // percentage of completion
}

export interface TrackerOptions {
    verbose?: boolean; // whether to log detailed progress information
    onProgress?: (data: ProgressData) => void; // callback function for progress updates
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
    transferred?: number;
    total?: number;
    packageCount?: number;
    completedCount?: number;
}