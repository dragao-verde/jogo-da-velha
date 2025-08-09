/*
montando a lógica do jogo da velha
*/

/** iniciando o tabuleiro*/

let tabuleiro = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
/**criando as variáveis de jogador atual e quando o jogo começar */

let jogadorAtual = 'X';
let jogoAtivo = true;

/**constante para definir as posições que geram vitórias para um dos lados */

const combinacoesVencedoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/**verificar a situação que indica vitória */

function verificarVitoria () {
    for (let i = 0; i < combinacoesVencedoras.length; i++) {
        const [a, b, c] = combinacoesVencedoras[i];
        if (tabuleiro[Math.floor(a / 3)][a % 3] && 
            tabuleiro[Math.floor(a / 3)][a % 3] === tabuleiro[Math.floor(b / 3)][b % 3] && 
            tabuleiro[Math.floor(a / 3)][a % 3] === tabuleiro[Math.floor(c / 3)][c % 3]) {
            return true;
        }
    }
    return false;
}

/** verificar se o jogo terminou empatado */

function verificarEmpate() {
    return tabuleiro.flat().every(celula => celula !== '');
}

/**realizando jogadas */

function jogar(celulaId) {
    if (!jogoAtivo) return;

    const celula = document.getElementById(celulaId);
    const linha = Math.floor((celulaId.charAt(celulaId.length - 1) - 1) / 3);
    const coluna = (celulaId.charAt(celulaId.length - 1) - 1) % 3;

    if (tabuleiro[linha][coluna] !== '') return;

    tabuleiro[linha][coluna] = jogadorAtual;
    celula.textContent = jogadorAtual;

    if (verificarVitoria()) {
        alert(`Jogador ${jogadorAtual} venceu!`);
        jogoAtivo = false;
        return;
    }

    if (verificarEmpate()) {
        alert('Empate!');
        jogoAtivo = false;
        return;
    }

    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
}

/**terminar o jogo */

function reiniciarJogo() {
    tabuleiro = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    jogadorAtual = 'X';
    jogoAtivo = true;

    const celulas = document.querySelectorAll('.celula');
    celulas.forEach(celula => {
        celula.textContent = '';
    });
}