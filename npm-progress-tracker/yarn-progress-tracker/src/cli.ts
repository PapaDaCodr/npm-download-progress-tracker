#!/usr/bin/env node
import { spawn } from 'child_process';
import { Command } from 'commander';
import YarnProgressTracker from './index';
import colors from 'colors';
import https from 'https';

const program = new Command();
const tracker = new YarnProgressTracker();

function trackPackageDownload(packageName: string) {
    return new Promise<void>((resolve) => {
        const url = `https://registry.yarnpkg.com/${packageName}`;
        https.get(url, (response) => {
            const contentLength = parseInt(response.headers['content-length'] || '0', 10);
            let downloadedBytes = 0;
            let lastTime = Date.now();

            tracker.trackDownload(packageName);

            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const currentTime = Date.now();
                const timeDiff = currentTime - lastTime;
                
                const speed = timeDiff > 0 
                    ? ((chunk.length / 1024 / 1024) / (timeDiff / 1000))
                    : 0;

                const remainingBytes = contentLength - downloadedBytes;
                const eta = speed > 0 ? remainingBytes / (speed * 1024 * 1024) : 0;

                tracker.updateProgress('download', {
                    transferred: downloadedBytes,
                    total: contentLength,
                    speed: speed,
                    eta: eta
                });

                lastTime = currentTime;
            });

            response.on('end', () => {
                tracker.updateProgress('download', {
                    transferred: contentLength,
                    total: contentLength,
                    speed: 0,
                    eta: 0
                });
                setTimeout(resolve, 500);
            });
        });
    });
}

program
    .name('yarn-track')
    .description('Track yarn installations with beautiful progress bars')
    .argument('[packages...]', 'packages to install')
    .option('-D, --dev', 'Save package to your development dependencies')
    .option('-g, --global', 'Install packages globally')
    .action(async (packages, options) => {
        const args = ['add'];
        
        if (packages.length > 0) {
            args.push(...packages);
            
            for (const pkg of packages) {
                await tracker.preInstallAnalysis(pkg);
                await trackPackageDownload(pkg);
            }
        }
        
        if (options.dev) {
            args.push('--dev');
        }
        
        if (options.global) {
            args.unshift('global');
        }

        console.log(colors.cyan('\n📦 Starting installation...'));
        
        const yarnPath = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
        const yarn = spawn(yarnPath, args, { 
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: true
        });
        
        let packageName = packages.join(', ') || 'dependencies';
        tracker.trackInstallation(packageName);

        let installProgress = 0;
        yarn.stdout.on('data', (data) => {
            const output = data.toString();
            
            if (output.includes('Resolving packages')) {
                installProgress = 25;
            } else if (output.includes('Fetching packages')) {
                installProgress = 50;
            } else if (output.includes('Linking dependencies')) {
                installProgress = 75;
            } else if (output.includes('Done')) {
                installProgress = 100;
            }

            tracker.updateProgress('install', {
                progress: installProgress,
                stage: 'dependencies',
                packageCount: packages.length || 1,
                completedCount: Math.ceil(installProgress / 100 * (packages.length || 1))
            });
        });

        yarn.stderr.on('data', (data) => {
            console.error(colors.yellow(`Warning: ${data}`));
        });

        yarn.on('error', (error) => {
            console.error(colors.red(`Error: ${error.message}`));
            process.exit(1);
        });

        yarn.on('close', (code) => {
            tracker.finish();
            if (code === 0) {
                console.log(colors.green('\n✨ Installation completed successfully!'));
            } else {
                console.log(colors.red('\n❌ Installation failed'));
                process.exit(1);
            }
        });
    });

program.parse(); 