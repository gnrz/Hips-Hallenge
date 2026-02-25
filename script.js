class HipsHallenge {
    constructor() {
        this.currentLevel = 1;
        this.moves = 0;
        this.gemsCollected = 0;
        this.keysCollected = 0;
        this.playerPos = null;
        this.levelData = null;
        this.gameBoard = document.getElementById('game-board');
        this.messageEl = document.getElementById('message');
        this.resetBtn = document.getElementById('reset-btn');
        this.nextBtn = document.getElementById('next-btn');

        this.resetBtn.addEventListener('click', () => this.resetLevel());
        this.nextBtn.addEventListener('click', () => this.nextLevel());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        this.initLevels();
        this.loadLevel(1);
    }

    initLevels() {
        this.levels = [
            {
                name: 'Getting Started',
                width: 6,
                height: 6,
                tiles: [
                    [1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 2, 0, 3, 1],
                    [1, 0, 0, 4, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 },
                gems: 1
            },
            {
                name: 'Key Hunt',
                width: 7,
                height: 7,
                tiles: [
                    [1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 2, 1, 0, 5, 1],
                    [1, 1, 5, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 3, 1],
                    [1, 0, 4, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 },
                gems: 1,
                keysRequired: 2
            },
            {
                name: 'Locked Treasure',
                width: 8,
                height: 8,
                tiles: [
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 2, 0, 5, 0, 3, 1],
                    [1, 0, 0, 1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 5, 0, 2, 0, 3, 1],
                    [1, 0, 0, 0, 0, 0, 4, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 },
                gems: 2
            },
            {
                name: 'Maze Master',
                width: 9,
                height: 9,
                tiles: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 1],
                    [1, 0, 2, 1, 0, 5, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 2, 1],
                    [1, 1, 1, 0, 5, 0, 1, 1, 1],
                    [1, 0, 0, 0, 0, 3, 0, 4, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 },
                gems: 2
            },
            {
                name: 'Ultimate Challenge',
                width: 10,
                height: 10,
                tiles: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 1, 2, 1, 0, 0, 0, 1],
                    [1, 0, 5, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 5, 1, 2, 1, 0, 1, 3, 1],
                    [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 4, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                start: { x: 1, y: 1 },
                gems: 3
            }
        ];
    }

    loadLevel(levelNum) {
        if (levelNum > this.levels.length) {
            this.showMessage('All ' + this.levels.length + ' levels completed! You are a master!', 'success');
            this.nextBtn.style.display = 'none';
            return;
        }

        this.currentLevel = levelNum;
        this.moves = 0;
        this.gemsCollected = 0;
        this.keysCollected = 0;
        this.levelData = JSON.parse(JSON.stringify(this.levels[levelNum - 1]));
        this.playerPos = { ...this.levelData.start };
        this.nextBtn.style.display = 'none';
        this.messageEl.textContent = '';
        this.messageEl.className = '';

        this.updateUI();
        this.renderBoard();
    }

    resetLevel() {
        this.loadLevel(this.currentLevel);
    }

    nextLevel() {
        this.loadLevel(this.currentLevel + 1);
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        const gridSize = this.levelData.width;
        this.gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        for (let y = 0; y < this.levelData.height; y++) {
            for (let x = 0; x < this.levelData.width; x++) {
                const tile = document.createElement('div');
                const tileType = this.levelData.tiles[y][x];
                tile.className = 'tile';

                if (this.playerPos.x === x && this.playerPos.y === y) {
                    tile.className += ' player';
                    tile.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48" shape-rendering="crispEdges">` +
                        `<rect x="12" y="0" width="18" height="3" fill="#1a69c4"/>` +
                        `<rect x="9" y="3" width="24" height="6" fill="#1a69c4"/>` +
                        `<rect x="6" y="9" width="30" height="3" fill="#0a3a7a"/>` +
                        `<rect x="9" y="12" width="24" height="15" fill="#e8b89a"/>` +
                        `<rect x="12" y="18" width="3" height="3" fill="#1a1a1a"/>` +
                        `<rect x="27" y="18" width="3" height="3" fill="#1a1a1a"/>` +
                        `<rect x="6" y="27" width="30" height="12" fill="#3a8fd4"/>` +
                        `<rect x="9" y="39" width="9" height="6" fill="#1a3a7a"/>` +
                        `<rect x="24" y="39" width="9" height="6" fill="#1a3a7a"/>` +
                        `<rect x="6" y="45" width="12" height="3" fill="#5a3010"/>` +
                        `<rect x="24" y="45" width="12" height="3" fill="#5a3010"/>` +
                        `</svg>`;
                } else if (tileType === 0) {
                    tile.className += ' empty';
                } else if (tileType === 1) {
                    tile.className += ' wall';
                } else if (tileType === 2) {
                    tile.className += ' gem';
                    tile.textContent = '◆';
                } else if (tileType === 3) {
                    tile.className += ' door';
                    if (this.doorsUnlocked()) {
                        tile.className += ' unlocked';
                    }
                } else if (tileType === 4) {
                    tile.className += ' exit';
                } else if (tileType === 5) {
                    tile.className += ' key';
                    tile.textContent = '⚷';
                }

                tile.addEventListener('click', () => this.movePlayer(x, y));
                this.gameBoard.appendChild(tile);
            }
        }
    }

    movePlayer(x, y) {
        const dx = Math.abs(x - this.playerPos.x);
        const dy = Math.abs(y - this.playerPos.y);

        if (dx + dy !== 1) {
            this.showMessage('Can only move to adjacent tiles!', 'error');
            return;
        }

        const targetTile = this.levelData.tiles[y][x];

        if (targetTile === 1) {
            this.showMessage('Cannot move through walls!', 'error');
            return;
        }

        if (targetTile === 3 && !this.doorsUnlocked()) {
            this.showMessage('Collect all gems and keys first!', 'error');
            return;
        }

        if (targetTile === 4 && !this.levelComplete()) {
            this.showMessage('Collect all gems first!', 'error');
            return;
        }

        this.playerPos = { x, y };
        this.moves++;

        if (targetTile === 2) {
            this.levelData.tiles[y][x] = 0;
            this.gemsCollected++;
        } else if (targetTile === 5) {
            this.levelData.tiles[y][x] = 0;
            this.keysCollected++;
        } else if (targetTile === 4) {
            this.showMessage('Level Complete! Great job!', 'success');
            this.nextBtn.style.display = 'inline-block';
            return;
        }

        this.updateUI();
        this.renderBoard();
    }

    doorsUnlocked() {
        const required = this.levelData.keysRequired ?? this.levelData.gems;
        return this.keysCollected >= required;
    }

    levelComplete() {
        return this.gemsCollected >= this.levelData.gems;
    }

    handleKeyPress(e) {
        const key = e.key.toLowerCase();
        const { x, y } = this.playerPos;

        switch (key) {
            case 'arrowup':
            case 'w':
                e.preventDefault();
                if (y > 0) this.movePlayer(x, y - 1);
                break;
            case 'arrowdown':
            case 's':
                e.preventDefault();
                if (y < this.levelData.height - 1) this.movePlayer(x, y + 1);
                break;
            case 'arrowleft':
            case 'a':
                e.preventDefault();
                if (x > 0) this.movePlayer(x - 1, y);
                break;
            case 'arrowright':
            case 'd':
                e.preventDefault();
                if (x < this.levelData.width - 1) this.movePlayer(x + 1, y);
                break;
        }
    }

    updateUI() {
        document.getElementById('level').textContent = this.currentLevel;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('gems').textContent = this.levelData.gems - this.gemsCollected;

        const slots = document.querySelectorAll('#keys-grid .inv-slot');
        slots.forEach((slot, i) => {
            if (i < this.keysCollected) {
                slot.textContent = '⚷';
                slot.classList.add('filled');
            } else {
                slot.textContent = '';
                slot.classList.remove('filled');
            }
        });
    }

    showMessage(text, type = 'info') {
        this.messageEl.textContent = text;
        this.messageEl.className = 'message ' + type;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HipsHallenge();
});
