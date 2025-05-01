import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';

const execAsync = promisify(exec);

describe('Vibes CLI', () => {
  const testTasksPath = path.join(process.cwd(), 'vibes', 'tasks.json');
  const originalTasksPath = path.join(process.cwd(), 'vibes', 'tasks.json.original');
  const tempVibesPath = path.join(process.cwd(), 'vibes_temp');

  // Setup: Create a test tasks.json file
  beforeAll(async () => {
    // Create vibes directory if it doesn't exist
    if (!fs.existsSync(path.dirname(testTasksPath))) {
      fs.mkdirSync(path.dirname(testTasksPath), { recursive: true });
    }

    // Backup original tasks.json if it exists
    if (fs.existsSync(testTasksPath)) {
      fs.copyFileSync(testTasksPath, originalTasksPath);
    }

    // Create test tasks.json
    const testTasks = [
      {
        name: "Test Task",
        command: "test-task",
        available_variables: ["variable1"],
        prompt: "Test prompt with {{variable1}}",
        how_to_use: "vibes execute test-task 'value1'"
      }
    ];
    fs.writeFileSync(testTasksPath, JSON.stringify(testTasks, null, 2));
  });

  // Cleanup: Restore original tasks.json
  afterAll(() => {
    if (fs.existsSync(originalTasksPath)) {
      fs.copyFileSync(originalTasksPath, testTasksPath);
      fs.unlinkSync(originalTasksPath);
    } else {
      fs.unlinkSync(testTasksPath);
    }
    // Clean up temp directory if it exists
    if (fs.existsSync(tempVibesPath)) {
      fs.rmSync(tempVibesPath, { recursive: true, force: true });
    }
  });

  describe('list command', () => {
    it('should list available tasks', async () => {
      const { stdout } = await execAsync('vibes list');
      expect(stdout).toContain('Test Task');
      expect(stdout).toContain('test-task');
    });
  });

  describe('execute command', () => {
    it('should execute a task with valid variables', async () => {
      const { stdout } = await execAsync('vibes execute test-task "test-value"');
      expect(stdout).toContain('Test prompt with test-value');
      expect(stdout).toContain('✓ Result copied to clipboard');
    });

    it('should fail with incorrect number of variables', async () => {
      try {
        await execAsync('vibes execute test-task');
      } catch (error: any) {
        expect(error.message).toContain('Expected 1 variables, but got 0');
      }
    });

    it('should fail with non-existent command', async () => {
      try {
        await execAsync('vibes execute non-existent-command "value"');
      } catch (error: any) {
        expect(error.message).toContain('Task with command \'non-existent-command\' not found');
      }
    });
  });

  describe('error handling', () => {
    it('should handle missing vibes directory', async () => {
      // Move the vibes directory to a temporary location
      if (fs.existsSync(path.dirname(testTasksPath))) {
        fs.renameSync(path.dirname(testTasksPath), tempVibesPath);
      }

      try {
        await execAsync('vibes list');
      } catch (error: any) {
        expect(error.message).toContain('vibes folder not found');
      } finally {
        // Restore the directory
        if (fs.existsSync(tempVibesPath)) {
          fs.renameSync(tempVibesPath, path.dirname(testTasksPath));
        }
      }
    });

    it('should handle invalid tasks.json', async () => {
      // Write invalid JSON
      fs.writeFileSync(testTasksPath, 'invalid json');

      try {
        await execAsync('vibes list');
      } catch (error: any) {
        expect(error.message).toContain('Error reading tasks.json');
      }
    });
  });
}); 