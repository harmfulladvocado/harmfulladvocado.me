:root {
    --bg-primary: #f5f5f5;
    --bg-secondary: #ffffff;
    --bg-tertiary: #e8e8e8;
    --text-primary: #333333;
    --text-secondary: #666666;
    --border-color: #cccccc;
    --shadow: rgba(0, 0, 0, 0.1);
    --event-color: #FFD700;
    --condition-color: #87CEEB;
    --effect-color: #90EE90;
    --expression-color: #FFB6C1;
    --loop-color: #DDA0DD;
    --variable-color: #FFA07A;
}

body.dark-mode {
    --bg-primary: #1e1e1e;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #3d3d3d;
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
    --border-color: #555555;
    --shadow: rgba(0, 0, 0, 0.5);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s, color 0.3s;
    overflow: hidden;
}

.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header */
.header {
    background-color: var(--bg-secondary);
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px var(--shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border-color);
}

.header h1 {
    font-size: 1.6rem;
    color: var(--text-primary);
}

.header-controls {
    display: flex;
    gap: 0.5rem;
}

.btn {
    padding: 0.45rem 0.9rem;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s, transform 0.1s;
}

.btn:hover {
    background-color: var(--bg-primary);
    transform: translateY(-1px);
}

.btn:active {
    transform: translateY(0);
}

/* Main Content */
.main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Block Palette */
.block-palette {
    width: 250px;
    background-color: var(--bg-secondary);
    border-right: 2px solid var(--border-color);
    overflow-y: auto;
    padding: 1rem;
}

.block-palette h2 {
    font-size: 1.05rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.palette-section {
    margin-bottom: 1.5rem;
}

.palette-section h3 {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
}

.blocks-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* Workspace */
.workspace {
    flex: 1;
    padding: 1rem;
    overflow: auto;
    position: relative;
}

.workspace h2 {
    font-size: 1.05rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.drop-zone {
    min-height: calc(100vh - 200px);
    background-color: var(--bg-secondary);
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    position: relative;
}

.drop-zone.drag-over {
    background-color: var(--bg-tertiary);
    border-color: var(--text-secondary);
}

/* Code Output */
.code-output {
    width: 350px;
    background-color: var(--bg-secondary);
    border-left: 2px solid var(--border-color);
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.code-output h2 {
    font-size: 1.05rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

/* Make generated code font smaller and prevent wrapping; allow horizontal scroll instead */
#code-display {
    flex: 1;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1rem;
    overflow: auto;
    font-family: 'Courier New', monospace;
    font-size: 0.78rem; /* smaller font to reduce line breaks */
    color: var(--text-primary);
    white-space: pre; /* prevent wrapping - preserve newlines only */
    overflow-x: auto;
}

#copy-code {
    margin-top: 0.5rem;
}

.workspace .block {
    padding: 0.6rem 0.9rem;
    border-radius: 6px;
    cursor: grab;
    user-select: none;
    box-shadow: 0 2px 4px var(--shadow);
    transition: transform 0.1s, box-shadow 0.1s;
    font-size: 0.78rem; /* smaller block font */
    position: absolute;
    border: 2px solid rgba(0, 0, 0, 0.2);
}

.block:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow);
}

.block.dragging {
    opacity: 1;
    cursor: grabbing;
}

.block.event {
    background-color: var(--event-color);
    color: #000;
}

.block.condition {
    background-color: var(--condition-color);
    color: #000;
}

.block.effect {
    background-color: var(--effect-color);
    color: #000;
}

.block.expression {
    background-color: var(--expression-color);
    color: #000;
}

.block.loop {
    background-color: var(--loop-color);
    color: #000;
}

.block.variable {
    background-color: var(--variable-color);
    color: #000;
}

.block input,
.block select {
    padding: 0.2rem 0.4rem;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.85);
    color: #000;
    font-size: 0.72rem;
    margin: 0 0.2rem;
}

.block input:focus,
.block select:focus {
    outline: 2px solid rgba(0, 0, 0, 0.45);
}

/* Small visual connector at bottom of container blocks to indicate where to snap children */
.block .connector-bottom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -8px;
    width: 40px;
    height: 12px;
    background: rgba(0,0,0,0.08);
    border-radius: 6px;
    display: block;
    pointer-events: none;
    opacity: 0.85;
}

/* Highlight containers that can accept a snap while dragging */
.block.can-snap {
    box-shadow: 0 0 0 3px rgba(80,180,80,0.18);
}

/* Insertion ghost (visual placeholder) */
.insertion-ghost {
    border: 10px dashed rgba(0, 0, 0, 0.25);
    background: rgba(0,0,0,0.03);
    pointer-events: none;
    z-index: 999;
}


/* Delete button */
.block-delete {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 3px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
}

.block:hover .block-delete {
    opacity: 1;
}

.block-delete:hover {
    background-color: rgba(255, 0, 0, 0.9);
}

/* Documentation Panel */
.docs-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 500px;
    height: 100vh;
    background-color: var(--bg-secondary);
    border-left: 2px solid var(--border-color);
    box-shadow: -4px 0 8px var(--shadow);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.docs-panel.show {
    transform: translateX(0);
}

.docs-panel.hidden {
    transform: translateX(100%);
}

.docs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 2px solid var(--border-color);
}

.docs-header h2 {
    font-size: 1.2rem;
    color: var(--text-primary);
}

.docs-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
}

.docs-section {
    margin-bottom: 2rem;
}

.docs-section h3 {
    font-size: 1.05rem;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.25rem;
}

.docs-section p {
    margin-bottom: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.6;
}

.docs-section ul {
    list-style: none;
    padding-left: 0;
}

.docs-section li {
    padding: 0.5rem 0;
    color: var(--text-secondary);
    line-height: 1.6;
}

.docs-section li strong {
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
    background-color: var(--bg-tertiary);
    padding: 0.125rem 0.5rem;
    border-radius: 3px;
}

.docs-section a {
    color: #4a9eff;
    text-decoration: none;
}

.docs-section a:hover {
    text-decoration: underline;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
}

/* Responsive */
@media (max-width: 1024px) {
    .block-palette {
        width: 200px;
    }

    .code-output {
        width: 300px;
    }

    .docs-panel {
        width: 400px;
    }
}

@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
    }

    .block-palette,
    .code-output {
        width: 100%;
        max-height: 200px;
    }

    .docs-panel {
        width: 100%;
    }
}
