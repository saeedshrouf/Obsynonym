# Obsynonym

**Obsynonym** is a custom plugin for [Obsidian](https://obsidian.md) that enhances your writing by providing context-based synonyms directly within the editor. With Obsynonym, you can effortlessly find and replace words with suitable alternatives to improve the clarity and variety of your notes.

## Features

- **Quick Synonym Suggestions**: Highlight any word to receive a list of synonyms.
- **Seamless Integration**: Works directly within Obsidian without disrupting your workflow.
- **Customizable Hotkeys**: Assign keyboard shortcuts for faster access.
- **Lightweight**: Minimal impact on Obsidian's performance.

## Installation

### From the Community Plugins (Coming Soon)

> **Note**: Obsynonym is currently a custom plugin and may not be available in the Obsidian Community Plugins list yet. You can install it manually by following the steps below.

### Manual Installation

1. **Download the Plugin**

   - Clone or download this repository to your local machine:
     ```bash
     git clone https://github.com/saeedshrouf/obsynonym.git
     ```
   - Or download the latest release from the [Releases](https://github.com/saeedshrouf/obsynonym/releases) page.

2. **Copy to Obsidian Plugins Folder**

   - Locate your Obsidian vault folder.
   - Navigate to the `.obsidian/plugins/` directory within your vault. If the `plugins` folder doesn't exist, create it.
   - Create a new folder called `obsynonym`.
   - Copy the following files into the `obsynonym` folder:
     - `main.js`
     - `manifest.json`
     - `styles.css` (if available)

3. **Enable the Plugin in Obsidian**

   - Open Obsidian.
   - Go to **Settings** (gear icon) > **Community Plugins**.
   - Ensure that **Safe Mode** is **turned off**.
   - Click on **Reload Plugins**.
   - Find **Obsynonym** in the list of installed plugins and toggle it **on**.

## Usage

1. **Select a Word**

   - Open a note in Obsidian.
   - Highlight the word you want to find synonyms for.

2. **Invoke the Synonym Suggestion Command**

   - **Option 1**: Use the Command Palette
     - Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (macOS) to open the Command Palette.
     - Type **Suggest Synonyms** and select the command.
   - **Option 2**: Use a Hotkey
     - Go to **Settings** > **Hotkeys**.
     - Search for **Suggest Synonyms**.
     - Assign a custom hotkey (e.g., `Ctrl+Alt+S`).
     - After highlighting a word, use the hotkey to invoke the command directly.

3. **Choose a Synonym**

   - A modal will appear displaying a list of synonyms.
   - Click on a synonym to replace the highlighted word in your note.

## Configuration

Currently, Obsynonym does not require any configuration settings. Future updates may introduce customizable options.

## Development

If you wish to contribute or modify the plugin, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/saeedshrouf/obsynonym.git
