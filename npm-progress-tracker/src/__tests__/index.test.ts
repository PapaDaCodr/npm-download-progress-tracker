import DownloadTracker from '../progress/download';
import { InstallTracker } from '../progress/install';

describe('DownloadTracker', () => {
    let downloadTracker: DownloadTracker;
    const mockFileSize = 1024 * 1024; // 1MB

    beforeEach(() => {
        downloadTracker = new DownloadTracker();
    });

    test('should start tracking download', () => {
        downloadTracker.startTracking(mockFileSize);
        expect(downloadTracker.getStatus().isTracking).toBe(true);
    });

    test('should stop tracking download', () => {
        downloadTracker.startTracking(mockFileSize);
        downloadTracker.stopTracking();
        expect(downloadTracker.getStatus().isTracking).toBe(false);
    });

    test('should calculate download speed', (done) => {
        jest.setTimeout(10000); // Increase timeout to 10 seconds
        const bytesReceived = 512 * 1024; // 512KB
        
        downloadTracker.on('progress', (stats) => {
            try {
                expect(stats.speed).toBeGreaterThanOrEqual(0);
                expect(stats.transferred).toBe(bytesReceived);
                expect(stats.total).toBe(mockFileSize);
                done();
            } catch (error) {
                done(error);
            }
        });

        downloadTracker.startTracking(mockFileSize);
        // Simulate progress after a short delay
        setTimeout(() => {
            downloadTracker.updateProgress(bytesReceived);
        }, 1000);
    }, 10000); // Add timeout here as well

    test('should emit complete event', (done) => {
        downloadTracker.on('complete', (stats) => {
            expect(stats.totalSize).toBe(mockFileSize);
            expect(stats.totalTime).toBeGreaterThan(0);
            expect(stats.averageSpeed).toBeGreaterThanOrEqual(0);
            done();
        });

        downloadTracker.startTracking(mockFileSize);
        downloadTracker.updateProgress(mockFileSize);
        downloadTracker.stopTracking();
    });
});