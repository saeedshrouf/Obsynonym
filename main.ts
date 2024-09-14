import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// Existing sample code (optional to keep)
		// ...

		// Add the synonym suggestion command
		this.addCommand({
			id: "suggest-synonyms",
			name: "Suggest Synonyms",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selectedText = editor.getSelection();
				if (selectedText) {
					this.suggestSynonyms(selectedText, editor);
				} else {
					new Notice("Please select a word to get synonyms.");
				}
			},
		});

		// Any other initialization code
		// ...
	}

	async suggestSynonyms(word: string, editor: Editor) {
		try {
			const synonyms = await this.fetchSynonyms(word);
			if (synonyms.length > 0) {
				new SynonymModal(this.app, synonyms, (replacement) => {
					editor.replaceSelection(replacement);
				}).open();
			} else {
				new Notice("No synonyms found.");
			}
		} catch (error) {
			new Notice("Error fetching synonyms.");
			console.error(error);
		}
	}

	async fetchSynonyms(word: string): Promise<string[]> {
		const response = await fetch(
			`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}`
		);
		const data = await response.json();
		return data.map((item: any) => item.word);
	}

	// Existing methods for settings, unloading, etc.
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		// Cleanup code if needed
	}
}

// SynonymModal class outside the plugin class
class SynonymModal extends Modal {
	synonyms: string[];
	onChoose: (synonym: string) => void;

	constructor(
		app: App,
		synonyms: string[],
		onChoose: (synonym: string) => void
	) {
		super(app);
		this.synonyms = synonyms;
		this.onChoose = onChoose;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Select a Synonym" });

		this.synonyms.forEach((synonym) => {
			const synonymEl = contentEl.createEl("div", {
				text: synonym,
				cls: "synonym-item",
			});
			synonymEl.onclick = () => {
				this.onChoose(synonym);
				this.close();
			};
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// Optionally, keep or update your SampleSettingTab and SampleModal classes
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
