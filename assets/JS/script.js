// Chave para o Local Storage
const LS_LINKS_KEY = 'cofreDeLinks';
const LS_TRASH_KEY = 'cofreDeLinksTrash';
// NOVA CHAVE PARA O TEMA
const LS_THEME_KEY = 'cofreDeLinksTheme';

// Mapeamento de prioridades para ciclo e ordenação
const PRIORITIES = ['low', 'medium', 'high']; 

let links = [];
let trashBin = [];
let linkToDeleteId = null; 
let linkToEditId = null; 
let currentPriority = 'low'; 
let currentFilter = { status: 'all', term: '' };
// VARIÁVEL GLOBAL PARA O TEMA
let currentTheme = 'dark'; // 'dark' (padrão) ou 'light'

// Variável global para o intervalo do timer
let timerInterval = null;

// Utilitário para verificar se a string é uma URL válida
function isURL(str) {
    return /(https?:\/\/[^\s]+|www\.[^\s]+)/gi.test(str);
}

// Função para formatar segundos em MM:SS
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

// =======================================
// NOVAS FUNÇÕES DE TEMA
// =======================================

function loadTheme() {
    const savedTheme = localStorage.getItem(LS_THEME_KEY);
    // Se não houver tema salvo, usa o padrão ('dark')
    currentTheme = savedTheme || 'dark'; 
    applyTheme(currentTheme);
}

function saveTheme(theme) {
    localStorage.setItem(LS_THEME_KEY, theme);
    currentTheme = theme;
}

function applyTheme(theme) {
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (theme === 'light') {
        body.classList.add('light-mode');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = 'Mudar para Modo Escuro 🌙';
        }
    } else {
        body.classList.remove('light-mode');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = 'Mudar para Modo Claro ☀️';
        }
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    saveTheme(newTheme);
    applyTheme(newTheme);
}

// =======================================
// FIM DAS NOVAS FUNÇÕES DE TEMA
// =======================================


document.addEventListener('DOMContentLoaded', () => {

    // ----- 1. PEGAR ELEMENTOS DO HTML (DOM) -----
    
    const linkInput = document.getElementById('link-input');
    const aliasInput = document.getElementById('alias-input'); 
    const timeEstimateInput = document.getElementById('time-estimate-input'); 
    const priorityBtn = document.getElementById('priority-btn');
    const saveButtons = document.querySelectorAll('.save-btn');
    const vaultDisplay = document.getElementById('vault-display'); 
    
    const searchInput = document.getElementById('search-input'); 
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Controles de Export/Import
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    
    const trashDisplay = document.getElementById('trash-list'); 
    const trashModal = document.getElementById('trash-modal'); 
    const openTrashBtn = document.getElementById('open-trash-btn'); 
    const closeModalBtn = document.getElementById('close-modal-btn'); 
    const confirmModal = document.getElementById('confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const closeConfirmModalBtn = document.getElementById('close-confirm-btn'); 
    
    const editTitleModal = document.getElementById('edit-title-modal');
    const newAliasInput = document.getElementById('new-alias-input');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveNewAliasBtn = document.getElementById('save-new-alias-btn');
    const closeEditTitleBtn = document.getElementById('close-edit-title-btn');
    
    const readList = document.getElementById('read-list');
    const watchList = document.getElementById('watch-list');
    const tryList = document.getElementById('try-list');

    // NOVO ELEMENTO DO TEMA
    const themeToggleBtn = document.getElementById('theme-toggle-btn');


    // ----- 2. PERSISTÊNCIA (Local Storage) -----

    function sanitizeLink(link) {
        link.id = parseInt(link.id); 
        link.priority = link.priority || 'low';
        link.currentTimer = link.currentTimer || 0;
        link.timerRunning = link.timerRunning || false;
        link.timerControlsVisible = link.timerControlsVisible || false;
        // Garante que todas as propriedades essenciais existam ao carregar links
        link.category = link.category || 'read'; 
        link.content = link.content || '';
        link.completed = link.completed || false;
        link.isUrl = link.isUrl !== undefined ? link.isUrl : isURL(link.content || '');
        link.title = link.title || link.content;
        link.estimatedTime = link.estimatedTime || '';

        return link;
    }

    function loadLinks() {
        const savedLinks = localStorage.getItem(LS_LINKS_KEY);
        if (savedLinks) { 
            try {
                let parsedLinks = JSON.parse(savedLinks);
                links = parsedLinks.map(sanitizeLink); 
            } catch (e) {
                console.error("Erro ao carregar links salvos, resetando lista.", e);
                links = []; // Resetar se houver erro de parsing
            }
        }
        const savedTrash = localStorage.getItem(LS_TRASH_KEY);
        if (savedTrash) { 
            try {
                let parsedTrash = JSON.parse(savedTrash);
                trashBin = parsedTrash.map(sanitizeLink); 
            } catch (e) {
                console.error("Erro ao carregar lixeira, resetando lixeira.", e);
                trashBin = []; // Resetar se houver erro de parsing
            }
        }

        startGlobalTimer();
    }

    function saveLinks() { localStorage.setItem(LS_LINKS_KEY, JSON.stringify(links)); }
    function saveTrash() { localStorage.setItem(LS_TRASH_KEY, JSON.stringify(trashBin)); }


    // ----- 3. EXPORTAR/IMPORTAR DADOS -----

    function exportLinks() {
        const data = {
            links: links,
            trash: trashBin,
            exportedAt: new Date().toISOString()
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        a.download = `cofre_de_links_backup_${dateString}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importLinks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.links && Array.isArray(importedData.links)) {
                    links = importedData.links.map(sanitizeLink);
                    if (importedData.trash && Array.isArray(importedData.trash)) {
                        trashBin = importedData.trash.map(sanitizeLink);
                    }
                    saveLinks();
                    saveTrash();
                    renderLinks();
                    alert(`Dados importados com sucesso! ${links.length} links carregados.`);
                } else {
                    alert("Erro: O arquivo não parece ser um backup válido do Cofre de Links.");
                }
            } catch (error) {
                console.error("Erro ao importar dados:", error);
                alert("Erro ao processar o arquivo. Verifique se é um JSON válido.");
            }
        };
        reader.readAsText(file);
    }


    // ----- 4. RENDERING E FILTRAGEM -----

    function createListItem(link, actions = true) {
        const li = document.createElement('li');
        li.setAttribute('data-id', link.id); 
        
        if (link.priority === 'high') { li.classList.add('high-priority'); } 
        else if (link.priority === 'medium') { li.classList.add('medium-priority'); } 

        if (link.completed) { li.classList.add('completed'); }
        if (link.timerRunning) { li.classList.add('timer-running'); } 

        let contentHTML = '';
        let timeInfoHTML = ''; 
        let timerControlsInActionsHTML = ''; 

        // CONTEÚDO (Nome/Título)
        if (link.isUrl) {
            contentHTML = `<div class="link-content is-url">
                <a href="${link.content}" target="_blank" rel="noopener noreferrer">${link.title}</a> 
            </div>`;
        } else {
            contentHTML = `<div class="link-content" contenteditable="true" data-type="note">${link.content}</div>`;
        }


        // BLÓCO DE TEMPO ESTÁTICO (Só aparece se estiver rodando OU controles visíveis)
        if (link.timerRunning || link.timerControlsVisible) {
            
            const estimatedDisplay = link.estimatedTime 
                ? `<span class="time-estimate">⏱️ Est: ${link.estimatedTime}</span>` 
                : '';

            const timerDisplay = `
                <span class="timer-display" data-timer-id="${link.id}">
                    ${formatTime(link.currentTimer || 0)}
                </span>
            `;

            timeInfoHTML = `
                <div class="time-info-group">
                    ${estimatedDisplay}${timerDisplay}
                </div>
            `;
            
            // CONTROLES INTERATIVOS (Aparecem APENAS na seção de Ações)
            if (link.timerRunning || link.timerControlsVisible) {
                const isRunning = link.timerRunning;
                
                const timerButton = isRunning 
                    ? `<button class="btn-timer" data-action="pause-timer">⏸️ Pausar</button>`
                    : `<button class="btn-timer" data-action="start-timer">▶️ Iniciar</button>`;
                
                const closeControls = !isRunning 
                    ? `<button class="btn-cancel" data-action="toggle-timer-controls">❌ Fechar</button>` 
                    : '';

                timerControlsInActionsHTML = `
                    ${timerButton}
                    <button class="btn-timer-reset" data-action="reset-timer">↩️ Resetar</button>
                    ${closeControls}
                `;
            } 
        }


        let actionsHTML = '';
        if (actions) {
            const editTitleButton = link.isUrl ? `<button class="btn-edit-title" data-action="edit-title">✏️ Título</button>` : '';
            
            // Botão de Configuração do Timer (Visível se houver dados de tempo E se os controles NÃO estiverem abertos/rodando)
            let configButtonHTML = '';
            if ((link.estimatedTime || link.currentTimer > 0) && !link.timerRunning && !link.timerControlsVisible) {
                configButtonHTML = `<button class="btn-config-timer" data-action="toggle-timer-controls">⚙️ Controles Timer</button>`;
            }


            actionsHTML = `
                <div class="link-actions">
                    ${timerControlsInActionsHTML}
                    ${editTitleButton}
                    <button class="btn-done" data-action="toggle">✅ Concluído</button>
                    <button class="btn-delete" data-action="confirm-delete">🗑️ Excluir</button>
                    ${configButtonHTML} 
                </div>
            `;
        } else {
             actionsHTML = `
                <div class="link-actions">
                    <button class="btn-restore" data-action="restore">↩️ Restaurar</button>
                    <button class="btn-permanent-delete" data-action="permanent-delete">❌ Remover</button>
                </div>
            `;
        }
        
        li.innerHTML = `${contentHTML}${timeInfoHTML}${actionsHTML}`; 
        return li;
    }

    function filterAndSearchLinks() {
        let filtered = links;
        const term = currentFilter.term.toLowerCase();
        const status = currentFilter.status;
        const priorityValue = { 'high': 3, 'medium': 2, 'low': 1 };

        if (status !== 'all') {
            filtered = filtered.filter(link => {
                const isCompleted = link.completed;
                return status === 'done' ? isCompleted : !isCompleted;
            });
        }

        if (term) {
            filtered = filtered.filter(link => 
                link.content.toLowerCase().includes(term) || (link.title && link.title.toLowerCase().includes(term))
            );
        }

        filtered.sort((a, b) => {
            const aPriority = a.priority || 'low'; 
            const bPriority = b.priority || 'low'; 
            
            const pDiff = priorityValue[bPriority] - priorityValue[aPriority];
            if (pDiff !== 0) return pDiff;

            if (a.timerRunning && !b.timerRunning) return -1;
            if (!a.timerRunning && b.timerRunning) return 1;

            return 0;
        });

        return filtered;
    }


    function renderLinks() {
        if (!readList || !watchList || !tryList) return; 

        readList.innerHTML = '';
        watchList.innerHTML = '';
        tryList.innerHTML = '';
        
        const linksToRender = filterAndSearchLinks();

        const listMap = { read: readList, watch: watchList, try: tryList };

        linksToRender.forEach(link => {
            const li = createListItem(link, true);
            
            if (listMap[link.category]) {
                listMap[link.category].appendChild(li);
            }
        });
    }

    function renderTrash() {
        if (!trashDisplay) return;

        trashDisplay.innerHTML = '';
        if (trashBin.length === 0) {
            trashDisplay.innerHTML = '<li class="empty-trash">A lixeira está vazia.</li>';
            return;
        }
        const itemsToDisplay = trashBin.slice(-5).reverse();
        itemsToDisplay.forEach(link => {
            const li = createListItem(link, false); 
            trashDisplay.appendChild(li);
        });
    }


    // ----- 5. AÇÕES PRINCIPAIS (CRUD & EDIÇÃO) e LIXEIRA -----

    function updatePriorityButton() {
        if (!priorityBtn) return; 

        priorityBtn.classList.remove('priority-low', 'priority-medium', 'priority-high');
        priorityBtn.classList.add(`priority-${currentPriority}`);
        
        let displayText = '';
        if (currentPriority === 'high') {
            displayText = 'Prioridade: ALTA (Vermelho) ⭐';
        } else if (currentPriority === 'medium') {
            displayText = 'Prioridade: Média (Azul) 📌';
        } else {
            displayText = 'Prioridade: Baixa (Padrão)';
        }
        priorityBtn.textContent = displayText;
    }

    function togglePriority() {
        const currentIndex = PRIORITIES.indexOf(currentPriority);
        const nextIndex = (currentIndex + 1) % PRIORITIES.length;
        currentPriority = PRIORITIES[nextIndex];
        updatePriorityButton();
    }


    function addLink(category) {
        const content = linkInput.value.trim();
        const alias = aliasInput.value.trim();
        const estimatedTime = timeEstimateInput.value.trim(); 
        
        if (!content) {
            alert("Por favor, cole um link ou digite uma nota.");
            return;
        }

        const isLink = isURL(content);
        let title;

        if (isLink) {
            if (alias.length > 0) {
                title = alias; 
            } else {
                title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
            }
        } else {
            title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        }
        
        const newLink = sanitizeLink({
            id: Date.now(), 
            content: content,
            category: category,
            completed: false,
            priority: currentPriority, 
            isUrl: isLink, 
            title: title,
            estimatedTime: estimatedTime,
            currentTimer: 0, 
            timerRunning: false, 
            timerControlsVisible: false 
        });

        links.push(newLink);
        
        linkInput.value = ''; 
        aliasInput.value = ''; 
        timeEstimateInput.value = ''; 
        currentPriority = 'low'; 
        updatePriorityButton(); 
        saveLinks();
        renderLinks();
    }
    
    function editContent(id, newContent) {
        const linkIndex = links.findIndex(link => link.id === id); 
        if (linkIndex !== -1) {
            const link = links[linkIndex];
            
            if (!link.isUrl) {
                link.content = newContent.trim();
            }
            saveLinks();
        }
    }
    
    function openEditModal(id) {
        const linkIndex = links.findIndex(link => link.id === id); 
        if (linkIndex !== -1) {
            const link = links[linkIndex];
            
            linkToEditId = id; 
            newAliasInput.value = link.title; 
            
            editTitleModal.style.display = 'block';
            newAliasInput.focus();
        }
    }

    function closeEditModal() {
        linkToEditId = null;
        if (editTitleModal) {
             editTitleModal.style.display = 'none';
        }
    }

    function saveNewTitle() {
        if (!linkToEditId) return;

        const newTitle = newAliasInput.value.trim();

        if (newTitle.length === 0) {
            alert("O título não pode ser vazio.");
            return;
        }

        const linkIndex = links.findIndex(link => link.id === linkToEditId);
        if (linkIndex !== -1) {
            links[linkIndex].title = newTitle;
            saveLinks();
            renderLinks();
        }

        closeEditModal();
    }
    

    function toggleDone(id) {
        const linkIndex = links.findIndex(link => link.id === id); 
        if (linkIndex !== -1) {
            links[linkIndex].completed = !links[linkIndex].completed;
            saveLinks();
            renderLinks();
        }
    }
    
    function executeDelete() {
        if (!linkToDeleteId) return; 

        const id = linkToDeleteId; 
        const linkIndex = links.findIndex(link => link.id === id); 
        
        if (linkIndex !== -1) {
            const deletedItem = links.splice(linkIndex, 1)[0]; 
            trashBin.push(deletedItem);

            if (trashBin.length > 10) { trashBin.shift(); }
            
            saveLinks();
            saveTrash();
            renderLinks();
        }
        linkToDeleteId = null;
        if (confirmModal) { confirmModal.style.display = 'none'; }
    }

    function openConfirmModal(id) {
        if (confirmModal) {
            linkToDeleteId = parseInt(id); 
            confirmModal.style.display = 'block';
        } else {
             linkToDeleteId = parseInt(id);
             executeDelete();
        }
    }
    
    function closeConfirmModal() {
        linkToDeleteId = null; 
        if (confirmModal) {
            confirmModal.style.display = 'none';
        }
    }

    function restoreLink(id) {
        const trashIndex = trashBin.findIndex(link => link.id === id); 
        if (trashIndex !== -1) {
            const restoredItem = trashBin.splice(trashIndex, 1)[0];
            restoredItem.completed = false; 
            links.push(restoredItem);
            saveLinks();
            saveTrash();
            renderLinks();
            renderTrash();
        }
    }

    function permanentDeleteLink(id) {
        trashBin = trashBin.filter(link => link.id !== id);
        saveTrash();
        renderTrash();
    }


    // ----- 6. LÓGICA DO TIMER -----

    function updateLinkTimes() {
        let needsSave = false;
        let runningCount = 0;
        
        links.forEach(link => {
            if (link.timerRunning) {
                link.currentTimer++;
                needsSave = true;
                runningCount++;
                
                const timerElement = document.querySelector(`[data-timer-id="${link.id}"]`);
                if (timerElement) {
                    timerElement.textContent = formatTime(link.currentTimer);
                }
            }
        });

        if (needsSave) {
            saveLinks();
        }

        if (runningCount === 0 && timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function startGlobalTimer() {
        if (!timerInterval) {
            timerInterval = setInterval(updateLinkTimes, 1000);
        }
    }

    function startLinkTimer(id) {
        const link = links.find(l => l.id === id); 
        if (link && !link.timerRunning) {
            links.forEach(l => {
                if (l.timerRunning && l.id !== id) {
                    l.timerRunning = false;
                }
            });

            link.timerRunning = true;
            link.timerControlsVisible = true; 
            saveLinks();
            renderLinks(); 
            startGlobalTimer(); 
        }
    }

    function pauseLinkTimer(id) {
        const link = links.find(l => l.id === id);
        if (link) {
            link.timerRunning = false;
            saveLinks();
            renderLinks(); 
        }
    }

    function resetLinkTimer(id) {
        const link = links.find(l => l.id === id);
        if (link) {
            link.timerRunning = false;
            link.currentTimer = 0;
            link.timerControlsVisible = false; 
            saveLinks();
            renderLinks();
        }
    }

    function toggleTimerControls(id) {
        const link = links.find(l => l.id === id);
        if (link && !link.timerRunning) {
            link.timerControlsVisible = !link.timerControlsVisible;
            saveLinks();
            renderLinks();
        } else if (link && link.timerRunning) {
             alert("O timer deve ser pausado antes de fechar o painel de controle.");
        }
    }


    // ----- 7. EVENT LISTENERS -----
    
    if (saveButtons) {
        saveButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const category = event.target.getAttribute('data-category');
                addLink(category);
            });
        });
    }

    if (priorityBtn) { priorityBtn.addEventListener('click', togglePriority); }
    
    // NOVO LISTENER PARA O TEMA
    if (themeToggleBtn) { themeToggleBtn.addEventListener('click', toggleTheme); }
    
    // Listeners de Export/Import
    if (exportBtn) { exportBtn.addEventListener('click', exportLinks); }
    if (importBtn) { importBtn.addEventListener('click', () => importFile.click()); }
    if (importFile) { importFile.addEventListener('change', importLinks); }

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            currentFilter.term = event.target.value;
            renderLinks(); 
        });
    }

    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const newStatus = event.target.getAttribute('data-filter');
                currentFilter.status = newStatus;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                renderLinks(); 
            });
        });
    }

    // Listener de Delegação para as Ações da Lista Principal
    if (vaultDisplay) {
        vaultDisplay.addEventListener('click', (event) => {
            const target = event.target;
            
            const actionElement = target.closest('[data-action]'); 
            if (!actionElement) return;

            const action = actionElement.getAttribute('data-action');
            const listItem = target.closest('li');
            if (!listItem) return; 
            
            const id = parseInt(listItem.getAttribute('data-id')); 
            if (isNaN(id)) return;


            if (action === 'toggle') {
                toggleDone(id); 
            } else if (action === 'confirm-delete') {
                openConfirmModal(id);
            } else if (action === 'edit-title') { 
                openEditModal(id); 
            } else if (action === 'start-timer') { 
                startLinkTimer(id); 
            } else if (action === 'pause-timer') { 
                pauseLinkTimer(id); 
            } else if (action === 'reset-timer') { 
                resetLinkTimer(id); 
            } else if (action === 'toggle-timer-controls') { 
                toggleTimerControls(id); 
            }
        });
    }
    
    if (vaultDisplay) {
        vaultDisplay.addEventListener('blur', (event) => {
            const target = event.target;
            if (target.classList.contains('link-content') && target.getAttribute('contenteditable') === 'true') {
                const newContent = target.textContent;
                const listItem = target.closest('li');
                const id = parseInt(listItem.getAttribute('data-id')); 
                editContent(id, newContent);
            }
        }, true);
    }
    
    if (confirmDeleteBtn && cancelDeleteBtn) { confirmDeleteBtn.addEventListener('click', executeDelete); cancelDeleteBtn.addEventListener('click', closeConfirmModal); }
    if (closeConfirmModalBtn) { closeConfirmModalBtn.addEventListener('click', closeConfirmModal); }

    if (saveNewAliasBtn) { saveNewAliasBtn.addEventListener('click', saveNewTitle); }
    if (cancelEditBtn) { cancelEditBtn.addEventListener('click', closeEditModal); }
    if (closeEditTitleBtn) { closeEditTitleBtn.addEventListener('click', closeEditModal); }

    if (newAliasInput) {
        newAliasInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') { event.preventDefault(); saveNewTitle(); }
        });
    }

    if (openTrashBtn && trashModal) {
        openTrashBtn.addEventListener('click', () => { renderTrash(); trashModal.style.display = 'block'; });
        closeModalBtn.addEventListener('click', () => { trashModal.style.display = 'none'; });
    }

    if (trashModal) {
        trashModal.addEventListener('click', (event) => {
            const target = event.target;
            const action = target.closest('[data-action]'); 
            if (!action) return;

            const actionType = action.getAttribute('data-action');
            const listItem = target.closest('li');
            if (!listItem) return; 
            const id = parseInt(listItem.getAttribute('data-id'));

            if (actionType === 'restore') { restoreLink(id); } 
            else if (actionType === 'permanent-delete') { permanentDeleteLink(id); }
        });
    }

    window.addEventListener('click', (event) => {
        if (trashModal && event.target === trashModal) { trashModal.style.display = 'none'; }
        if (confirmModal && event.target === confirmModal) { closeConfirmModal(); }
        if (editTitleModal && event.target === editTitleModal) { closeEditModal(); }
    });


    // ----- 8. INICIALIZAÇÃO -----
    loadTheme(); // Carrega o tema antes de renderizar qualquer coisa!
    loadLinks();
    
    if (priorityBtn) {
        updatePriorityButton(); 
    }
    
    renderLinks(); 
});