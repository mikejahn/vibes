# Vibes CLI

A powerful CLI tool that helps you manage and execute AI-powered tasks in your projects.

## What this tool does

Vibes is a command-line interface (CLI) tool that helps you manage and execute AI-powered tasks in your projects. It allows you to:

- Define reusable tasks with customizable variables
- Execute tasks with specific parameters
- Automatically copy results to your clipboard
- Maintain a centralized repository of AI prompts and tasks

## How to use this tool

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

Given a task defined in `vibes/tasks.json`:
```json
{
  "name": "Make a feature permanent",
  "command": "make-feature-permanent",
  "available_variables": ["toggle_name"],
  "prompt": "Do something with {{toggle_name}}",
  "how_to_use": "vibes execute make-feature-permanent 'some_toggle_name'"
}
```

You can execute it with:
```bash
vibes execute make-feature-permanent "my_toggle"
```

The result will be displayed and automatically copied to your clipboard.

## How to install this tool

### Global Installation

```bash
npm install -g vibes
```

### Local Installation

```bash
npm install vibes --save-dev
```

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
npm install
```

3. Build the project:
```bash
npm run build
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

### Adding New Tasks

1. Create or edit `vibes/tasks.json`:
```json
[
  {
    "name": "Your Task Name",
    "command": "your-command",
    "available_variables": ["variable1", "variable2"],
    "prompt": "Your AI prompt with {{variable1}} and {{variable2}}",
    "how_to_use": "vibes execute your-command 'value1' 'value2'"
  }
]
```

2. Rebuild the project:
```bash
npm run build
```

### Development Workflow

1. Make changes to the source code in `src/`
2. Build the project:
```bash
npm run build
```
3. Test your changes:
```bash
npm test
```
4. Install the updated version:
```bash
npm install -g .
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Testing

Run the test suite:
```bash
npm test
```

### Building for Distribution

```bash
npm run build
```

This will compile the TypeScript code and create the distribution files in the `dist/` directory. 