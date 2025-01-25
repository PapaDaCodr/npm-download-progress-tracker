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
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${packageName}`;
    https.get(url, (response) => {
      const contentLength = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedBytes = 0;

      tracker.trackDownload(packageName);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        tracker.updateProgress('download', {
          transferred: downloadedBytes,
          total: contentLength,
          speed: chunk.length, // Simplified speed calculation
          eta: (contentLength - downloadedBytes) / chunk.length
        });
      });

      response.on('end', () => {
        resolve(true);
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
      if (output.includes('added') || output.includes('packages')) {
        installProgress = Math.min(100, installProgress + 5);
        tracker.updateProgress('install', {
          progress: installProgress,
          stage: 'dependencies',
          packageCount: packages.length || 1,
          completedCount: Math.floor(installProgress / 10)
        });
      }
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
