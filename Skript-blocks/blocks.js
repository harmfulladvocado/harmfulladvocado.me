// Block definitions for Skript language
const blockDefinitions = {
    events: [
        {
            id: 'event-join',
            type: 'event',
            label: 'on join',
            code: 'on join:',
            inputs: []
        },
        {
            id: 'event-quit',
            type: 'event',
            label: 'on quit',
            code: 'on quit:',
            inputs: []
        },
        {
            id: 'event-death',
            type: 'event',
            label: 'on death',
            code: 'on death:',
            inputs: []
        },
        {
            id: 'event-break',
            type: 'event',
            label: 'on break',
            code: 'on break:',
            inputs: []
        },
        {
            id: 'event-place',
            type: 'event',
            label: 'on place',
            code: 'on place:',
            inputs: []
        },
        {
            id: 'event-chat',
            type: 'event',
            label: 'on chat',
            code: 'on chat:',
            inputs: []
        },
        {
            id: 'event-rightclick',
            type: 'event',
            label: 'on right click',
            code: 'on right click:',
            inputs: []
        },
        {
            id: 'event-leftclick',
            type: 'event',
            label: 'on left click',
            code: 'on left click:',
            inputs: []
        },
        {
            id: 'event-command',
            type: 'event',
            label: 'command',
            code: 'command /[input]:',
            inputs: [
                { type: 'text', placeholder: 'command', name: 'command' }
            ]
        }
    ],
    conditions: [
        {
            id: 'condition-if',
            type: 'condition',
            label: 'if condition',
            code: 'if [condition]:',
            inputs: [
                { type: 'text', placeholder: 'condition', name: 'condition' }
            ]
        },
        {
            id: 'condition-permission',
            type: 'condition',
            label: 'if player has permission',
            code: 'if player has permission "[permission]":',
            inputs: [
                { type: 'text', placeholder: 'permission', name: 'permission' }
            ]
        },
        {
            id: 'condition-op',
            type: 'condition',
            label: 'if player is op',
            code: 'if player is op:',
            inputs: []
        },
        {
            id: 'condition-block',
            type: 'condition',
            label: 'if block is',
            code: 'if block is [blocktype]:',
            inputs: [
                { type: 'text', placeholder: 'stone', name: 'blocktype' }
            ]
        },
        {
            id: 'condition-else',
            type: 'condition',
            label: 'else',
            code: 'else:',
            inputs: []
        }
    ],
    effects: [
        {
            id: 'effect-send',
            type: 'effect',
            label: 'send message to player',
            code: 'send "[message]" to player',
            inputs: [
                { type: 'text', placeholder: 'Hello!', name: 'message' }
            ]
        },
        {
            id: 'effect-broadcast',
            type: 'effect',
            label: 'broadcast message',
            code: 'broadcast "[message]"',
            inputs: [
                { type: 'text', placeholder: 'Hello everyone!', name: 'message' }
            ]
        },
        {
            id: 'effect-give',
            type: 'effect',
            label: 'give item to player',
            code: 'give [amount] [item] to player',
            inputs: [
                { type: 'number', placeholder: '1', name: 'amount' },
                { type: 'text', placeholder: 'diamond', name: 'item' }
            ]
        },
        {
            id: 'effect-teleport',
            type: 'effect',
            label: 'teleport player',
            code: 'teleport player to [location]',
            inputs: [
                { type: 'text', placeholder: 'spawn', name: 'location' }
            ]
        },
        {
            id: 'effect-set',
            type: 'effect',
            label: 'set variable',
            code: 'set {[variable]} to [value]',
            inputs: [
                { type: 'text', placeholder: 'var', name: 'variable' },
                { type: 'text', placeholder: 'value', name: 'value' }
            ]
        },
        {
            id: 'effect-command',
            type: 'effect',
            label: 'execute command',
            code: 'make player execute command "[command]"',
            inputs: [
                { type: 'text', placeholder: 'gamemode creative', name: 'command' }
            ]
        },
        {
            id: 'effect-console',
            type: 'effect',
            label: 'execute console command',
            code: 'execute console command "[command]"',
            inputs: [
                { type: 'text', placeholder: 'say Hello', name: 'command' }
            ]
        },
        {
            id: 'effect-kill',
            type: 'effect',
            label: 'kill player',
            code: 'kill player',
            inputs: []
        },
        {
            id: 'effect-damage',
            type: 'effect',
            label: 'damage player',
            code: 'damage player by [amount]',
            inputs: [
                { type: 'number', placeholder: '5', name: 'amount' }
            ]
        },
        {
            id: 'effect-heal',
            type: 'effect',
            label: 'heal player',
            code: 'heal player by [amount]',
            inputs: [
                { type: 'number', placeholder: '10', name: 'amount' }
            ]
        }
    ],
    expressions: [
        {
            id: 'expr-player',
            type: 'expression',
            label: 'player',
            code: 'player',
            inputs: []
        },
        {
            id: 'expr-victim',
            type: 'expression',
            label: 'victim',
            code: 'victim',
            inputs: []
        },
        {
            id: 'expr-attacker',
            type: 'expression',
            label: 'attacker',
            code: 'attacker',
            inputs: []
        },
        {
            id: 'expr-clicked-block',
            type: 'expression',
            label: 'clicked block',
            code: 'clicked block',
            inputs: []
        },
        {
            id: 'expr-event-item',
            type: 'expression',
            label: 'event item',
            code: 'event-item',
            inputs: []
        },
        {
            id: 'expr-event-block',
            type: 'expression',
            label: 'event block',
            code: 'event-block',
            inputs: []
        },
        {
            id: 'expr-message',
            type: 'expression',
            label: 'message',
            code: 'message',
            inputs: []
        }
    ],
    loops: [
        {
            id: 'loop-players',
            type: 'loop',
            label: 'loop all players',
            code: 'loop all players:',
            inputs: []
        },
        {
            id: 'loop-blocks',
            type: 'loop',
            label: 'loop blocks in radius',
            code: 'loop blocks in radius [radius]:',
            inputs: [
                { type: 'number', placeholder: '5', name: 'radius' }
            ]
        },
        {
            id: 'loop-times',
            type: 'loop',
            label: 'loop times',
            code: 'loop [times] times:',
            inputs: [
                { type: 'number', placeholder: '10', name: 'times' }
            ]
        },
        {
            id: 'loop-player',
            type: 'loop',
            label: 'loop-player',
            code: 'loop-player',
            inputs: []
        },
        {
            id: 'loop-block',
            type: 'loop',
            label: 'loop-block',
            code: 'loop-block',
            inputs: []
        },
        {
            id: 'loop-value',
            type: 'loop',
            label: 'loop-value',
            code: 'loop-value',
            inputs: []
        }
    ],
    variables: [
        {
            id: 'var-local',
            type: 'variable',
            label: 'local variable',
            code: '{_[name]}',
            inputs: [
                { type: 'text', placeholder: 'variable', name: 'name' }
            ]
        },
        {
            id: 'var-global',
            type: 'variable',
            label: 'global variable',
            code: '{[name]}',
            inputs: [
                { type: 'text', placeholder: 'variable', name: 'name' }
            ]
        },
        {
            id: 'var-set',
            type: 'variable',
            label: 'set variable',
            code: 'set {[variable]} to [value]',
            inputs: [
                { type: 'text', placeholder: 'var', name: 'variable' },
                { type: 'text', placeholder: 'value', name: 'value' }
            ]
        },
        {
            id: 'var-add',
            type: 'variable',
            label: 'add to variable',
            code: 'add [value] to {[variable]}',
            inputs: [
                { type: 'text', placeholder: '1', name: 'value' },
                { type: 'text', placeholder: 'var', name: 'variable' }
            ]
        },
        {
            id: 'var-remove',
            type: 'variable',
            label: 'remove from variable',
            code: 'remove [value] from {[variable]}',
            inputs: [
                { type: 'text', placeholder: '1', name: 'value' },
                { type: 'text', placeholder: 'var', name: 'variable' }
            ]
        },
        {
            id: 'var-delete',
            type: 'variable',
            label: 'delete variable',
            code: 'delete {[variable]}',
            inputs: [
                { type: 'text', placeholder: 'var', name: 'variable' }
            ]
        }
    ]
};
