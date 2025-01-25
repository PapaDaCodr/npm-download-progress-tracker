#!/usr/bin/env node
import { spawn } from 'child_process';
import { Command } from 'commander';
import NpmProgressTracker from './index';
import colors from 'colors';
import path from 'path';
import https from 'https';

const program = new Command();
const tracker = new NpmProgressTracker();

function trackPackageDownload(packageName: string) {
  return new Promise<void>((resolve) => {
    const url = `https://registry.npmjs.org/${packageName}`;
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
        // Force 100% progress on completion
        tracker.updateProgress('download', {
          transferred: contentLength,
          total: contentLength,
          speed: 0,
          eta: 0
        });
        setTimeout(resolve, 500); // Give time for the progress bar to update
      });

      response.on('error', () => {
        tracker.finish();
        resolve();
      });
    });
  });
}
program
  .name('npm-track')
  .description('Track npm installations with beautiful progress bars')
  .argument('[packages...]', 'packages to install')
  .option('-D, --save-dev', 'Save package to your development dependencies')
  .option('-g, --global', 'Install packages globally')
  .action(async (packages, options) => {
    const args = ['install'];
    
if (packages.length > 0) {
  args.push(...packages);
  
  // Track download progress for each package
  for (const pkg of packages) {
    await tracker.preInstallAnalysis(pkg);
    await trackPackageDownload(pkg);
  }
}
    
    if (options.saveDev) {
      args.push('--save-dev');
    }
    
    if (options.global) {
      args.push('-g');
    }

    console.log(colors.cyan('\n📦 Starting installation...'));
    
    const npmPath = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const npm = spawn(npmPath, args, { 
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });
    
    let packageName = packages.join(', ') || 'dependencies';
    tracker.trackInstallation(packageName);

    let installProgress = 0;
npm.stdout.on('data', (data) => {
  const output = data.toString();
  
  // More granular progress tracking
  if (output.includes('added')) {
    const addedMatch = output.match(/(\d+)\s+packages/);
    if (addedMatch) {
      const packagesAdded = parseInt(addedMatch[1], 10);
      const totalExpectedPackages = packages.length || 1;
      installProgress = Math.min(100, (packagesAdded / totalExpectedPackages) * 100);
    } else {
      installProgress = Math.min(100, installProgress + 10);
    }
  } else if (output.includes('packages are looking for funding')) {
    installProgress = 95;
  } else if (output.includes('found') || output.includes('audited')) {
    installProgress = 100;
  }

  tracker.updateProgress('install', {
    progress: installProgress,
    stage: 'dependencies',
    packageCount: packages.length || 1,
    completedCount: Math.ceil(installProgress / 100 * (packages.length || 1))
  });
});

    npm.stderr.on('data', (data) => {
      console.error(colors.yellow(`Warning: ${data}`));
    });

    npm.on('error', (error) => {
      console.error(colors.red(`Error: ${error.message}`));
      process.exit(1);
    });

    npm.on('close', (code) => {
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
