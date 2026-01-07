let tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogadorAtual = 'X';
let jogoAtivo = true;
let jogoPausado = false;
let vitoriasX = 0;
let vitoriasO = 0;
let tempo = 30;
let intervalo;

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

    tabuleiro[indice] = jogadorAtual;
    atualizarTela();

    if (verificarVitoria()) {
        jogoAtivo = false;
        clearInterval(intervalo);
        
        if (jogadorAtual === 'X') {
            vitoriasX++;
        } else {
            vitoriasO++;
        }
        
        alert(`Jogador ${jogadorAtual} venceu!`);
        
        if (vitoriasX === 2) {
            alert('🎉 Jogador X é o CAMPEÃO! 🎉\nClique em Ok para jogar novamente.');
            reiniciarJogo();
        } else if (vitoriasO === 2) {
            alert('🎉 Jogador O é o CAMPEÃO! 🎉\nClique em Ok para jogar novamente.');
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

    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
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
        document.getElementById(`celula${i}`).textContent = tabuleiro[i];
    }
    document.getElementById('jogadorVez').textContent = jogadorAtual;
    document.getElementById('placarX').textContent = vitoriasX;
    document.getElementById('placarO').textContent = vitoriasO;
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
                jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
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
    tabuleiro = ['', '', '', '', '', '', '', '', ''];
    jogadorAtual = 'X';
    jogoAtivo = true;
    jogoPausado = false;

    document.getElementById('btnPausar').textContent = 'Pausar';
    document.getElementById('btnPausar').style.backgroundColor = '#333';

    atualizarTela();
    iniciarCronometro();
}

function reiniciarJogo() {
    vitoriasX = 0;
    vitoriasO = 0;
    proximaRodada();
}

window.addEventListener('load', () => {
    alert('Bem-vindo ao Jogo da Velha!\nMelhor de 3: Quem vencer 2 primeiro leva!');
    atualizarTela();
    iniciarCronometro();
});