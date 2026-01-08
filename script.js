let tabuleiro = Array(9).fill('');
let jogoAtivo = false; // começa após seleção de personagem
let jogoPausado = false;
let tempo = 30;
let intervalo;

const player1 = { name: 'Jogador 1', symbol: {type:'img', val:'./assets/x.svg'}, score: 0 };
const player2 = { name: 'Jogador 2', symbol: {type:'img', val:'./assets/o.svg'}, score: 0 };
let jogadorAtual = player1; // referência ao objeto do jogador atual

const combinacoes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function jogar(indice) {
    if (jogoPausado || !jogoAtivo) return;
    if (tabuleiro[indice] !== '') return;

    tabuleiro[indice] = jogadorAtual.symbol;
    atualizarTela();

    if (verificarVitoria()) {
        jogoAtivo = false;
        clearInterval(intervalo);

        jogadorAtual.score++;
        alert(`${jogadorAtual.name} venceu!`);

        if (jogadorAtual.score === 2) {
            alert(`🎉 ${jogadorAtual.name} é o CAMPEÃO! 🎉\nClique em Ok para reiniciar o placar.`);
            reiniciarJogo();
        } else {
            setTimeout(proximaRodada, 1500);
        }
        return;
    }

    if (tabuleiro.every(celula => celula !== '')) {
        jogoAtivo = false;
        clearInterval(intervalo);
        alert('Empate!');
        setTimeout(proximaRodada, 1500);
        return;
    }

    jogadorAtual = jogadorAtual === player1 ? player2 : player1;
    atualizarTela();
    iniciarCronometro();
}

function verificarVitoria() {
    return combinacoes.some(([a, b, c]) =>
        tabuleiro[a] &&
        tabuleiro[a] === tabuleiro[b] &&
        tabuleiro[a] === tabuleiro[c]
    );
}

function atualizarTela() {
    for (let i = 0; i < 9; i++) {
        const cel = document.getElementById(`celula${i}`);
        const val = tabuleiro[i];
        if (!val) {
            cel.textContent = '';
            } else if (val.type === 'img') {
                // normalize path to ensure relative reference
                const src = val.val.startsWith('./') ? val.val : `./${val.val.replace(/^\/+/, '')}`;
                cel.innerHTML = `<img src="${src}" alt="simbolo">`;
        } else {
            cel.textContent = val.val;
        }
    }

    // Mostrar símbolo e nome do jogador atual
        const vezElem = document.getElementById('jogadorVez');
        if (jogadorAtual.symbol.type === 'img') {
            vezElem.innerHTML = `<img src="${jogadorAtual.symbol.val}" alt="simbolo" style="height:20px;vertical-align:middle;margin-right:6px"> ${jogadorAtual.name}`;
        } else {
            vezElem.textContent = `${jogadorAtual.symbol.val} ${jogadorAtual.name}`;
        }

    document.getElementById('placar1').textContent = player1.score;
    document.getElementById('placar2').textContent = player2.score;
    document.getElementById('player1Name').textContent = player1.name;
    document.getElementById('player2Name').textContent = player2.name;
        // atualizar símbolos no placar
        const p1s = document.getElementById('player1Symbol');
        const p2s = document.getElementById('player2Symbol');
        if (player1.symbol.type === 'img') p1s.innerHTML = `<img src="${player1.symbol.val}" alt="p1" style="height:18px;vertical-align:middle">`;
        else p1s.textContent = player1.symbol.val;
        if (player2.symbol.type === 'img') p2s.innerHTML = `<img src="${player2.symbol.val}" alt="p2" style="height:18px;vertical-align:middle">`;
        else p2s.textContent = player2.symbol.val;
}


function iniciarCronometro() {
    tempo = 30;
    document.getElementById('tempo').textContent = tempo;
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        if (!jogoPausado) {
            tempo--;
            document.getElementById('tempo').textContent = tempo;

            if (tempo === 0) {
                clearInterval(intervalo);
                alert('Tempo esgotado! Próximo jogador!');
                jogadorAtual = jogadorAtual === player1 ? player2 : player1;
                atualizarTela();
                iniciarCronometro();
            }
        }
    }, 1000);
}

function pausarRetomar() {
    const botao = document.getElementById('btnPausar');

    if (jogoPausado) {
        jogoPausado = false;
        botao.textContent = 'Pausar';
        botao.style.backgroundColor = '#333';
    } else {
        jogoPausado = true;
        botao.textContent = 'Retomar';
        botao.style.backgroundColor = '#4CAF50';
    }
}

function proximaRodada() {
    tabuleiro = Array(9).fill('');
    jogadorAtual = player1;
    jogoAtivo = true;
    jogoPausado = false;

    document.getElementById('btnPausar').textContent = 'Pausar';
    document.getElementById('btnPausar').style.backgroundColor = '#333';

    atualizarTela();
    iniciarCronometro();
}

function reiniciarJogo() {
    player1.score = 0;
    player2.score = 0;
    proximaRodada();
}

// Sair do jogo e voltar para seleção de personagens
function sairJogo() {
    clearInterval(intervalo);
    jogoAtivo = false;
    jogoPausado = false;

    // limpar tabuleiro e placares para começar seleção do zero
    tabuleiro = Array(9).fill('');
    player1.score = 0;
    player2.score = 0;

    // resetar textos/estados do botão pausar
    const botao = document.getElementById('btnPausar');
    if (botao) {
        botao.textContent = 'Pausar';
        botao.style.backgroundColor = '#333';
    }

    // limpar escolhas salvas e mostrar modal de início
    localStorage.removeItem('jogoPlayers');

    // limpar campos do modal e restaurar opções padrão
    const nome1 = document.getElementById('nome1');
    const nome2 = document.getElementById('nome2');
    if (nome1) nome1.value = '';
    if (nome2) nome2.value = '';

    document.querySelectorAll('input[name="simbolo1"]').forEach(r => { r.disabled = false; });
    document.querySelectorAll('input[name="simbolo2"]').forEach(r => { r.disabled = false; });
    const def1 = document.querySelector('input[name="simbolo1"][value="x"]');
    const def2 = document.querySelector('input[name="simbolo2"][value="o"]');
    if (def1) def1.checked = true;
    if (def2) def2.checked = true;

    const modal = document.getElementById('modalInicio');
    if (modal) modal.style.display = 'flex';

    atualizarTela();
}

// Função para iniciar o jogo após seleção
function começarJogo() {
    const nome1 = document.getElementById('nome1').value.trim() || 'Jogador 1';
    const nome2 = document.getElementById('nome2').value.trim() || 'Jogador 2';
    const simbolo1 = document.querySelector('input[name="simbolo1"]:checked').value;
    const simbolo2 = document.querySelector('input[name="simbolo2"]:checked').value;

    if (simbolo1 === simbolo2) {
        alert('Escolham símbolos diferentes para os dois jogadores.');
        return;
    }

    player1.name = nome1;
    player2.name = nome2;

    // converter escolha em objeto símbolo
    player1.symbol = simboloToObject(simbolo1);
    player2.symbol = simboloToObject(simbolo2);

    // Resetar tabuleiro e estado
    tabuleiro = Array(9).fill('');
    player1.score = 0;
    player2.score = 0;
    jogadorAtual = player1;
    jogoAtivo = true;
    jogoPausado = false;

    // salvar escolhas
    localStorage.setItem('jogoPlayers', JSON.stringify({player1:{name:player1.name,symbol:player1.symbol}, player2:{name:player2.name,symbol:player2.symbol}}));

    document.getElementById('modalInicio').style.display = 'none';
    atualizarTela();
    iniciarCronometro();
}

function simboloToObject(key) {
    const map = {
        x: './assets/x.svg',
        o: './assets/o.svg',
        capitao: './assets/capitao-america.png',
        aranha: './assets/homem-aranha.png',
        hulk: './assets/hulk.jpg',
        lanterna: './assets/lanterna-verde.webp',
        morcego: './assets/morcego.jpg',
        superman: './assets/superman.jpg'
    };
    if (map[key]) return {type:'img', val: map[key]};
    return {type:'char', val:key};
}

function objectToRadioVal(obj) {
    if (!obj) return null;
    if (obj.type === 'char') return obj.val;
    // find key by value
    const map = {
        './assets/x.svg':'x',
        './assets/o.svg':'o',
        './assets/capitao-america.png':'capitao',
        './assets/homem-aranha.png':'aranha',
        './assets/hulk.jpg':'hulk',
        './assets/lanterna-verde.webp':'lanterna',
        './assets/morcego.jpg':'morcego',
        './assets/superman.jpg':'superman'
    };
    return map[obj.val] || obj.val;
}

window.addEventListener('load', () => {
    const displayNameMap = {
        x: 'X',
        o: 'O',
        capitao: 'Capitão',
        aranha: 'Aranha',
        hulk: 'Hulk',
        lanterna: 'Lanterna',
        morcego: 'Morcego',
        superman: 'Superman'
    };
    const saved = localStorage.getItem('jogoPlayers');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.player1) {
                document.getElementById('nome1').value = data.player1.name || '';
                const val1 = objectToRadioVal(data.player1.symbol);
                if (val1) {
                    const r1 = document.querySelector(`input[name="simbolo1"][value="${val1}"]`);
                    if (r1) r1.checked = true;
                }
            }
            if (data.player2) {
                document.getElementById('nome2').value = data.player2.name || '';
                const val2 = objectToRadioVal(data.player2.symbol);
                if (val2) {
                    const r2 = document.querySelector(`input[name="simbolo2"][value="${val2}"]`);
                    if (r2) r2.checked = true;
                }
            }
        } catch(e) { /* ignore parse errors */ }
    }

    // Ajustar seleção para não permitir escolhas duplicadas
    function updateDisabledOptions() {
        const sel1 = document.querySelector('input[name="simbolo1"]:checked')?.value;
        const sel2 = document.querySelector('input[name="simbolo2"]:checked')?.value;
        document.querySelectorAll('input[name="simbolo1"]').forEach(r => r.disabled = (r.value === sel2));
        document.querySelectorAll('input[name="simbolo2"]').forEach(r => r.disabled = (r.value === sel1));
    }

    // se prefill deixou ambos iguais, escolha alternativa para player2
    const v1 = document.querySelector('input[name="simbolo1"]:checked')?.value;
    const v2 = document.querySelector('input[name="simbolo2"]:checked')?.value;
    if (v1 && v2 && v1 === v2) {
        const alt = Array.from(document.querySelectorAll('input[name="simbolo2"]')).find(r => r.value !== v1);
        if (alt) alt.checked = true;
    }

    // conectar ouvintes para atualizar estado de desabilitado e evitar duplicatas
    function handleChange(origin) {
        const sel1 = document.querySelector('input[name="simbolo1"]:checked')?.value;
        const sel2 = document.querySelector('input[name="simbolo2"]:checked')?.value;

        // se ambos iguais, mover o outro jogador para a primeira opção disponível
        if (sel1 && sel2 && sel1 === sel2) {
            if (origin === 'simbolo1') {
                const alt = Array.from(document.querySelectorAll('input[name="simbolo2"]')).find(r => r.value !== sel1 && !r.disabled);
                if (alt) alt.checked = true;
            } else {
                const alt = Array.from(document.querySelectorAll('input[name="simbolo1"]')).find(r => r.value !== sel2 && !r.disabled);
                if (alt) alt.checked = true;
            }
        }

        updateDisabledOptions();

        // Atualizar apelido ao selecionar personagem (se campo vazio, padrão ou já era nome de personagem)
        const isCharacterName = name => Object.values(displayNameMap).includes(name);
        if (origin === 'simbolo1') {
            const nomeElem = document.getElementById('nome1');
            const display = displayNameMap[sel1] || sel1;
            if (nomeElem) {
                const current = nomeElem.value.trim();
                if (!current || current.startsWith('Jogador') || isCharacterName(current)) nomeElem.value = display;
            }
        } else if (origin === 'simbolo2') {
            const nomeElem = document.getElementById('nome2');
            const display = displayNameMap[sel2] || sel2;
            if (nomeElem) {
                const current = nomeElem.value.trim();
                if (!current || current.startsWith('Jogador') || isCharacterName(current)) nomeElem.value = display;
            }
        }
    }

    document.querySelectorAll('input[name="simbolo1"]').forEach(r => r.addEventListener('change', () => handleChange('simbolo1')));
    document.querySelectorAll('input[name="simbolo2"]').forEach(r => r.addEventListener('change', () => handleChange('simbolo2')));
    updateDisabledOptions();

    // Mostrar modal e conectar botão
    document.getElementById('modalInicio').style.display = 'flex';
    document.getElementById('btnComecar').addEventListener('click', começarJogo);
    atualizarTela();
});