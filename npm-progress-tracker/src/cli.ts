#!/usr/bin/env node
import { spawn } from 'child_process';
import { Command } from 'commander';
import NpmProgressTracker from './index';
import colors from 'colors';

const program = new Command();
const tracker = new NpmProgressTracker();

program
  .name('npm-track')
  .description('Track npm installations with a beautiful progress bar')
  .argument('[packages...]', 'packages to install')
  .option('-D, --save-dev', 'Save package to your development dependencies')
  .option('-g, --global', 'Install packages globally')
  .action((packages, options) => {
    const args = ['install'];
    
    if (packages.length > 0) {
      args.push(...packages);
    }
    
    if (options.saveDev) {
      args.push('--save-dev');
    }
    
    if (options.global) {
      args.push('-g');
    }

    console.log(colors.cyan('📦 Starting installation with progress tracking...'));
    
    const npm = spawn('npm', args, { stdio: ['inherit', 'pipe', 'pipe'] });
    
    let packageName = packages.join(', ') || 'dependencies';
    tracker.trackInstallation(packageName);

    npm.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('added')) {
        const progress = Math.min(100, tracker.getCurrentProgress() + 10);
        tracker.updateProgress('install', {
          progress,
          stage: 'dependencies',
          packageCount: packages.length || 1,
          completedCount: Math.floor(progress / 10)
        });
      }
    });

    npm.on('close', (code) => {
      tracker.finish();
      if (code === 0) {
        console.log(colors.green('\n✨ Installation completed successfully!'));
      } else {
        console.log(colors.red('\n❌ Installation failed'));
      }
    });
  });

program.parse();
