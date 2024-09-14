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
import nlp from "compromise";

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
	}

	async suggestSynonyms(word: string, editor: Editor) {
		try {
			const context = this.getSentenceAtCursor(editor);
			const synonyms = await this.fetchSynonyms(word, context);
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

	getSentenceAtCursor(editor: Editor): string {
		const cursor = editor.getCursor();
		const content = editor.getLine(cursor.line);
		const sentences = content.match(/[^\.!\?]+[\.!\?]+/g) || [content];
		let cumulativeLength = 0;
		for (const sentence of sentences) {
			cumulativeLength += sentence.length;
			if (cumulativeLength >= cursor.ch) {
				return sentence.trim();
			}
		}
		return content.trim();
	}

	getWordPOS(word: string): string {
		const doc = nlp(word);
		const tags = doc.json()[0].terms[0].tags;
		if (tags.includes("Verb")) return "v";
		if (tags.includes("Noun")) return "n";
		if (tags.includes("Adjective")) return "adj";
		// Add more POS as needed
		return "";
	}

	async fetchSynonyms(word: string, context: string): Promise<string[]> {
		const pos = this.getWordPOS(word);
		const response = await fetch(
			`https://api.datamuse.com/words?ml=${encodeURIComponent(
				word
			)}&topics=${encodeURIComponent(context)}&md=p`
		);
		const data = await response.json();
		return data
			.filter((item: any) => item.tags && item.tags.includes(pos))
			.map((item: any) => item.word);
	}

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

	onunload() {}
}

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
