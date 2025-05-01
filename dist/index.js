#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const program = new commander_1.Command();
// Read the tasks from the JSON file
function readTasks() {
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
    }
    catch (error) {
        console.error('Error reading tasks.json:', error);
        process.exit(1);
    }
}
// Find a task by its command
function findTaskByCommand(command) {
    return readTasks().find(task => task.command === command);
}
// Replace variables in the prompt with provided values
function replaceVariables(prompt, variables, variableNames) {
    let result = prompt;
    variables.forEach((value, index) => {
        const variableName = `{{${variableNames[index]}}}`;
        result = result.replace(variableName, value);
    });
    return result;
}
// Copy text to clipboard using pbcopy on macOS
function copyToClipboard(text) {
    const process = (0, child_process_1.exec)('pbcopy');
    if (process.stdin) {
        process.stdin.write(text);
        process.stdin.end();
        console.log('✓ Result copied to clipboard');
    }
    else {
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
    .action((command, variables) => {
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
