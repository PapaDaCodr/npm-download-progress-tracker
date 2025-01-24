import DownloadTracker from '../progress/download';
import { InstallTracker } from '../progress/install';
import { ProgressBar } from '../progress/utils';

describe('DownloadTracker', () => {
    let downloadTracker: DownloadTracker;
    const mockFileSize = 1024 * 1024; // 1MB

    beforeEach(() => {
        downloadTracker = new DownloadTracker();
    });

    test('should initialize download tracking', () => {
        downloadTracker.startTracking(mockFileSize);
        expect(downloadTracker.getStatus().isTracking).toBe(true);
    });

    test('should calculate download speed correctly', (done) => {
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
        setTimeout(() => {
            downloadTracker.updateProgress(bytesReceived);
        }, 1000);
    }, 10000);
});

describe('InstallTracker', () => {
    let installTracker: InstallTracker;
    const totalSteps = 5;

    beforeEach(() => {
        installTracker = new InstallTracker(totalSteps);
    });

    test('should track installation progress', () => {
        installTracker.beginInstall();
        installTracker.updateProgress(2);
        expect(installTracker['currentStep']).toBe(2);
    });

    test('should complete installation', () => {
        const spy = jest.spyOn(console, 'log');
        installTracker.beginInstall();
        installTracker.updateProgress(totalSteps);
        installTracker.endInstall();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Installation completed'));
    });
});

describe('ProgressBar', () => {
    let progressBar: ProgressBar;

    beforeEach(() => {
        progressBar = new ProgressBar();
    });

    test('should update progress bar', () => {
        const mockOptions = {
            progress: 50,
            packageName: 'test-package',
            speed: 1.5,
            timeLeft: 30,
            transferred: 512 * 1024,
            total: 1024 * 1024
        };

        progressBar.start();
        expect(() => progressBar.update(mockOptions)).not.toThrow();
        progressBar.complete();
    });
});