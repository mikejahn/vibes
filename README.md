# Vibes CLI

A powerful CLI tool that helps you manage and execute AI-powered tasks in your projects.

## What this tool does

Vibes is a command-line interface (CLI) tool that helps you manage and execute AI-powered tasks in your projects. It allows you to:

- Define reusable tasks with customizable variables
- Execute tasks with specific parameters
- Automatically copy results to your clipboard
- Maintain a centralized repository of AI prompts and tasks

## How to use this tool

1.  First, add a folder in your codebase called `vibes`.  In that folder create a file called `tasks.json`.
2.  The format of that json file is as follows:

```json
[
    {
    "name": "Do some task", // the name of the task
    "command": "do-some-task", // the actual command that you can run
    "available_variables": ["some_variable"], // an array of variables you can use
    "prompt": "Do something with {{some_variable}}", // the baseline prompt that will be used to copy to your clipboard
    "how_to_use": "vibes execute do-some-task 'some_variable'" // a How To which explains to the user how to use execute this task
    }
]
```

### Basic Commands

1. List all available tasks:
```bash
vibes list
```

2. Execute a task:
```bash
vibes execute <command> <variables...>
```

### Example

Given a task defined in `vibes/tasks.json` in your codebase:
```json
{
  "name": "Do some task",
  "command": "do-some-task",
  "available_variables": ["some_variable"],
  "prompt": "Do something with {{some_variable}}",
  "how_to_use": "vibes execute do-some-task 'some_variable'"
}
```

You can execute it with:
```bash
vibes execute do-some-task "some_variable"
```

The result will be displayed and automatically copied to your clipboard.


## How to develop this tool

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibes.git
cd vibes
```

2. Install dependencies:
```bash
yarn
```

### Project Structure

```
vibes/
├── src/                # Source code
│   └── index.ts       # Main CLI implementation
├── dist/              # Compiled JavaScript
├── vibes/             # Task definitions
│   └── tasks.json     # Task configuration
├── package.json       # Project configuration
└── tsconfig.json      # TypeScript configuration
```


### Development Workflow
1. Make changes to the source code in `src/`
2. Build the project:
```bash
npm run build
```
3. Install the updated version:
```bash
sudo npm install . -g
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Testing

TODO

### Building for Distribution

```bash
npm run build
```

This will compile the TypeScript code and create the distribution files in the `dist/` directory. 