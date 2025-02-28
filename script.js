/********** CONFIG DO FIREBASE **********/
const firebaseConfig = {
  apiKey: "AIzaSyBQ5czr0wUqNxyqU9X_WHO3DrHOYEAPf7M",
  authDomain: "opoderdodedo.firebaseapp.com",
  databaseURL: "https://opoderdodedo-default-rtdb.firebaseio.com",
  projectId: "opoderdodedo",
  storageBucket: "opoderdodedo.firebasestorage.app",
  messagingSenderId: "931089125837",
  appId: "1:931089125837:web:fa22ae36bd206f28cf7484",
  measurementId: "G-6YE1KQ0VQC"
};

// Inicialização do Firebase
try {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const storage = firebase.storage();
  console.log("Firebase inicializado com sucesso!");
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
  showToast("Erro ao conectar com o servidor. Tente novamente mais tarde.", "error");
}

// Referências Firebase
const db = firebase.database();
const storage = firebase.storage();

/********** PEGA ELEMENTOS DO DOM (Host e Player) **********/
// Elementos gerais de UI
const mainContainer = document.getElementById('mainContainer');
const gameHeader = document.getElementById('gameHeader');
const userModeIndicator = document.getElementById('userModeIndicator');
const userRoleText = document.getElementById('userRoleText');
const userName = document.getElementById('userName');
const loadingScreen = document.getElementById('loadingScreen');
const toastContainer = document.getElementById('toastContainer');

// Modo Seletor
const modeSelect = document.getElementById('modeSelect');
const btnHost = document.getElementById('btnHost');
const btnPlayer = document.getElementById('btnPlayer');
const btnCopyCode = document.getElementById('btnCopyCode');

// Host
const hostArea = document.getElementById('hostArea');
const hostStep1 = document.getElementById('hostStep1');
const btnCreateGame = document.getElementById('btnCreateGame');
const inputGameCodeHost = document.getElementById('inputGameCodeHost');
const btnJoinGameHost = document.getElementById('btnJoinGameHost');

const hostLobby = document.getElementById('hostLobby');
const hostGame = document.getElementById('hostGame');
const hostGameCode = document.getElementById('hostGameCode');
const qrCodeLobby = document.getElementById('qrCodeLobby');
const qrCodeGame = document.getElementById('qrCodeGame');
const hostLinkInfo = document.getElementById('hostLinkInfo');
const hostPlayersList = document.getElementById('hostPlayersList');
const btnStartGame = document.getElementById('btnStartGame');
const hostStatusPanel = document.getElementById('hostStatusPanel');

// Card instruction panel
const cardInstructionPanel = document.getElementById('cardInstructionPanel');
const cardInstructionIcon = document.getElementById('cardInstructionIcon');
const cardInstructionText = document.getElementById('cardInstructionText');

const btnDrawCard = document.getElementById('btnDrawCard');
const deckCount = document.getElementById('deckCount');
const deckView = document.getElementById('deckView');
const currentCardHost = document.getElementById('currentCardHost');
const hostRules = document.getElementById('hostRules');
const hostPlayersStatus = document.getElementById('hostPlayersStatus');
const hostPainel = document.getElementById('hostPainel');
const hostChat = document.getElementById('hostChat');
const hostChatInput = document.getElementById('hostChatInput');
const btnHostSendChat = document.getElementById('btnHostSendChat');
const btnEndGame = document.getElementById('btnEndGame');
const btnEndFingerPower = document.getElementById('btnEndFingerPower');

// Player
const playerArea = document.getElementById('playerArea');
const playerStep1 = document.getElementById('playerStep1');
const inputGameCodePlayer = document.getElementById('inputGameCodePlayer');
const btnEnterCodePlayer = document.getElementById('btnEnterCodePlayer');

const playerRegister = document.getElementById('playerRegister');
const inputPlayerName = document.getElementById('inputPlayerName');
const btnJoinPlayerGame = document.getElementById('btnJoinPlayerGame');

const playerLobby = document.getElementById('playerLobby');
const playerLobbyList = document.getElementById('playerLobbyList');
const playerGame = document.getElementById('playerGame');
const playerStatusPanel = document.getElementById('playerStatusPanel');

// Player Card instruction
const playerCardInstruction = document.getElementById('playerCardInstruction');
const playerCardInstructionIcon = document.getElementById('playerCardInstructionIcon');
const playerCardInstructionText = document.getElementById('playerCardInstructionText');

const currentCardPlayer = document.getElementById('currentCardPlayer');
const btnDrawCardPlayer = document.getElementById('btnDrawCardPlayer');
const deckCountPlayer = document.getElementById('deckCountPlayer');
const deckViewPlayer = document.getElementById('deckViewPlayer');
const playerRules = document.getElementById('playerRules');
const playerListStatus = document.getElementById('playerListStatus');
const fingerBox = document.getElementById('fingerBox');
const btnFingerClick = document.getElementById('btnFingerClick');
const btnUseJoker = document.getElementById('btnUseJoker');
const btnActivateFinger = document.getElementById('btnActivateFinger');

// Elementos das regras
const rulesInfo = document.getElementById('rulesInfo');
const btnViewRules = document.getElementById('btnViewRules');
const btnShowRules = document.getElementById('btnShowRules');
const btnCloseRules = document.getElementById('btnCloseRules');

/********** VARIÁVEIS GLOBAIS **********/
let gameCode = null;
let myPlayerKey = null;
let playerName = null; // Para armazenar o nome do jogador atual
let isHostMode = false; // Controle do modo de jogo (host ou player)

// Descrições de cada carta para instruções
const cardInstructions = {
  'A': 'Escolha uma pessoa para beber uma dose.',
  '2': 'Distribua duas doses para outras pessoas.',
  '3': 'Distribua três doses para três pessoas diferentes.',
  '4': '"Marca de..." Escolha uma categoria e cada jogador deve falar uma marca dessa categoria até que alguém erre e tenha que beber.',
  '5': '"Eu nunca..." Fale algo que nunca fez. Quem já fez, bebe uma dose.',
  '6': 'Todas as regras são quebradas! O jogo volta ao estado inicial sem regras.',
  '7': 'Você pode quebrar uma regra específica da partida.',
  '8': 'Você ganhou o Poder do Dedo! Pode ativá-lo quando quiser.',
  '9': 'A direção do jogo foi invertida!',
  '10': 'A vez pula um jogador! O próximo jogador é ignorado.',
  'J': 'Você deve beber uma dose!',
  'Q': 'Todas as mulheres bebem uma dose!',
  'K': 'Todos os homens bebem uma dose!',
  'Joker': 'Você ganhou um coringa que pode ser usado para evitar beber!'
};

// Ícones para cada carta
const cardIcons = {
  'A': 'fa-hand-point-right',
  '2': 'fa-share-alt',
  '3': 'fa-users',
  '4': 'fa-tags',
  '5': 'fa-ban',
  '6': 'fa-trash',
  '7': 'fa-scissors',
  '8': 'fa-hand-point-up',
  '9': 'fa-exchange-alt',
  '10': 'fa-forward',
  'J': 'fa-glass-cheers',
  'Q': 'fa-female',
  'K': 'fa-male',
  'Joker': 'fa-star'
};

// Emojis para cada carta (para melhorar a narrativa)
const cardEmojis = {
  'A': '👉',
  '2': '🍻',
  '3': '🥃',
  '4': '🏷️',
  '5': '🙅‍♂️',
  '6': '💥',
  '7': '✂️',
  '8': '👆',
  '9': '🔄',
  '10': '⏭️',
  'J': '🥂',
  'Q': '👩',
  'K': '👨',
  'Joker': '🃏'
};

/********** FUNÇÕES UTILITÁRIAS DE UI **********/
// Mostrar toast de notificação
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Escolha o ícone baseado no tipo de toast
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  else if (type === 'error') icon = 'exclamation-circle';
  else if (type === 'warning') icon = 'exclamation-triangle';
  
  toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  toastContainer.appendChild(toast);
  
  // Adiciona um efeito de fade out antes de remover
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
  
  // Reproduz um som de notificação (opcional)
  playNotificationSound(type);
}

// Sons para notificações
function playNotificationSound(type) {
  // Esta função poderia ser expandida para reproduzir sons diferentes
  // baseados no tipo de notificação
  // Exemplo: const sound = new Audio(`sounds/${type}.mp3`);
  // sound.play();
}

// Mostrar overlay de carregamento
function showLoading(message = 'Conectando ao jogo...') {
  const messageEl = loadingScreen.querySelector('p');
  if (messageEl) messageEl.textContent = message;
  loadingScreen.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Previne rolagem enquanto carrega
}

// Esconder overlay de carregamento
function hideLoading() {
  loadingScreen.classList.add('hidden');
  document.body.style.overflow = ''; // Restaura rolagem
}

// Definir modo e nome do usuário
function setUserMode(mode, name = null) {
  userModeIndicator.classList.remove('hidden');
  isHostMode = (mode === 'host');
  
  if (mode === 'host') {
    userRoleText.textContent = 'Organizador';
    mainContainer.classList.add('organizer-mode');
    mainContainer.classList.remove('player-mode');
  } else {
    userRoleText.textContent = 'Jogador';
    mainContainer.classList.add('player-mode');
    mainContainer.classList.remove('organizer-mode');
  }
  
  if (name) {
    userName.textContent = ': ' + name;
    playerName = name;
  }
}

// Mostrar instruções da carta
function showCardInstruction(role, rank) {
  if (!rank || !cardInstructions[rank]) return;
  
  const instruction = cardInstructions[rank];
  const icon = cardIcons[rank] || 'fa-info-circle';
  
  if (role === 'host') {
    cardInstructionPanel.classList.remove('hidden');
    cardInstructionIcon.innerHTML = `<i class="fas ${icon}"></i>`;
    cardInstructionText.textContent = instruction;
  } else {
    playerCardInstruction.classList.remove('hidden');
    playerCardInstructionIcon.innerHTML = `<i class="fas ${icon}"></i>`;
    playerCardInstructionText.textContent = instruction;
  }
  
  // Auto-esconder após 10 segundos
  setTimeout(() => {
    if (role === 'host') {
      cardInstructionPanel.classList.add('hidden');
    } else {
      playerCardInstruction.classList.add('hidden');
    }
  }, 10000);
}

// Copiar texto para o clipboard
function copyTextToClipboard(text) {
  if (!text) return;
  
  // Use a API Clipboard moderna se disponível
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Código copiado para a área de transferência!', 'success');
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

// Método alternativo para copiar texto
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast('Código copiado para a área de transferência!', 'success');
    } else {
      showToast('Não foi possível copiar o código', 'error');
    }
  } catch (err) {
    console.error('Erro ao copiar texto: ', err);
    showToast('Erro ao copiar o código', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Detectar se a conexão caiu
window.addEventListener('online', () => {
  showToast('Conexão restaurada!', 'success');
});

window.addEventListener('offline', () => {
  showToast('Você está offline. Verifique sua conexão.', 'error');
});

/********** EVENTOS BÁSICOS **********/
document.addEventListener('DOMContentLoaded', () => {
  // Esconde o loading inicial quando a página carregar
  hideLoading();
});

btnHost.onclick = () => {
  modeSelect.classList.add('hidden');
  hostArea.classList.remove('hidden');
  setUserMode('host');
};

btnPlayer.onclick = () => {
  modeSelect.classList.add('hidden');
  playerArea.classList.remove('hidden');
  setUserMode('player');
};

btnCopyCode.onclick = () => {
  copyTextToClipboard(hostGameCode.textContent);
};

// Host
btnCreateGame.onclick = createGameAsHost;
btnJoinGameHost.onclick = joinGameAsHost;
btnStartGame.onclick = startGameHost;
btnDrawCard.onclick = drawCardHost;
btnEndGame.onclick = confirmEndGame;
btnHostSendChat.onclick = sendChatAsHost;
btnEndFingerPower.onclick = finalizeFingerPower;

// Player
btnEnterCodePlayer.onclick = enterCodePlayer;
btnJoinPlayerGame.onclick = registerPlayerInGame;
btnDrawCardPlayer.onclick = drawCardPlayer;
btnUseJoker.onclick = useJokerPlayer;
btnActivateFinger.onclick = activateFingerPower;
btnFingerClick.onclick = fingerClick;
btnPlayerSendChat.onclick = sendChatAsPlayer;

// Enter key para campos de entrada
hostChatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendChatAsHost();
  }
});

playerChatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendChatAsPlayer();
  }
});

inputGameCodeHost.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    joinGameAsHost();
  }
});

inputGameCodePlayer.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    enterCodePlayer();
  }
});

inputPlayerName.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    registerPlayerInGame();
  }
});

// Regras
btnViewRules.onclick = () => {
  modeSelect.classList.add('hidden');
  rulesInfo.classList.remove('hidden');
};

btnShowRules.onclick = () => {
  rulesInfo.classList.remove('hidden');
};

btnCloseRules.onclick = () => {
  rulesInfo.classList.add('hidden');
  if (modeSelect.classList.contains('hidden') && 
      hostArea.classList.contains('hidden') && 
      playerArea.classList.contains('hidden')) {
    modeSelect.classList.remove('hidden');
  }
};

/********** VERIFICAÇÃO INICIAL E RECONNECT **********/
(async function checkLocalStoragePlayer(){
  try {
    const savedId = localStorage.getItem("opoderdedo_gameId");
    const savedKey = localStorage.getItem("opoderdedo_playerKey");
    const savedName = localStorage.getItem("opoderdedo_playerName");
    
    if(savedId && savedKey){
      showLoading('Reconectando ao jogo...');
      
      // Verifica no DB
      const snap = await db.ref(`games/${savedId}/players/${savedKey}`).once('value');
      if(snap.exists()){
        // Reconectar
        gameCode = savedId;
        myPlayerKey = savedKey;
        
        if (savedName) {
          setUserMode('player', savedName);
        }
        
        db.ref(`games/${gameCode}`).on('value', handleGameDataUpdate);
        
        // Ajusta telas
        modeSelect.classList.add('hidden');
        playerArea.classList.remove('hidden');
        playerStep1.classList.add('hidden');
        playerRegister.classList.add('hidden');
        
        showToast('Reconectado com sucesso!', 'success');
      } else {
        clearPlayerCache();
      }
    }
  } catch (error) {
    console.error("Erro ao reconectar:", error);
    showToast('Erro ao reconectar ao jogo', 'error');
    clearPlayerCache();
  } finally {
    hideLoading();
  }
})();

// Manipulador de atualizações de dados do jogo
function handleGameDataUpdate(snapshot) {
  if(!snapshot.exists()) return;
  
  const gameData = snapshot.val();
  
  // Atualiza a visualização dependendo do modo (host ou player)
  if (isHostMode) {
    if(gameData.status === 'lobby'){
      renderHostLobby(gameData);
    } else if(gameData.status === 'ongoing'){
      hostLobby.classList.add('hidden');
      hostGame.classList.remove('hidden');
      renderHostGame(gameData);
    } else if(gameData.status === 'finished'){
      showToast('Partida Encerrada!', 'info');
      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 3000);
    }
  } else {
    updatePlayerView(gameData);
    
    // Se a partida acabou, limpa o cache
    if(gameData.status === 'finished') {
      showToast('A partida foi encerrada!', 'info');
      clearPlayerCache();
    }
  }
}

// Limpa o cache do jogador
function clearPlayerCache() {
  localStorage.removeItem("opoderdedo_gameId");
  localStorage.removeItem("opoderdedo_playerKey");
  localStorage.removeItem("opoderdedo_playerName");
  
  // Volta para a tela inicial quando o jogo acabar ou o jogador for removido
  setTimeout(() => {
    window.location.href = window.location.pathname;
  }, 2000);
}

/********** FUNÇÕES DE HOST **********/
async function createGameAsHost(){
  try {
    showLoading('Criando nova partida...');
    
    gameCode = generateGameCode();
    const deck = generateDeck();
    const initialData = {
      status: 'lobby',
      players: {},
      deck,
      currentCard: null,
      currentPlayerIndex: 0,
      direction: 1,
      rules: [],
      logs: [],
      fingerPower: { active: false, owner: null, queue: []},
      chat: [],
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    await db.ref(`games/${gameCode}`).set(initialData);
    
    showHostLobby(gameCode);
    db.ref(`games/${gameCode}`).on('value', handleGameDataUpdate);
    showToast('Partida criada com sucesso!', 'success');
  } catch (error) {
    console.error("Erro ao criar partida:", error);
    showToast('Erro ao criar partida: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function joinGameAsHost(){
  const code = inputGameCodeHost.value.trim().toUpperCase();
  if (!code) {
    showToast('Digite um código de partida', 'error');
    return;
  }
  
  try {
    showLoading('Conectando à partida...');
    
    const snap = await db.ref(`games/${code}`).once('value');
    if (!snap.exists()) {
      showToast('Partida não encontrada!', 'error');
      return;
    }
    
    const data = snap.val();
    if (data.status === 'finished') {
      showToast('Esta partida já foi encerrada!', 'error');
      return;
    }
    
    gameCode = code;
    showHostLobby(code);
    db.ref(`games/${gameCode}`).on('value', handleGameDataUpdate);
    showToast('Conectado à partida!', 'success');
  } catch (error) {
    console.error("Erro ao entrar na partida:", error);
    showToast('Erro ao entrar na partida: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

function showHostLobby(code){
  hostStep1.classList.add('hidden');
  hostLobby.classList.remove('hidden');
  hostGameCode.textContent = code;
  
  // Gera o QR Code
  qrCodeLobby.innerHTML = '';
  new QRCode(qrCodeLobby, {
    text: location.origin+location.pathname+`?gameId=${code}`, 
    width: 160, 
    height: 160,
    colorDark: "#4361ee",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  
  hostLinkInfo.textContent = `Link: ${location.origin+location.pathname}?gameId=${code}`;
}

function renderHostLobby(data){
  const arr = Object.values(data.players || {});
  
  if (arr.length === 0) {
    hostPlayersList.innerHTML = '<div class="empty-message">Esperando jogadores entrarem...</div>';
  } else {
    hostPlayersList.innerHTML = arr.map(p => 
      `<div class="player-item">
        <i class="fas fa-user"></i> ${p.name}
      </div>`
    ).join('');
  }
  
  // Habilita ou desabilita o botão de iniciar baseado na quantidade de jogadores
  btnStartGame.disabled = arr.length < 2;
  if (arr.length < 2) {
    btnStartGame.classList.add('btn-disabled');
    btnStartGame.innerHTML = '<i class="fas fa-users"></i> Aguardando mais jogadores...';
    btnStartGame.title = 'Necessário pelo menos 2 jogadores';
  } else {
    btnStartGame.classList.remove('btn-disabled');
    btnStartGame.innerHTML = '<i class="fas fa-play"></i> Iniciar Partida';
    btnStartGame.title = 'Clique para iniciar a partida';
  }
}

function startGameHost(){
  db.ref(`games/${gameCode}`).update({
    status: 'ongoing',
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  });
  
  addLog('🎮 A partida foi iniciada!');
  showToast('Partida iniciada!', 'success');
}

function renderHostGame(data){
  const arr = Object.values(data.players || {});
  const currName = arr[data.currentPlayerIndex]?.name || '???';
  
  // Atualiza painel de status
  hostStatusPanel.innerHTML = `
    <i class="fas fa-user-circle status-icon"></i>
    <span class="status-text">É a vez de: <strong>${currName}</strong></span>`;
  
  // Gera QR code
  qrCodeGame.innerHTML = '';
  new QRCode(qrCodeGame, {
    text: location.origin+location.pathname+`?gameId=${gameCode}`,
    width: 120, 
    height: 120,
    colorDark: "#4361ee",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  
  // Atualiza informações do baralho
  deckCount.textContent = `Cartas restantes: ${data.deck ? data.deck.length : 0}`;
  deckView.innerHTML = (data.deck || []).map(() => `<div class="card-back"></div>`).join('');
  
  // Atualiza carta atual
  if (data.currentCard) {
    currentCardHost.innerHTML = renderCard(data.currentCard.rank, data.currentCard.suit);
    showCardInstruction('host', data.currentCard.rank);
  } else {
    currentCardHost.innerHTML = '<div class="empty-message">Nenhuma carta ainda</div>';
    cardInstructionPanel.classList.add('hidden');
  }
  
  // Atualiza regras
  if (data.rules && data.rules.length > 0) {
    hostRules.innerHTML = data.rules.map(r => 
      `<div class="rule-item">
        <i class="fas fa-scroll"></i> ${r}
      </div>`
    ).join('');
  } else {
    hostRules.innerHTML = '<div class="empty-message">Não há regras ativas no momento</div>';
  }
  
  // Atualiza jogadores
  hostPlayersStatus.innerHTML = arr.map((p, i) => {
    const isCurrent = i === data.currentPlayerIndex;
    const playerClass = isCurrent ? 'current-player' : '';
    
    let badges = '';
    
    if (isCurrent) {
      badges += `<span class="player-badge badge-turn"><i class="fas fa-play"></i> Vez</span>`;
    }
    
    if (p.jokers > 0) {
      badges += `<span class="player-badge badge-joker"><i class="fas fa-star"></i> ${p.jokers}</span>`;
    }
    
    if (p.hasFingerPower) {
      badges += `<span class="player-badge badge-finger"><i class="fas fa-hand-point-up"></i></span>`;
    }
    
    return `<div class="${playerClass}">
      <strong><i class="fas fa-user"></i> ${p.name}</strong>
      <div>${badges}</div>
    </div>`;
  }).join('');
  
  // Mostra ou esconde o botão de finalizar o poder do dedo
  const fp = data.fingerPower || {};
  if (fp.active) {
    btnEndFingerPower.style.display = 'inline-block';
  } else {
    btnEndFingerPower.style.display = 'none';
  }
  
  // Atualiza logs
  if (data.logs && data.logs.length > 0) {
    hostPainel.innerHTML = data.logs.map(l => `<div>${l}</div>`).join('');
    hostPainel.scrollTop = hostPainel.scrollHeight;
  } else {
    hostPainel.innerHTML = '<div class="empty-message">Os eventos do jogo aparecerão aqui...</div>';
  }
  
  // Atualiza chat
  if (data.chat && data.chat.length > 0) {
    hostChat.innerHTML = data.chat.map(c => 
      `<div>
        <strong>${c.from}:</strong> ${c.text}
      </div>`
    ).join('');
    hostChat.scrollTop = hostChat.scrollHeight;
  } else {
    hostChat.innerHTML = '<div class="empty-message">As mensagens do chat aparecerão aqui...</div>';
  }
}

async function drawCardHost(){
  try {
    showLoading('Puxando carta...');
    
    const snap = await db.ref(`games/${gameCode}`).once('value');
    const gameData = snap.val();
    
    if (!gameData.deck || gameData.deck.length === 0) {
      addLog("❗ O baralho acabou! Gerando novo baralho...");
      showToast('O baralho acabou! Novo baralho gerado.', 'warning');
      
      // Gera novo baralho
      const newDeck = generateDeck();
      await db.ref(`games/${gameCode}/deck`).set(newDeck);
      
      // Recurse para puxar uma carta do novo baralho
      hideLoading();
      return drawCardHost();
    }
    
    const card = gameData.deck[0];
    const newDeck = gameData.deck.slice(1);
    
    await handleCardEffect(card, gameData);
    
    await db.ref(`games/${gameCode}`).update({
      deck: newDeck,
      currentCard: card,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
    
    showToast(`Carta puxada: ${card.rank}${card.suit !== 'Coringa' ? card.suit : ''}`, 'success');
  } catch (error) {
    console.error("Erro ao puxar carta:", error);
    showToast('Erro ao puxar carta: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

function confirmEndGame() {
  const confirmation = confirm("Tem certeza que deseja encerrar a partida? Todos os jogadores serão desconectados.");
  if (confirmation) {
    endGameHost();
  }
}

function endGameHost() {
  db.ref(`games/${gameCode}`).update({
    status: 'finished',
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  });
  
  addLog("🏁 Partida encerrada pelo organizador!");
  showToast('Partida encerrada', 'info');
}

function sendChatAsHost(){
  const txt = hostChatInput.value.trim();
  if (!txt) return;
  
  hostChatInput.value = '';
  
  db.ref(`games/${gameCode}/chat`).once('value', snap => {
    let arr = snap.val() || [];
    arr.push({
      from: 'ORGANIZADOR',
      text: txt,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    db.ref(`games/${gameCode}/chat`).set(arr);
  });
}

/********** EFEITOS DE CARTA **********/
async function handleCardEffect(card, gameData){
  let logs = gameData.logs || [];
  const arr = Object.values(gameData.players || {});
  const allKeys = Object.keys(gameData.players || {});
  let idx = gameData.currentPlayerIndex;
  let direction = gameData.direction;
  let rules = gameData.rules || [];
  const currName = arr[idx]?.name || '???';
  
  // Emoji correspondente à carta
  const emoji = cardEmojis[card.rank] || '🎮';
  
  // Registra a carta puxada com destaque visual
  logs.push(`${emoji} ${currName} puxou [${card.rank}${card.suit !== 'Coringa' ? card.suit : ''}]`);
  
  let passTurn = true;
  switch(card.rank){
    case 'A':
      logs.push(`🎯 ${currName} deve escolher alguém para beber 1 dose!`);
      break;
      
    case '2':
      logs.push(`🥂 ${currName} deve distribuir 2 doses para outras pessoas!`);
      break;
      
    case '3':
      logs.push(`🍻 ${currName} deve distribuir 3 doses para três pessoas diferentes!`);
      break;
      
    case '4':
      logs.push(`🏷️ "Marca de..." - ${currName} escolhe uma categoria`);
      const newRule = prompt("Nova regra? (Marca de...)");
      if(newRule){
        rules.push(newRule);
        logs.push(`📜 Regra adicionada: "${newRule}"`);
      }
      break;
      
    case '5':
      logs.push(`🙅‍♂️ "Eu nunca..." - ${currName} deve falar algo que nunca fez. Quem já fez, bebe!`);
      break;
      
    case '6':
      rules = [];
      logs.push("💥 Todas as regras foram quebradas!");
      break;
      
    case '7':
      if(rules.length > 0) {
        let ruleIndex = 0;
        
        if (rules.length > 1) {
          const selectedRule = prompt(`Qual regra deseja quebrar? (1-${rules.length})\n\n${rules.map((r, i) => `${i+1}. ${r}`).join('\n')}`);
          ruleIndex = parseInt(selectedRule) - 1 || 0;
        }
        
        if(ruleIndex >= 0 && ruleIndex < rules.length) {
          const removedRule = rules[ruleIndex];
          rules.splice(ruleIndex, 1);
          logs.push(`✂️ ${currName} quebrou a regra: "${removedRule}"`);
        }
      } else {
        logs.push(`❌ ${currName} tentou quebrar uma regra, mas não há regras ativas!`);
      }
      break;
      
    case '8':
      const pKey = allKeys[idx];
      if(pKey){
        await db.ref(`games/${gameCode}/players/${pKey}/hasFingerPower`).set(true);
        logs.push(`👆 ${currName} obteve o Poder do Dedo!`);
      }
      break;
      
    case '9':
      direction *= -1;
      logs.push("🔄 O sentido do jogo foi invertido!");
      break;
      
    case '10':
      passTurn = false;
      logs.push(`⏭️ A carta 10 faz pular um jogador!`);
      setTimeout(() => {
        let ni = idx + direction;
        if(ni < 0) ni = arr.length - 1;
        if(ni >= arr.length) ni = 0;
        ni += direction;
        if(ni < 0) ni = arr.length - 1;
        if(ni >= arr.length) ni = 0;
        
        const nextPlayerName = arr[ni]?.name || '???';
        logs.push(`➡️ Pulou um jogador. Agora é a vez de ${nextPlayerName}`);
        
        db.ref(`games/${gameCode}`).update({
          currentPlayerIndex: ni, 
          direction, 
          rules, 
          logs,
          updatedAt: firebase.database.ServerValue.TIMESTAMP
        });
      }, 1000);
      break;
      
    case 'J':
      logs.push(`🥃 ${currName} deve beber 1 dose!`);
      await sendDrinkAlert(idx, gameData);
      break;
      
    case 'Q':
      logs.push("👩 Todas as mulheres bebem 1 dose!");
      // Implementação futura: poderíamos adicionar um campo de gênero para cada jogador
      // e enviar alertas de bebida apenas para jogadoras mulheres
      break;
      
    case 'K':
      logs.push("👨 Todos os homens bebem 1 dose!");
      // Implementação futura: poderíamos adicionar um campo de gênero para cada jogador
      // e enviar alertas de bebida apenas para jogadores homens
      break;
      
    case 'Joker':
      // coringa
      const jkKey = allKeys[idx];
      if(jkKey){
        const oldVal = arr[idx].jokers || 0;
        await db.ref(`games/${gameCode}/players/${jkKey}/jokers`).set(oldVal + 1);
        logs.push(`🃏 ${currName} ganhou 1 Coringa para usar quando precisar!`);
      }
      break;
      
    default:
      logs.push(`ℹ️ Carta sem efeito especial.`);
  }
  
  if(passTurn && card.rank !== '10'){
    let ni = idx + direction;
    if(ni < 0) ni = arr.length - 1;
    if(ni >= arr.length) ni = 0;
    
    const nextPlayerName = arr[ni]?.name || '???';
    logs.push(`➡️ Próximo: é a vez de ${nextPlayerName}`);
    
    await db.ref(`games/${gameCode}`).update({
      currentPlayerIndex: ni, 
      direction, 
      rules, 
      logs,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  } else if (card.rank !== '10') { // Para outros casos que não pular turnos
    await db.ref(`games/${gameCode}`).update({ 
      direction, 
      rules, 
      logs,
      updatedAt: firebase.database.ServerValue.TIMESTAMP 
    });
  }
}

async function sendDrinkAlert(playerIndex, gameData){
  const pKey = Object.keys(gameData.players || {})[playerIndex];
  if(!pKey) return;
  
  try {
    await db.ref(`games/${gameCode}/players/${pKey}/needsToDrink`).set(Date.now());
  } catch (error) {
    console.error("Erro ao enviar alerta de bebida:", error);
  }
}

// Função para finalizar o poder do dedo
async function finalizeFingerPower() {
  try {
    const snap = await db.ref(`games/${gameCode}/fingerPower`).once('value');
    const fp = snap.val();
    
    if(!fp || !fp.queue || fp.queue.length === 0) {
      showToast('Ninguém ativou o poder do dedo ainda', 'info');
      return;
    }
    
    const last = fp.queue[fp.queue.length - 1];
    addLog(`🍺 O último a clicar foi ${last.name}, beba!`);
    
    await db.ref(`games/${gameCode}/players/${last.playerKey}/needsToDrink`).set(Date.now());
    await db.ref(`games/${gameCode}/fingerPower`).update({
      active: false, 
      queue: [],
      lastWinner: fp.queue[0]?.name || null,
      lastLoser: last.name,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    showToast(`${last.name} foi o último e deve beber!`, 'info');
  } catch (error) {
    console.error("Erro ao finalizar poder do dedo:", error);
    showToast('Erro ao finalizar o poder do dedo', 'error');
  }
}

/********** MODO JOGADOR **********/
(function checkUrlForGameId(){
  const params = new URLSearchParams(location.search);
  if(params.has('gameId')){
    const code = params.get('gameId');
    if(code){
      modeSelect.classList.add('hidden');
      playerArea.classList.remove('hidden');
      inputGameCodePlayer.value = code;
      enterCodePlayer();
    }
  }
})();

function enterCodePlayer(){
  const code = inputGameCodePlayer.value.trim().toUpperCase();
  if(!code) {
    showToast('Digite um código de partida', 'error');
    return;
  }
  
  showLoading('Verificando partida...');
  
  db.ref(`games/${code}`).once('value', snap => {
    hideLoading();
    
    if(!snap.exists()){
      showToast('Partida não encontrada!', 'error');
      return;
    }
    
    const data = snap.val();
    if(data.status === 'finished') {
      showToast('Esta partida já foi encerrada!', 'error');
      return;
    }
    
    gameCode = code;
    playerStep1.classList.add('hidden');
    playerRegister.classList.remove('hidden');
    
    showToast('Partida encontrada!', 'success');
  });
}

async function registerPlayerInGame(){
  const name = inputPlayerName.value.trim();
  if(!name) {
    showToast('Digite seu nome!', 'error');
    return;
  }
  
  try {
    showLoading('Entrando na partida...');
    
    // Verifica se o nome já existe
    const playersSnap = await db.ref(`games/${gameCode}/players`).once('value');
    const players = playersSnap.val() || {};
    
    const nameExists = Object.values(players).some(p => 
      p.name.toLowerCase() === name.toLowerCase()
    );
    
    if (nameExists) {
      showToast('Esse nome já está sendo usado. Escolha outro.', 'error');
      hideLoading();
      return;
    }
    
    // Cria player
    const ref = db.ref(`games/${gameCode}/players`).push();
    myPlayerKey = ref.key;
    
    await ref.set({
      name, 
      jokers: 0,
      hasFingerPower: false,
      joinedAt: firebase.database.ServerValue.TIMESTAMP
    });
    
    localStorage.setItem("opoderdedo_gameId", gameCode);
    localStorage.setItem("opoderdedo_playerKey", myPlayerKey);
    localStorage.setItem("opoderdedo_playerName", name);
    
    setUserMode('player', name);
    
    db.ref(`games/${gameCode}`).on('value', handleGameDataUpdate);
    
    playerRegister.classList.add('hidden');
    showToast('Você entrou na partida!', 'success');
    
    // Avisa que entrou
    addLog(`👋 ${name} entrou no jogo!`);
    
  } catch (error) {
    console.error("Erro ao registrar jogador:", error);
    showToast('Erro ao entrar na partida: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

function updatePlayerView(gameData){
  if(gameData.status === 'lobby'){
    playerLobby.classList.remove('hidden');
    playerGame.classList.add('hidden');
    
    const arr = Object.values(gameData.players || {});
    
    if (arr.length === 0) {
      playerLobbyList.innerHTML = '<div class="empty-message">Você é o primeiro jogador!</div>';
    } else {
      playerLobbyList.innerHTML = arr.map(p => 
        `<div class="player-item">
          <i class="fas fa-user"></i> ${p.name}${p.name === playerName ? ' (Você)' : ''}
        </div>`
      ).join('');
    }
  }
  else if(gameData.status === 'ongoing'){
    playerLobby.classList.add('hidden');
    playerGame.classList.remove('hidden');
    
    const pObj = gameData.players?.[myPlayerKey];
    if(!pObj){
      playerStatusPanel.innerHTML = `
        <i class="fas fa-exclamation-triangle status-icon"></i>
        <span class="status-text">Você não está no jogo!</span>`;
      showToast('Você foi removido do jogo', 'error');
      return;
    }
    
    // Info do player
    playerStatusPanel.classList.remove('hidden');
    
    // Jogadores
    const arr = Object.values(gameData.players || {});
    playerListStatus.innerHTML = arr.map((pp, i) => {
      const isCurrentPlayer = i === gameData.currentPlayerIndex;
      const playerClass = isCurrentPlayer ? 'current-player' : '';
      const isMe = pp.name === playerName;
      
      let badges = '';
      
      if (isCurrentPlayer) {
        badges += `<span class="player-badge badge-turn"><i class="fas fa-play"></i> Vez</span>`;
      }
      
      if (pp.jokers > 0) {
        badges += `<span class="player-badge badge-joker"><i class="fas fa-star"></i> ${pp.jokers}</span>`;
      }
      
      if (pp.hasFingerPower) {
        badges += `<span class="player-badge badge-finger"><i class="fas fa-hand-point-up"></i></span>`;
      }
      
      return `<div class="${playerClass}">
        <strong><i class="fas fa-user"></i> ${pp.name}${isMe ? ' (Você)' : ''}</strong>
        <div>${badges}</div>
      </div>`;
    }).join('');
    
    // Deck
    deckCountPlayer.textContent = `Cartas restantes: ${gameData.deck ? gameData.deck.length : 0}`;
    deckViewPlayer.innerHTML = (gameData.deck || []).map(() => `<div class="card-back"></div>`).join('');
    
    // Quem é o atual
    const allKeys = Object.keys(gameData.players || {});
    const curIdx = gameData.currentPlayerIndex;
    const curKey = allKeys[curIdx];
    
    if(curKey === myPlayerKey){
      // é minha vez
      playerStatusPanel.innerHTML = `
        <i class="fas fa-user-circle status-icon"></i>
        <span class="status-text">É A SUA VEZ!</span>`;
      playerStatusPanel.classList.add('your-turn');
      btnDrawCardPlayer.style.display = 'inline-block';
    } else {
      playerStatusPanel.classList.remove('your-turn');
      const arr2 = Object.values(gameData.players || {});
      const cName = arr2[curIdx]?.name || '???';
      playerStatusPanel.innerHTML = `
        <i class="fas fa-user-circle status-icon"></i>
        <span class="status-text">É a vez de: <strong>${cName}</strong></span>`;
      btnDrawCardPlayer.style.display = 'none';
    }
    
    // Carta Atual
    if(gameData.currentCard){
      currentCardPlayer.innerHTML = renderCard(gameData.currentCard.rank, gameData.currentCard.suit);
      showCardInstruction('player', gameData.currentCard.rank);
    } else {
      currentCardPlayer.innerHTML = '<div class="empty-message">Nenhuma carta ainda</div>';
      playerCardInstruction.classList.add('hidden');
    }
    
    // Regras
    if(gameData.rules && gameData.rules.length > 0){
      playerRules.innerHTML = gameData.rules.map(r => 
        `<div class="rule-item">
          <i class="fas fa-scroll"></i> ${r}
        </div>`
      ).join('');
    } else {
      playerRules.innerHTML = '<div class="empty-message">Não há regras ativas no momento</div>';
    }
    
    // Jogador tem finger?
    btnActivateFinger.style.display = pObj.hasFingerPower ? 'inline-block' : 'none';
    if (pObj.hasFingerPower) {
      btnActivateFinger.classList.add('pulse-animation');
    } else {
      btnActivateFinger.classList.remove('pulse-animation');
    }
    
    // Jogador tem coringa?
    btnUseJoker.style.display = (pObj.jokers > 0) ? 'inline-block' : 'none';
    
    // Finger Power Global
    const fp = gameData.fingerPower || {};
    if(fp.active){
      fingerBox.classList.remove('hidden');
      const found = (fp.queue || []).find(x => x.playerKey === myPlayerKey);
      
      if(found){
        btnFingerClick.disabled = true;
        btnFingerClick.classList.remove('pulse-animation');
        btnFingerClick.innerHTML = '<i class="fas fa-check"></i> Você já clicou!';
      } else {
        btnFingerClick.disabled = false;
        btnFingerClick.classList.add('pulse-animation');
        btnFingerClick.innerHTML = '<i class="fas fa-hand-point-up"></i> CLIQUE AGORA!';
      }
      
      fingerQueue.innerHTML = (fp.queue || []).map((x, i) => `${i + 1}º: ${x.name}`).join('<br>');
    } else {
      fingerBox.classList.add('hidden');
    }
    
    // Painel de narrativa (ordem invertida - mais recentes no topo)
    if(gameData.logs && gameData.logs.length > 0){
      // Inverte a ordem dos logs para mostrar do mais recente para o mais antigo
      const logsReversed = [...gameData.logs].reverse();
      playerPainel.innerHTML = logsReversed.map(l => `<div>${l}</div>`).join('');
      
      // Garantir que o scroll está no topo quando invertido
      playerPainel.scrollTop = 0;
    } else {
      playerPainel.innerHTML = '<div class="empty-message">Os eventos do jogo aparecerão aqui...</div>';
    }
    
    // Chat
    if(gameData.chat && gameData.chat.length > 0){
      playerChat.innerHTML = gameData.chat.map(c => 
        `<div>
          <strong>${c.from}:</strong> ${c.text}
        </div>`
      ).join('');
      playerChat.scrollTop = playerChat.scrollHeight;
    } else {
      playerChat.innerHTML = '<div class="empty-message">As mensagens do chat aparecerão aqui...</div>';
    }
    
    // Needs to Drink?
    if(pObj.needsToDrink){
      showToast('Você precisa beber uma dose! 🍻', 'warning', 5000);
      db.ref(`games/${gameCode}/players/${myPlayerKey}/needsToDrink`).remove();
    }
  }
  else if(gameData.status === 'finished'){
    showToast('Partida Encerrada!', 'info');
    clearPlayerCache();
  }
}

async function drawCardPlayer(){
  try {
    showLoading('Puxando carta...');
    
    const snap = await db.ref(`games/${gameCode}`).once('value');
    const data = snap.val();
    
    if(!data) {
      showToast('Erro ao puxar carta: partida não encontrada', 'error');
      return;
    }
    
    const allKeys = Object.keys(data.players || {});
    if(allKeys[data.currentPlayerIndex] !== myPlayerKey){
      showToast('Não é sua vez de puxar carta!', 'error');
      return;
    }
    
    if(!data.deck || data.deck.length === 0){
      addLog("❗ O baralho acabou!");
      showToast('O baralho acabou!', 'warning');
      return;
    }
    
    const card = data.deck[0];
    const newDeck = data.deck.slice(1);
    
    await handleCardEffect(card, data);
    
    await db.ref(`games/${gameCode}`).update({
      deck: newDeck, 
      currentCard: card,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
    
    showToast(`Carta puxada: ${card.rank}${card.suit !== 'Coringa' ? card.suit : ''}`, 'success');
  } catch (error) {
    console.error("Erro ao puxar carta:", error);
    showToast('Erro ao puxar carta: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

/********** CORINGA, PODER DEDO **********/
async function useJokerPlayer(){
  try {
    const snap = await db.ref(`games/${gameCode}/players/${myPlayerKey}`).once('value');
    const p = snap.val();
    
    if(!p) {
      showToast('Erro ao usar coringa: jogador não encontrado', 'error');
      return;
    }
    
    if(p.jokers > 0){
      await db.ref(`games/${gameCode}/players/${myPlayerKey}/jokers`).set(p.jokers - 1);
      addLog(`🌟 ${p.name} usou 1 Coringa para não beber!`);
      showToast('Você usou um coringa!', 'success');
    } else {
      showToast('Você não tem coringas para usar!', 'error');
    }
  } catch (error) {
    console.error("Erro ao usar coringa:", error);
    showToast('Erro ao usar coringa: ' + error.message, 'error');
  }
}

async function activateFingerPower(){
  try {
    const name = localStorage.getItem("opoderdedo_playerName") || 'Jogador';
    
    await db.ref(`games/${gameCode}/fingerPower`).set({
      active: true, 
      owner: myPlayerKey,
      queue: [{playerKey: myPlayerKey, name}],
      activatedAt: firebase.database.ServerValue.TIMESTAMP
    });
    
    await db.ref(`games/${gameCode}/players/${myPlayerKey}/hasFingerPower`).set(false);
    addLog(`👆 ${name} ativou o Poder do Dedo! Seja rápido para não ser o último!`);
    
    showToast('Você ativou o Poder do Dedo!', 'success');
  } catch (error) {
    console.error("Erro ao ativar poder do dedo:", error);
    showToast('Erro ao ativar poder do dedo: ' + error.message, 'error');
  }
}

async function fingerClick(){
  try {
    const snap = await db.ref(`games/${gameCode}/fingerPower/queue`).once('value');
    let arr = snap.val() || [];
    
    if(arr.find(x => x.playerKey === myPlayerKey)) {
      showToast('Você já clicou!', 'info');
      return;
    }
    
    const name = localStorage.getItem("opoderdedo_playerName") || 'Jogador';
    arr.push({playerKey: myPlayerKey, name, clickedAt: firebase.database.ServerValue.TIMESTAMP});
    
    await db.ref(`games/${gameCode}/fingerPower/queue`).set(arr);
    showToast('Você clicou!', 'success');
  } catch (error) {
    console.error("Erro ao clicar no poder do dedo:", error);
    showToast('Erro ao registrar seu clique: ' + error.message, 'error');
  }
}

/********** CHAT (PLAYER) **********/
function sendChatAsPlayer(){
  const txt = playerChatInput.value.trim();
  if(!txt) return;
  
  playerChatInput.value = '';
  
  db.ref(`games/${gameCode}/chat`).once('value', snap => {
    let arr = snap.val() || [];
    const name = localStorage.getItem("opoderdedo_playerName") || 'Jogador';
    
    arr.push({
      from: name, 
      text: txt, 
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    db.ref(`games/${gameCode}/chat`).set(arr);
  });
}

/********** LOG HELPER **********/
async function addLog(msg){
  try {
    const snap = await db.ref(`games/${gameCode}/logs`).once('value');
    let arr = snap.val() || [];
    
    // Limitar a 100 logs para não sobrecarregar
    if (arr.length > 100) {
      arr = arr.slice(arr.length - 99);
    }
    
    arr.push(msg);
    
    await db.ref(`games/${gameCode}/logs`).set(arr);
  } catch (error) {
    console.error("Erro ao adicionar log:", error);
  }
}

/********** GERA CODE E BARALHO **********/
function generateGameCode(){
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateDeck(){
  const suits = ["♥", "♦", "♣", "♠"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let deck = [];
  
  for(let s of suits){
    for(let r of ranks){
      deck.push({rank: r, suit: s});
    }
  }
  
  // Adiciona 3 coringas
  for(let i = 0; i < 3; i++){
    deck.push({rank: 'Joker', suit: 'Coringa'});
  }
  
  // Embaralha as cartas
  shuffleDeck(deck);
  
  return deck;
}

// Algoritmo Fisher-Yates para embaralhar
function shuffleDeck(deck) {
  for(let i = deck.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function renderCard(rank, suit){
  if(rank === 'Joker'){
    return `
      <div class="card-front highlight-card" style="background: linear-gradient(45deg, #ffd700, #ffec8b);">
        <div style="position:absolute; top:40%; left:50%; transform:translate(-50%,-50%); font-size:1.2rem; color:#000; font-weight:bold; text-align:center;">
          <i class="fas fa-star" style="color:#B8860B; font-size:1.5rem; margin-bottom:5px;"></i><br>
          CORINGA
        </div>
      </div>
    `;
  }
  
  const isRed = (suit === '♥' || suit === '♦');
  
  return `
    <div class="card-front highlight-card">
      <div class="card-rank-suit ${isRed ? 'red' : 'black'}">
        ${rank}${suit}
      </div>
      <div style="position:absolute; bottom:8px; right:8px; font-size:1.4rem; font-weight:bold;" class="${isRed ? 'red' : 'black'}">
        ${rank}${suit}
      </div>
    </div>
  `;
}

// Verificar saúde da conexão com o Firebase
setInterval(() => {
  if (gameCode) {
    db.ref('.info/connected').once('value', snapshot => {
      const connected = snapshot.val();
      if (!connected) {
        showToast('Problema de conexão com o servidor. Reconectando...', 'warning');
      }
    });
  }
}, 60000); // Verificar a cada minuto