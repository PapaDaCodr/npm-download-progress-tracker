import NpmProgressTracker from '../src';

const tracker = new NpmProgressTracker();

// Simulate a package download
console.log('Testing download tracking...');
tracker.trackDownload('test-package');

// Simulate download progress
let downloadedBytes = 0;
const totalBytes = 1024 * 1024 * 10; // 10MB
const interval = setInterval(() => {
    downloadedBytes += 512 * 1024; // Add 512KB each time
    
    if (downloadedBytes <= totalBytes) {
        tracker.updateProgress('download', {
            transferred: downloadedBytes,
            total: totalBytes,
            speed: 512, // 512KB/s
            eta: (totalBytes - downloadedBytes) / 512
        });
    } else {
        clearInterval(interval);
        
        // After download completes, test installation tracking
        console.log('\nTesting installation tracking...');
        tracker.trackInstallation('test-package');
        
        // Simulate installation progress
        let installProgress = 0;
        const installInterval = setInterval(() => {
            installProgress += 10;
            
            if (installProgress <= 100) {
                tracker.updateProgress('install', {
                    progress: installProgress,
                    stage: 'dependencies',
                    packageCount: 10,
                    completedCount: Math.floor(installProgress / 10)
                });
            } else {
                clearInterval(installInterval);
                tracker.finish();
                console.log('\nTest completed!');
            }
        }, 1000);
    }
}, 500); 