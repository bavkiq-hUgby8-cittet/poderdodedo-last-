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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

/********** PEGA ELEMENTOS DO DOM (Host e Player) **********/
const modeSelect = document.getElementById('modeSelect');
const btnHost = document.getElementById('btnHost');
const btnPlayer = document.getElementById('btnPlayer');

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
const btnRecordVideo = document.getElementById('btnRecordVideo');
const playerPainel = document.getElementById('playerPainel');
const playerChat = document.getElementById('playerChat');
const playerChatInput = document.getElementById('playerChatInput');
const btnPlayerSendChat = document.getElementById('btnPlayerSendChat');

const videoOverlay = document.getElementById('videoOverlay');
const videoPreview = document.getElementById('videoPreview');
const btnStartRecording = document.getElementById('btnStartRecording');
const btnStopRecording = document.getElementById('btnStopRecording');
const btnCloseVideoOverlay = document.getElementById('btnCloseVideoOverlay');

/********** VARIÁVEIS GLOBAIS **********/
let gameCode = null;
let myPlayerKey = null;
let localCameraStream = null;
let mediaRecorder = null;
let recordedChunks = [];

// Elementos das regras
const rulesInfo = document.getElementById('rulesInfo');
const btnViewRules = document.getElementById('btnViewRules');
const btnShowRules = document.getElementById('btnShowRules');
const btnCloseRules = document.getElementById('btnCloseRules');

/********** EVENTOS BÁSICOS **********/
btnHost.onclick = () => {
  modeSelect.classList.add('hidden');
  hostArea.classList.remove('hidden');
};
btnPlayer.onclick = () => {
  modeSelect.classList.add('hidden');
  playerArea.classList.remove('hidden');
};

// Host
btnCreateGame.onclick = createGameAsHost;
btnJoinGameHost.onclick = joinGameAsHost;
btnStartGame.onclick = startGameHost;
btnDrawCard.onclick = drawCardHost;
btnEndGame.onclick = endGameHost;
btnHostSendChat.onclick = sendChatAsHost;
btnEndFingerPower.onclick = finalizeFingerPower;

// Player
btnEnterCodePlayer.onclick = enterCodePlayer;
btnJoinPlayerGame.onclick = registerPlayerInGame;
btnDrawCardPlayer.onclick = drawCardPlayer;
btnUseJoker.onclick = useJokerPlayer;
btnActivateFinger.onclick = activateFingerPower;
btnFingerClick.onclick = fingerClick;
btnRecordVideo.onclick = ()=>videoOverlay.style.display='flex';
btnCloseVideoOverlay.onclick = closeVideoOverlay;
btnStartRecording.onclick = startVideoRecording;
btnStopRecording.onclick = stopVideoRecording;
btnPlayerSendChat.onclick = sendChatAsPlayer;

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

/********** CHECK LOCALSTORAGE DO PLAYER **********/
(async function checkLocalStoragePlayer(){
  const savedId = localStorage.getItem("opoderdedo_gameId");
  const savedKey= localStorage.getItem("opoderdedo_playerKey");
  if(savedId && savedKey){
    // Verifica no DB
    const snap = await db.ref(`games/${savedId}/players/${savedKey}`).once('value');
    if(snap.exists()){
      // Reconectar
      gameCode = savedId;
      myPlayerKey = savedKey;
      db.ref(`games/${gameCode}`).on('value', s=>{
        if(!s.exists())return;
        const gameData = s.val();
        updatePlayerView(gameData);
        
        // Se a partida acabou, limpa o cache
        if(gameData.status === 'finished') {
          clearPlayerCache();
        }
      });
      // Ajusta telas
      modeSelect.classList.add('hidden');
      playerArea.classList.remove('hidden');
      playerStep1.classList.add('hidden');
      playerRegister.classList.add('hidden');
    } else {
      clearPlayerCache();
    }
  }
})();

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
  gameCode = generateGameCode();
  const deck = generateDeck();
  const initialData = {
    status:'lobby',
    players:{},
    deck,
    currentCard:null,
    currentPlayerIndex:0,
    direction:1,
    rules:[],
    logs:[],
    fingerPower:{ active:false, owner:null, queue:[]},
    chat:[]
  };
  await db.ref(`games/${gameCode}`).set(initialData);

  showHostLobby(gameCode);
  subscribeHost(gameCode);
}
async function joinGameAsHost(){
  const code = inputGameCodeHost.value.trim();
  if(!code)return alert("Digite um código!");
  const snap = await db.ref(`games/${code}`).once('value');
  if(!snap.exists()){
    alert("Partida não encontrada!");
    return;
  }
  gameCode=code;
  showHostLobby(code);
  subscribeHost(code);
}
function showHostLobby(code){
  hostStep1.classList.add('hidden');
  hostLobby.classList.remove('hidden');
  hostGameCode.textContent=code;
  qrCodeLobby.innerHTML='';
  new QRCode(qrCodeLobby,{text: location.origin+location.pathname+`?gameId=${code}`, width:160, height:160});
  hostLinkInfo.textContent=`Link: ${location.origin+location.pathname}?gameId=${code}`;
}
function subscribeHost(code){
  db.ref(`games/${code}`).on('value', snap=>{
    if(!snap.exists())return;
    const data = snap.val();
    if(data.status==='lobby'){
      renderHostLobby(data);
    } else if(data.status==='ongoing'){
      hostLobby.classList.add('hidden');
      hostGame.classList.remove('hidden');
      renderHostGame(data);
    } else if(data.status==='finished'){
      alert("Partida Encerrada!");
      // Se quiser limpar o host também:
      // window.location.href = window.location.pathname;
    }
  });
}
function renderHostLobby(data){
  const arr = Object.values(data.players||{});
  hostPlayersList.innerHTML=arr.map(p=>`<div>${p.name}</div>`).join('');
}
function startGameHost(){
  db.ref(`games/${gameCode}`).update({status:'ongoing'});
}
function renderHostGame(data){
  const arr = Object.values(data.players||{});
  const currName = arr[data.currentPlayerIndex]?.name||'???';
  hostStatusPanel.textContent= `É a vez de: ${currName}`;

  qrCodeGame.innerHTML='';
  new QRCode(qrCodeGame,{
    text: location.origin+location.pathname+`?gameId=${gameCode}`,
    width:120, 
    height:120
  });

  deckCount.textContent= `Restantes: ${data.deck? data.deck.length:0}`;
  deckView.innerHTML= (data.deck||[]).map(()=>`<div class="card-back"></div>`).join('');

  if(data.currentCard){
    currentCardHost.innerHTML= renderCard(data.currentCard.rank, data.currentCard.suit);
  }else{
    currentCardHost.textContent="Nenhuma";
  }

  if(data.rules && data.rules.length>0){
    hostRules.innerHTML= data.rules.map(r=>`<div class="rule-item">${r}</div>`).join('');
  }else{
    hostRules.textContent="Nenhuma";
  }

  hostPlayersStatus.innerHTML= arr.map((p,i)=>{
    const isCurrent= (i===data.currentPlayerIndex)?' (Vez)':'';
    const coringas= p.jokers>0? ` [Coringas: ${p.jokers}]`:'';
    const fingerPower = p.hasFingerPower ? ' [Tem Poder do Dedo]' : '';
    return `<div><strong>${p.name}</strong>${isCurrent}${coringas}${fingerPower}</div>`;
  }).join('');

  // Mostra ou esconde o botão de finalizar o poder do dedo
  const fp = data.fingerPower || {};
  if(fp.active){
    btnEndFingerPower.style.display = 'inline-block';
  } else {
    btnEndFingerPower.style.display = 'none';
  }

  if(data.logs){
    hostPainel.innerHTML= data.logs.map(l=>`<div>${l}</div>`).join('');
    hostPainel.scrollTop= hostPainel.scrollHeight;
  }
  if(data.chat){
    hostChat.innerHTML= data.chat.map(c=>`<div><strong>${c.from}:</strong> ${c.text}</div>`).join('');
    hostChat.scrollTop= hostChat.scrollHeight;
  }
}
async function drawCardHost(){
  const snap= await db.ref(`games/${gameCode}`).once('value');
  const gameData= snap.val();
  if(!gameData.deck || gameData.deck.length===0){
    addLog("Baralho acabou!");
    return;
  }
  const card= gameData.deck[0];
  const newDeck= gameData.deck.slice(1);
  handleCardEffect(card, gameData);
  await db.ref(`games/${gameCode}`).update({
    deck:newDeck,
    currentCard:card
  });
}
function endGameHost(){
  if(confirm("Tem certeza que deseja encerrar a partida?")) {
    db.ref(`games/${gameCode}`).update({status:'finished'});
    addLog("Partida encerrada pelo organizador!");
  }
}
function sendChatAsHost(){
  const txt= hostChatInput.value.trim();
  if(!txt)return;
  hostChatInput.value='';
  db.ref(`games/${gameCode}/chat`).once('value', snap=>{
    let arr= snap.val()||[];
    arr.push({from:'HOST', text:txt, ts:Date.now()});
    db.ref(`games/${gameCode}/chat`).set(arr);
  });
}

/********** EFEITOS DE CARTA **********/
function handleCardEffect(card, gameData){
  let logs= gameData.logs||[];
  const arr= Object.values(gameData.players||{});
  const allKeys = Object.keys(gameData.players||{});
  let idx= gameData.currentPlayerIndex;
  let direction= gameData.direction;
  let rules= gameData.rules||[];
  const currName= arr[idx]?.name||'???';
  logs.push(`${currName} puxou [${card.rank}${card.suit!=='Coringa'?card.suit:''}]`);

  let passTurn=true;
  switch(card.rank){
    case 'A':
      logs.push(`${currName} deve escolher alguém para beber 1 dose!`);
      break;
    case '2':
      logs.push(`${currName} deve distribuir 2 doses para outras pessoas!`);
      break;
    case '3':
      logs.push(`${currName} deve distribuir 3 doses para três pessoas diferentes!`);
      break;
    case '4':
      logs.push(`"Marca de..." - ${currName} escolhe uma categoria`);
      const newRule= prompt("Nova regra? (Marca de...)");
      if(newRule){
        rules.push(newRule);
        logs.push(`Regra adicionada: "${newRule}"`);
      }
      break;
    case '5':
      logs.push(`"Eu nunca..." - ${currName} deve falar algo que nunca fez. Quem já fez, bebe!`);
      break;
    case '6':
      rules=[];
      logs.push("Todas as regras foram quebradas!");
      break;
    case '7':
      if(rules.length > 0) {
        const ruleIndex = rules.length > 1 ? 
          prompt(`Qual regra deseja quebrar? (1-${rules.length})`) - 1 : 0;
        
        if(ruleIndex >= 0 && ruleIndex < rules.length) {
          const removedRule = rules[ruleIndex];
          rules.splice(ruleIndex, 1);
          logs.push(`${currName} quebrou a regra: "${removedRule}"`);
        }
      } else {
        logs.push(`${currName} tentou quebrar uma regra, mas não há regras ativas!`);
      }
      break;
    case '8':
      const pKey= Object.keys(gameData.players||{})[idx];
      if(pKey){
        db.ref(`games/${gameCode}/players/${pKey}/hasFingerPower`).set(true);
        logs.push(`${currName} obteve o Poder do Dedo!`);
      }
      break;
    case '9':
      direction *= -1;
      logs.push("O sentido foi invertido!");
      break;
    case '10':
      passTurn=false;
      setTimeout(()=>{
        let ni= idx+direction;
        if(ni<0) ni= arr.length-1;
        if(ni>=arr.length) ni=0;
        ni+=direction;
        if(ni<0) ni= arr.length-1;
        if(ni>=arr.length) ni=0;
        db.ref(`games/${gameCode}`).update({
          currentPlayerIndex: ni, direction, rules, logs
        });
      }, 500);
      break;
    case 'J':
      logs.push(`${currName} bebe 1 dose!`);
      sendDrinkAlert(idx, gameData);
      break;
    case 'Q':
      logs.push("Todas as mulheres bebem 1 dose!");
      // Implementação futura: poderíamos adicionar um campo de gênero para cada jogador
      // e enviar alertas de bebida apenas para jogadoras mulheres
      break;
    case 'K':
      logs.push("Todos os homens bebem 1 dose!");
      // Implementação futura: poderíamos adicionar um campo de gênero para cada jogador
      // e enviar alertas de bebida apenas para jogadores homens
      break;
    case 'Joker':
      // coringa
      const jkKey= Object.keys(gameData.players||{})[idx];
      if(jkKey){
        const oldVal= arr[idx].jokers||0;
        db.ref(`games/${gameCode}/players/${jkKey}/jokers`).set(oldVal+1);
        logs.push(`${currName} ganhou 1 Coringa!`);
      }
      break;
    default:
      logs.push(`Carta sem efeito especial.`);
  }

  if(passTurn && card.rank!=='10'){
    let ni= idx+direction;
    if(ni<0) ni= arr.length-1;
    if(ni>=arr.length) ni=0;
    db.ref(`games/${gameCode}`).update({
      currentPlayerIndex:ni, direction, rules, logs
    });
  } else {
    db.ref(`games/${gameCode}`).update({ direction, rules, logs });
  }
}
function sendDrinkAlert(playerIndex, gameData){
  const pKey= Object.keys(gameData.players||{})[playerIndex];
  if(!pKey)return;
  db.ref(`games/${gameCode}/players/${pKey}/needsToDrink`).set(Date.now());
}

// Função para finalizar o poder do dedo
function finalizeFingerPower() {
  db.ref(`games/${gameCode}/fingerPower`).once('value', snap=>{
    const fp= snap.val();
    if(!fp||!fp.queue||fp.queue.length===0)return;
    const last= fp.queue[fp.queue.length-1];
    addLog(`O último a clicar foi ${last.name}, beba!`);
    db.ref(`games/${gameCode}/players/${last.playerKey}/needsToDrink`).set(Date.now());
    db.ref(`games/${gameCode}/fingerPower`).update({active:false, queue:[]});
  });
}

/********** MODO JOGADOR **********/
(function checkUrlForGameId(){
  const params= new URLSearchParams(location.search);
  if(params.has('gameId')){
    const code= params.get('gameId');
    if(code){
      modeSelect.classList.add('hidden');
      playerArea.classList.remove('hidden');
      inputGameCodePlayer.value= code;
      enterCodePlayer();
    }
  }
})();

function enterCodePlayer(){
  const code= inputGameCodePlayer.value.trim();
  if(!code)return alert("Digite um código!");
  db.ref(`games/${code}`).once('value', snap=>{
    if(!snap.exists()){
      alert("Partida não encontrada!");
      return;
    }
    const data = snap.val();
    if(data.status === 'finished') {
      alert("Esta partida já foi encerrada!");
      return;
    }
    gameCode= code;
    playerStep1.classList.add('hidden');
    playerRegister.classList.remove('hidden');
  });
}
async function registerPlayerInGame(){
  const name= inputPlayerName.value.trim();
  if(!name)return alert("Digite seu nome!");
  // Cria player
  const ref= db.ref(`games/${gameCode}/players`).push();
  myPlayerKey= ref.key;
  await ref.set({
    name, 
    jokers:0,
    hasFingerPower:false
  });

  localStorage.setItem("opoderdedo_gameId", gameCode);
  localStorage.setItem("opoderdedo_playerKey", myPlayerKey);
  localStorage.setItem("opoderdedo_playerName", name);

  db.ref(`games/${gameCode}`).on('value', s=>{
    if(!s.exists())return;
    const gameData = s.val();
    updatePlayerView(gameData);
    
    // Se a partida acabou, limpa o cache
    if(gameData.status === 'finished') {
      alert("A partida foi encerrada!");
      clearPlayerCache();
    }
  });

  playerRegister.classList.add('hidden');
}
function updatePlayerView(gameData){
  if(gameData.status==='lobby'){
    playerLobby.classList.remove('hidden');
    playerGame.classList.add('hidden');
    const arr= Object.values(gameData.players||{});
    playerLobbyList.innerHTML= arr.map(p=>`<div>${p.name}</div>`).join('');
  }
  else if(gameData.status==='ongoing'){
    playerLobby.classList.add('hidden');
    playerGame.classList.remove('hidden');

    const pObj= gameData.players?.[myPlayerKey];
    if(!pObj){
      playerStatusPanel.textContent= "Você não está no jogo?";
      return;
    }
    // Info do player
    playerStatusPanel.classList.remove('hidden');
    playerStatusPanel.style.color='#007BFF';
    playerStatusPanel.textContent='';

    // Jogadores
    const arr= Object.values(gameData.players||{});
    playerListStatus.innerHTML= arr.map((pp, i)=>{
      const isCurrent= (i===gameData.currentPlayerIndex)?' (Vez)':'';
      const coringaInfo= pp.jokers>0? ` [Coringas: ${pp.jokers}]`:'';
      return `<div><strong>${pp.name}</strong>${isCurrent}${coringaInfo}</div>`;
    }).join('');

    // Deck
    deckCountPlayer.textContent= `Restantes: ${gameData.deck?gameData.deck.length:0}`;
    deckViewPlayer.innerHTML= (gameData.deck||[]).map(()=>`<div class="card-back"></div>`).join('');

    // Quem é o atual
    const allKeys= Object.keys(gameData.players||{});
    const curIdx= gameData.currentPlayerIndex;
    const curKey= allKeys[curIdx];
    if(curKey===myPlayerKey){
      // é minha vez
      playerStatusPanel.textContent="É A SUA VEZ!";
      playerStatusPanel.style.color="#28a745";
      btnDrawCardPlayer.style.display='inline-block';
    } else {
      const arr2= Object.values(gameData.players||{});
      const cName= arr2[curIdx]?.name||'???';
      playerStatusPanel.textContent=`É a vez de: ${cName}`;
      btnDrawCardPlayer.style.display='none';
    }

    // Carta Atual
    if(gameData.currentCard){
      currentCardPlayer.innerHTML= renderCard(gameData.currentCard.rank, gameData.currentCard.suit);
    } else {
      currentCardPlayer.textContent="Nenhuma";
    }

    // Regras
    if(gameData.rules && gameData.rules.length>0){
      playerRules.innerHTML= gameData.rules.map(r=>`<div class="rule-item">${r}</div>`).join('');
    } else {
      playerRules.textContent="Nenhuma";
    }

    // Jogador tem finger?
    btnActivateFinger.style.display= pObj.hasFingerPower?'inline-block':'none';
    // Jogador tem coringa?
    btnUseJoker.style.display= (pObj.jokers>0)?'inline-block':'none';

    // Finger Power Global
    const fp= gameData.fingerPower||{};
    if(fp.active){
      fingerBox.classList.remove('hidden');
      const found= (fp.queue||[]).find(x=> x.playerKey===myPlayerKey);
      if(found){
        btnFingerClick.disabled=true;
        btnFingerClick.textContent="Você já clicou!";
      } else {
        btnFingerClick.disabled=false;
        btnFingerClick.textContent="Clique agora!";
      }
      fingerQueue.innerHTML= (fp.queue||[]).map((x,i)=>`${i+1}º: ${x.name}`).join('<br>');
    } else {
      fingerBox.classList.add('hidden');
    }

    // Painel
    if(gameData.logs){
      playerPainel.innerHTML= gameData.logs.map(l=>`<div>${l}</div>`).join('');
      playerPainel.scrollTop= playerPainel.scrollHeight;
    }
    // Chat
    if(gameData.chat){
      playerChat.innerHTML= gameData.chat.map(c=>`<div><strong>${c.from}:</strong> ${c.text}</div>`).join('');
      playerChat.scrollTop= playerChat.scrollHeight;
    }

    // Needs to Drink?
    if(pObj.needsToDrink){
      alert("Você precisa beber!");
      db.ref(`games/${gameCode}/players/${myPlayerKey}/needsToDrink`).remove();
    }
  }
  else if(gameData.status==='finished'){
    alert("Partida Encerrada!");
    clearPlayerCache();
  }
}
async function drawCardPlayer(){
  const snap= await db.ref(`games/${gameCode}`).once('value');
  const data= snap.val();
  if(!data)return;
  const allKeys= Object.keys(data.players||{});
  if(allKeys[data.currentPlayerIndex]!== myPlayerKey){
    alert("Não é sua vez de puxar carta!");
    return;
  }
  if(!data.deck || data.deck.length===0){
    addLog("Baralho acabou!");
    return;
  }
  const card= data.deck[0];
  const newDeck= data.deck.slice(1);
  handleCardEffect(card, data);
  await db.ref(`games/${gameCode}`).update({
    deck:newDeck, currentCard:card
  });
}

/********** CORINGA, PODER DEDO **********/
function useJokerPlayer(){
  db.ref(`games/${gameCode}/players/${myPlayerKey}`).once('value', snap=>{
    const p= snap.val();
    if(!p)return;
    if(p.jokers>0){
      db.ref(`games/${gameCode}/players/${myPlayerKey}/jokers`).set(p.jokers-1);
      addLog(`${p.name} usou 1 Coringa para não beber!`);
    }
  });
}
function activateFingerPower(){
  const name= localStorage.getItem("opoderdedo_playerName")|| 'Jogador';
  db.ref(`games/${gameCode}/fingerPower`).set({
    active:true, 
    owner:myPlayerKey,
    queue:[{playerKey:myPlayerKey, name}]
  });
  db.ref(`games/${gameCode}/players/${myPlayerKey}/hasFingerPower`).set(false);
  addLog(`${name} ativou o Poder do Dedo!`);
}
function fingerClick(){
  db.ref(`games/${gameCode}/fingerPower/queue`).once('value', snap=>{
    let arr= snap.val()||[];
    if(arr.find(x=> x.playerKey===myPlayerKey))return;
    const name= localStorage.getItem("opoderdedo_playerName")|| 'Jogador';
    arr.push({playerKey:myPlayerKey, name});
    db.ref(`games/${gameCode}/fingerPower/queue`).set(arr);
  });
}

/********** GRAVAÇÃO VÍDEO **********/
async function startVideoRecording(){
  try{
    if(!localCameraStream){
      localCameraStream= await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      videoPreview.srcObject= localCameraStream;
    }
    recordedChunks=[];
    mediaRecorder= new MediaRecorder(localCameraStream);
    mediaRecorder.ondataavailable= e=>{
      if(e.data.size>0) recordedChunks.push(e.data);
    };
    mediaRecorder.onstop= async ()=>{
      if(recordedChunks.length>0){
        const blob= new Blob(recordedChunks,{type:'video/mp4'});
        const ref= storage.ref(`games/${gameCode}/videos/${Date.now()}.mp4`);
        await ref.put(blob);
        const url= await ref.getDownloadURL();
        addLog(`Gravou Vídeo! URL: ${url}`);
      }
    };
    mediaRecorder.start();
    addLog("Iniciou gravação de vídeo...");
  } catch(err){
    alert("Não foi possível acessar câmera: "+err);
  }
}
function stopVideoRecording(){
  if(mediaRecorder && mediaRecorder.state==='recording'){
    mediaRecorder.stop();
    addLog("Parou gravação de vídeo.");
  }
}
function closeVideoOverlay(){
  videoOverlay.style.display='none';
  if(localCameraStream){
    localCameraStream.getTracks().forEach(t=>t.stop());
    localCameraStream=null;
  }
  videoPreview.srcObject=null;
}

/********** CHAT (PLAYER) **********/
function sendChatAsPlayer(){
  const txt= playerChatInput.value.trim();
  if(!txt)return;
  playerChatInput.value='';
  db.ref(`games/${gameCode}/chat`).once('value', snap=>{
    let arr= snap.val()||[];
    const name= localStorage.getItem("opoderdedo_playerName")|| 'Jogador';
    arr.push({from:name, text:txt, ts:Date.now()});
    db.ref(`games/${gameCode}/chat`).set(arr);
  });
}

/********** LOG HELPER **********/
function addLog(msg){
  db.ref(`games/${gameCode}/logs`).once('value', snap=>{
    let arr= snap.val()||[];
    arr.push(msg);
    db.ref(`games/${gameCode}/logs`).set(arr);
  });
}

/********** GERA CODE E BARALHO **********/
function generateGameCode(){
  return Math.floor(100000 + Math.random()*900000).toString();
}
function generateDeck(){
  const suits = ["♥","♦","♣","♠"];
  const ranks= ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  let deck=[];
  for(let s of suits){
    for(let r of ranks){
      deck.push({rank:r, suit:s});
    }
  }
  for(let i=0;i<3;i++){
    deck.push({rank:'Joker', suit:'Coringa'});
  }
  // shuffle
  for(let i= deck.length-1; i>0;i--){
    const j= Math.floor(Math.random()*(i+1));
    [deck[i], deck[j]]=[deck[j], deck[i]];
  }
  return deck;
}
function renderCard(rank, suit){
  if(rank==='Joker'){
    return `
      <div class="card-front" style="background:#ffd700;">
        <div style="position:absolute; top:40%; left:50%; transform:translate(-50%,-50%); font-size:1rem; color:#000;">
          CORINGA
        </div>
      </div>
    `;
  }
  const isRed= (suit==='♥'||suit==='♦');
  return `
    <div class="card-front">
      <div class="card-rank-suit ${isRed?'red':'black'}">
        ${rank}${suit}
      </div>
    </div>
  `;
}
