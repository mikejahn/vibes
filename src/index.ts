#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface Task {
  name: string;
  command: string;
  available_variables: string[];
  prompt: string;
  how_to_use: string;
}

const program = new Command();

// Read the tasks from the JSON file
function readTasks(): Task[] {
  try {
    const vibesFolder = path.join(process.cwd(), 'vibes');
    if (!fs.existsSync(vibesFolder)) {
      console.error('Error: vibes folder not found in the current directory');
      console.error('\nTo fix this:');
      console.error('1. Create a folder named "vibes" in your project root');
      console.error('2. Create a tasks.json file inside the vibes folder');
      console.error('3. Add your task definitions to tasks.json');
      console.error('\nExample structure:');
      console.error('your-project/');
      console.error('├── vibes/');
      console.error('│   └── tasks.json');
      process.exit(1);
    }

    const tasksPath = path.join(vibesFolder, 'tasks.json');
    if (!fs.existsSync(tasksPath)) {
      console.error('Error: tasks.json not found in the vibes folder');
      console.error('\nTo fix this:');
      console.error('1. Create a tasks.json file inside the vibes folder');
      console.error('2. Add your task definitions to tasks.json');
      process.exit(1);
    }

    const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    if (!Array.isArray(tasks)) {
      console.error('Error: tasks.json should contain an array of tasks');
      console.error('\nTo fix this:');
      console.error('1. Make sure tasks.json contains an array of task objects');
      console.error('2. Each task should have name, command, available_variables, prompt, and how_to_use properties');
      process.exit(1);
    }
    return tasks;
  } catch (error) {
    console.error('Error reading tasks.json:', error);
    process.exit(1);
  }
}

// Find a task by its command
function findTaskByCommand(command: string): Task | undefined {
  return readTasks().find(task => task.command === command);
}

// Replace variables in the prompt with provided values
function replaceVariables(prompt: string, variables: string[], variableNames: string[]): string {
  let result = prompt;
  variables.forEach((value, index) => {
    const variableName = `{{${variableNames[index]}}}`;
    result = result.replace(variableName, value);
  });
  return result;
}

// Copy text to clipboard using pbcopy on macOS
function copyToClipboard(text: string): void {
  const process = exec('pbcopy');
  if (process.stdin) {
    process.stdin.write(text);
    process.stdin.end();
    console.log('✓ Result copied to clipboard');
  } else {
    console.error('Failed to copy to clipboard: Could not access stdin');
  }
}

program
  .name('vibes')
  .description('CLI for managing project tasks')
  .version('1.0.0');

program
  .command('list')
  .description('List available tasks')
  .action(() => {
    const tasks = readTasks();
    console.log('Available tasks:\n');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.name}`);
      console.log(`   Command: ${task.command}`);
      console.log(`   AI Prompt: ${task.prompt}`);
      console.log(`   How to use: ${task.how_to_use}`);
      console.log(`   Available Variables: ${task.available_variables.join(', ')}`);
      console.log(''); // Empty line for better readability
    });
  });

program
  .command('execute')
  .description('Execute a task with provided variables')
  .argument('<command>', 'The command to execute')
  .argument('[variables...]', 'Variables to use in the task')
  .action((command: string, variables: string[]) => {
    const task = findTaskByCommand(command);
    
    if (!task) {
      console.error(`Task with command '${command}' not found`);
      process.exit(1);
    }

    if (variables.length !== task.available_variables.length) {
      console.error(`Expected ${task.available_variables.length} variables, but got ${variables.length}`);
      console.error(`Required variables: ${task.available_variables.join(', ')}`);
      process.exit(1);
    }

    const result = replaceVariables(task.prompt, variables, task.available_variables);
    console.log('\nExecuting task:', task.name);
    console.log('Result:', result);
    
    copyToClipboard(result);
  });

program.parse(process.argv); 