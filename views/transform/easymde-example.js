document.addEventListener("DOMContentLoaded", function () {
	console.log("DOM fully loaded. Initializing EasyMDE, custom extension, and CodeMirror overlay.");

	// 1. Custom Marked.js extension (for PREVIEW)
	const smallCapsExtension = {
		name: "smallCapsDollar",
		level: "inline",
		start(src) {
			const dollarIndex = src.indexOf("$");
			if (dollarIndex !== -1 && src[dollarIndex + 1] !== "$") return dollarIndex;
			return undefined;
		},
		tokenizer(src, tokens) {
			const rule = /^\$([^$\n]+?)\$/;
			const match = rule.exec(src);
			if (match) {
				const textContent = match[1].trim();
				return { type: "smallCapsDollar", raw: match[0], text: textContent, tokens: [] };
			}
			return undefined;
		},
		renderer(token) {
			return `<span class="rendered-small-caps">${token.text}</span>`;
		},
	};

	// 2. CodeMirror Overlay Mode (for LIVE EDITING styling)
	const smallCapsOverlay = {
		token: function (stream, state) {
			// Regex to match $text$
			// It should match a '$', then non-'$' characters, then a closing '$'.
			// The 'true' argument to stream.match consumes the matched text.
			if (stream.match(/^\$[^$\n]+?\$/, true)) {
				return "custom-small-caps"; // This will apply the .cm-custom-small-caps class
			}

			// If no match, advance the stream until a potential start of our pattern or EOL
			// This is crucial to prevent infinite loops on non-matching characters.
			while (stream.next() != null && !stream.match(/^\$[^$\n]+?\$/, false, false)) {
				// The 'false, false' means: don't consume, case-insensitive is false (though $ isn't case sensitive)
				// This loop advances char by char if our pattern isn't found immediately.
			}
			return null; // No special styling for other characters
		},
	};

	try {
		const easyMDE = new EasyMDE({
			element: document.getElementById("my-markdown-editor"),
			initialValue:
				'# Live Small Caps Editing!\n\nThis text includes $small caps$ which should appear styled $while you type$.\n\nTry the "$S$" button too!',
			spellChecker: false,
			placeholder: "Type your Markdown here...",
			renderingConfig: {
				markedOptions: {
					extensions: [smallCapsExtension],
				},
			},
			toolbar: [
				"bold",
				"italic",
				"heading",
				"|",
				"quote",
				"unordered-list",
				"ordered-list",
				"|",
				"link",
				"image",
				"|",
				{
					name: "insert-small-caps-syntax",
					action: function (editor) {
						const cm = editor.codemirror;
						const selectedText = cm.getSelection();
						if (selectedText) cm.replaceSelection(`$${selectedText}$`);
						else {
							cm.replaceSelection("$$");
							const cursorPos = cm.getCursor();
							cm.setCursor({ line: cursorPos.line, ch: cursorPos.ch - 1 });
						}
						cm.focus();
					},
					className: "fa fa-dollar-sign",
					title: "Insert Small Caps Syntax ($text$)",
				},
				"|",
				"preview",
				"side-by-side",
				"fullscreen",
				"|",
				"guide",
			],
		});

		console.log("EasyMDE initialized.");

		// 3. Add the overlay mode to CodeMirror instance
		const cmInstance = easyMDE.codemirror;
		if (cmInstance) {
			cmInstance.addOverlay(smallCapsOverlay);
			console.log("CodeMirror overlay for small caps added.");
		} else {
			console.warn("Could not get CodeMirror instance from EasyMDE.");
		}

		// --- Debugging Marked.js extension ---
		const testMarkdownInput = "Test $small caps preview$.";
		const renderedHtml = easyMDE.markdown(testMarkdownInput);
		if (renderedHtml.includes('class="rendered-small-caps"')) {
			console.log("Marked.js extension for preview is working.");
		} else {
			console.warn("Marked.js extension for preview might NOT be working.");
		}
	} catch (error) {
		console.error("Error initializing EasyMDE or applying overlay:", error);
	}
});
