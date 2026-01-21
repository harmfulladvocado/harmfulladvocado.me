// Skript Block Editor Application
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const workspace = document.getElementById('workspace');
    const codeDisplay = document.getElementById('code-display');
    const themeToggle = document.getElementById('theme-toggle');
    const docsToggle = document.getElementById('docs-toggle');
    const docsPanel = document.getElementById('docs-panel');
    const closeDocs = document.getElementById('close-docs');
    const clearWorkspace = document.getElementById('clear-workspace');
    const copyCode = document.getElementById('copy-code');

    // State
    let workspaceBlocks = [];
    let blockIdCounter = 0;

    // Helper function to escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize the application
    function init() {
        populateBlockPalette();
        setupEventListeners();
        loadTheme();
        updateCode();
    }

    // Populate the block palette with blocks from blockDefinitions
    function populateBlockPalette() {
        const categories = ['events', 'conditions', 'effects', 'loops', 'variables'];
        
        categories.forEach(category => {
            const container = document.getElementById(`${category}-blocks`);
            if (!container) return;
            
            const blocks = blockDefinitions[category];
            if (!blocks) return;

            blocks.forEach(blockDef => {
                const blockElement = createPaletteBlock(blockDef);
                container.appendChild(blockElement);
            });
        });
    }

    // Create a block element for the palette
    function createPaletteBlock(blockDef) {
        const block = document.createElement('div');
        block.className = `block ${blockDef.type}`;
        block.draggable = true;
        block.dataset.blockDef = JSON.stringify(blockDef);
        
        let labelText = blockDef.label;
        block.textContent = labelText;
        
        // Palette blocks don't need inputs
        block.style.position = 'relative';
        block.style.cursor = 'grab';
        
        // Drag events for palette blocks
        block.addEventListener('dragstart', handlePaletteDragStart);
        
        return block;
    }

    // Create a workspace block instance
    function createWorkspaceBlock(blockDef, x, y) {
        const block = document.createElement('div');
        block.className = `block ${blockDef.type}`;
        block.draggable = true;
        block.dataset.blockId = blockIdCounter++;
        block.dataset.blockDef = JSON.stringify(blockDef);
        block.style.position = 'absolute';
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
        
        // Build block content with inputs
        buildBlockContent(block, blockDef);
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'block-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeBlock(block);
        });
        block.appendChild(deleteBtn);
        
        // Drag events for workspace blocks
        block.addEventListener('dragstart', handleWorkspaceDragStart);
        block.addEventListener('dragend', handleDragEnd);
        
        return block;
    }

    // Build block content with inputs
    function buildBlockContent(block, blockDef) {
        let code = blockDef.code;
        
        if (!blockDef.inputs || blockDef.inputs.length === 0) {
            block.innerHTML = blockDef.label;
            return;
        }
        
        // Parse the code and replace placeholders with inputs
        let html = code;
        blockDef.inputs.forEach(input => {
            const placeholder = `[${input.name}]`;
            let inputElement = '';
            
            if (input.type === 'text') {
                inputElement = `<input type="text" placeholder="${escapeHtml(input.placeholder)}" data-input="${escapeHtml(input.name)}" size="${input.placeholder.length}">`;
            } else if (input.type === 'number') {
                inputElement = `<input type="number" placeholder="${escapeHtml(input.placeholder)}" data-input="${escapeHtml(input.name)}" size="5">`;
            }
            
            html = html.replace(placeholder, inputElement);
        });
        
        block.innerHTML = html;
    }

    // Handle drag start from palette
    function handlePaletteDragStart(e) {
        const blockDef = JSON.parse(e.target.dataset.blockDef);
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'palette',
            blockDef: blockDef
        }));
    }

    // Handle drag start from workspace
    function handleWorkspaceDragStart(e) {
        const block = e.target.closest('.block');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'workspace',
            blockId: block.dataset.blockId
        }));
        block.classList.add('dragging');
    }

    // Handle drag end
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Workspace drop zone
        workspace.addEventListener('dragover', (e) => {
            e.preventDefault();
            workspace.classList.add('drag-over');
        });
        
        workspace.addEventListener('dragleave', () => {
            workspace.classList.remove('drag-over');
        });
        
        workspace.addEventListener('drop', handleWorkspaceDrop);
        
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Docs panel
        docsToggle.addEventListener('click', () => {
            docsPanel.classList.remove('hidden');
            docsPanel.classList.add('show');
        });
        
        closeDocs.addEventListener('click', () => {
            docsPanel.classList.remove('show');
            docsPanel.classList.add('hidden');
        });
        
        // Clear workspace
        clearWorkspace.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the workspace?')) {
                workspace.innerHTML = '';
                workspaceBlocks = [];
                updateCode();
            }
        });
        
        // Copy code
        copyCode.addEventListener('click', () => {
            const code = codeDisplay.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyCode.textContent;
                copyCode.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyCode.textContent = originalText;
                }, 2000);
            });
        });
        
        // Update code when inputs change
        workspace.addEventListener('input', () => {
            updateCode();
        });
    }

    // Handle drop on workspace
    function handleWorkspaceDrop(e) {
        e.preventDefault();
        workspace.classList.remove('drag-over');
        
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const rect = workspace.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (data.type === 'palette') {
            // Create new block from palette
            const block = createWorkspaceBlock(data.blockDef, x, y);
            workspace.appendChild(block);
            workspaceBlocks.push(block);
            updateCode();
        } else if (data.type === 'workspace') {
            // Move existing block
            const block = workspace.querySelector(`[data-block-id="${data.blockId}"]`);
            if (block) {
                block.style.left = `${x}px`;
                block.style.top = `${y}px`;
            }
        }
    }

    // Remove block from workspace
    function removeBlock(block) {
        block.remove();
        workspaceBlocks = workspaceBlocks.filter(b => b !== block);
        updateCode();
    }

    // Update generated code
    function updateCode() {
        const blocks = Array.from(workspace.querySelectorAll('.block'));
        
        if (blocks.length === 0) {
            codeDisplay.textContent = '# Drag blocks here to generate code';
            return;
        }
        
        // Sort blocks by Y position (top to bottom)
        blocks.sort((a, b) => {
            const aY = parseInt(a.style.top) || 0;
            const bY = parseInt(b.style.top) || 0;
            return aY - bY;
        });
        
        let code = '';
        let indent = 0;
        
        blocks.forEach((block, index) => {
            const blockDef = JSON.parse(block.dataset.blockDef);
            let blockCode = blockDef.code;
            
            // Replace input placeholders with actual values
            if (blockDef.inputs) {
                blockDef.inputs.forEach(input => {
                    const inputElement = block.querySelector(`[data-input="${input.name}"]`);
                    const value = inputElement ? inputElement.value : input.placeholder;
                    blockCode = blockCode.replace(`[${input.name}]`, value);
                });
            }
            
            // Handle indentation
            if (blockCode.endsWith(':')) {
                code += '\t'.repeat(indent) + blockCode + '\n';
                indent++;
            } else if (blockDef.type === 'condition' && blockDef.id === 'condition-else') {
                indent = Math.max(0, indent - 1);
                code += '\t'.repeat(indent) + blockCode + '\n';
                indent++;
            } else {
                code += '\t'.repeat(indent) + blockCode + '\n';
            }
            
            // Reset indent if it's the last block or next block is an event
            if (index < blocks.length - 1) {
                const nextBlockDef = JSON.parse(blocks[index + 1].dataset.blockDef);
                if (nextBlockDef.type === 'event' || nextBlockDef.id === 'condition-else') {
                    indent = 0;
                }
            }
        });
        
        codeDisplay.textContent = code;
    }

    // Theme management
    function toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️ Light Mode';
        }
    }

    // Initialize the application
    init();
});
