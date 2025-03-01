// ========== MODIFICAÇÃO 1: Adicione esta declaração junto aos outros elementos DOM no início do arquivo ==========
const btnNewDeck = document.getElementById('btnNewDeck');

// ========== MODIFICAÇÃO 2: Adicione este listener junto aos outros listeners no início do arquivo ==========
if (btnNewDeck) btnNewDeck.addEventListener('click', generateNewDeck);

// ========== MODIFICAÇÃO 3: Nova função para gerar novo baralho ==========
async function generateNewDeck() {
  try {
    showLoading('Gerando novo baralho...');
    
    const newDeck = generateDeck();
    await db.ref(`games/${gameCode}/deck`).set(newDeck);
    
    addLog("🎮 Um novo baralho foi gerado pelo organizador!");
    showToast('Novo baralho gerado com sucesso!', 'success');
  } catch (error) {
    console.error("Erro ao gerar novo baralho:", error);
    showToast('Erro ao gerar novo baralho: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

// ========== MODIFICAÇÃO 4: Função aprimorada para mostrar instruções de carta com nome do jogador ==========
function showCardInstruction(role, rank, playerName = '') {
  if (!rank || !cardInstructions[rank]) return;
  
  let instruction = cardInstructions[rank];
  const icon = cardIcons[rank] || 'fa-info-circle';
  
  // Adiciona o nome do jogador no início da instrução
  if (playerName) {
    // Transformar a primeira letra da instrução para minúscula
    const firstLetter = instruction.charAt(0).toLowerCase();
    const restOfText = instruction.slice(1);
    instruction = `${playerName}, ${firstLetter}${restOfText}`;
  }
  
  if (role === 'host') {
    cardInstructionPanel.classList.remove('hidden');
    cardInstructionIcon.innerHTML = `<i class="fas ${icon}"></i>`;
    cardInstructionText.textContent = instruction;
  } else {
    playerCardInstruction.classList.remove('hidden');
    playerCardInstructionIcon.innerHTML = `<i class="fas ${icon}"></i>`;
    playerCardInstructionText.textContent = instruction;
  }
}

// ========== MODIFICAÇÃO 5: Função aprimorada para puxar carta ==========
async function drawCardHost(){
  try {
    showLoading('Puxando carta...');
    
    const snap = await db.ref(`games/${gameCode}`).once('value');
    const gameData = snap.val();
    
    if (!gameData.deck || gameData.deck.length === 0) {
      addLog("❗ O baralho acabou! Você precisa gerar um novo baralho para continuar.");
      showToast('O baralho acabou! Clique em "Gerar Novo Baralho" para continuar.', 'warning');
      hideLoading();
      return;
    }
    
    const card = gameData.deck[0];
    const newDeck = gameData.deck.slice(1);
    
    await handleCardEffect(card, gameData);
    
    await db.ref(`games/${gameCode}`).update({
      deck: newDeck,
      currentCard: card,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
    
    showToast(`Carta puxada: ${card.rank}${card.suit !== 'Coringa' ? (' ' + card.suit) : ''}`, 'success');
  } catch (error) {
    console.error("Erro ao puxar carta:", error);
    showToast('Erro ao puxar carta: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

// ========== MODIFICAÇÃO 6: Função renderHostGame atualizada ==========
// Substitua a parte de atualização do painel de narrativa e do baralho na função renderHostGame:

// Atualiza informações do baralho
if (deckCount) {
  const deckLength = data.deck ? data.deck.length : 0;
  deckCount.textContent = `Cartas restantes: ${deckLength}`;
  
  // Mostra ou esconde o botão de novo baralho com base na quantidade de cartas
  if (btnNewDeck) {
    if (deckLength <= 5) {
      btnNewDeck.style.display = 'block';
      btnNewDeck.classList.add('pulse-animation');
    } else {
      btnNewDeck.style.display = 'none';
      btnNewDeck.classList.remove('pulse-animation');
    }
  }
}

// Atualiza carta atual
if (currentCardHost) {
  if (data.currentCard) {
    currentCardHost.innerHTML = renderCard(data.currentCard.rank, data.currentCard.suit);
    showCardInstruction('host', data.currentCard.rank, currName);
  } else {
    currentCardHost.innerHTML = '<div class="empty-message">Nenhuma carta ainda</div>';
    cardInstructionPanel.classList.add('hidden');
  }
}

// Atualiza logs - Mostra os mais recentes no topo
if (hostPainel) {
  if (data.logs && data.logs.length > 0) {
    // Invertemos a ordem para mostrar os logs mais recentes no topo
    const logsReversed = [...data.logs].reverse(); 
    
    // Destacar visualmente o log mais recente
    const logElements = logsReversed.map((log, index) => {
      if (index === 0) {
        return `<div class="log-item log-newest">${log}</div>`;
      }
      return `<div class="log-item">${log}</div>`;
    });
    
    hostPainel.innerHTML = logElements.join('');
    
    // Garantir que o scroll está no topo
    hostPainel.scrollTop = 0;
  } else {
    hostPainel.innerHTML = '<div class="empty-message">Os eventos do jogo aparecerão aqui...</div>';
  }
}

// ========== MODIFICAÇÃO 7: Função updatePlayerView atualizada ==========
// Substitua a parte de atualização do painel de narrativa e carta na função updatePlayerView:

// Carta Atual
if (currentCardPlayer) {
  if(gameData.currentCard){
    currentCardPlayer.innerHTML = renderCard(gameData.currentCard.rank, gameData.currentCard.suit);
    
    // Se for a vez do jogador atual, personaliza a instrução com "Você"
    const isCurrentPlayer = allKeys[curIdx] === myPlayerKey;
    const nameToShow = isCurrentPlayer ? "Você" : curPlayer.name;
    
    showCardInstruction('player', gameData.currentCard.rank, nameToShow);
  } else {
    currentCardPlayer.innerHTML = '<div class="empty-message">Nenhuma carta ainda</div>';
    playerCardInstruction.classList.add('hidden');
  }
}

// Painel de narrativa (ordem invertida - mais recentes no topo)
if (playerPainel) {
  if(gameData.logs && gameData.logs.length > 0){
    // Invertemos a ordem para mostrar os logs mais recentes no topo
    const logsReversed = [...gameData.logs].reverse();
    
    // Destacar visualmente o log mais recente
    const logElements = logsReversed.map((log, index) => {
      if (index === 0) {
        return `<div class="log-item log-newest">${log}</div>`;
      }
      return `<div class="log-item">${log}</div>`;
    });
    
    playerPainel.innerHTML = logElements.join('');
    
    // Garantir que o scroll está no topo
    playerPainel.scrollTop = 0;
  } else {
    playerPainel.innerHTML = '<div class="empty-message">Os eventos do jogo aparecerão aqui...</div>';
  }
}

// ========== MODIFICAÇÃO 8: Modificar a função handleCardEffect ==========
// Personalize algumas das mensagens na função handleCardEffect (substitua os casos abaixo):

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
    logs.push(`🏷️ "Marca de..." - ${currName} deve colocar uma marca no teclado`);
    // Inclui o nome do jogador no prompt
    const marca = prompt(`${currName}, escolha uma marca para registrar:`);
    if(marca){
      logs.push(`📱 ${currName} escolheu a marca ${marca}`);
    }
    break;
    
  case '5':
    logs.push(`🙅‍♂️ "Eu nunca..." - ${currName} deve falar algo que nunca fez. Quem já fez, bebe!`);
    break;
    
  case '6':
    // Inclui o nome do jogador no prompt
    const newRule = prompt(`${currName}, invente uma nova regra:`);
    if(newRule){
      rules.push(newRule);
      logs.push(`📜 ${currName} inventou a regra: "${newRule}"`);
    }
    break;
}
