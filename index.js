const tamanhoPopulacaoInicial = 20
/**
 * qtdClonesSelecionados
 * Referencia a quantos anticorpos serão selecionados na Taxa de clonagem
 */
const qtdClonesSelecionados = 3
const qtdClonesParaGerar = 10
const fatorMutacaoVariavel = 0.1
const codigoMalwareEstatico = [
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
]

function gerarCodigoMalwareAleatorio() {
  var codigo = []
  for (i = 0; i < 11; i++) {
    var linha = []
    for (j = 0; j < 11; j++) {
      linha.push(Math.random() >= 0.5 ? 1 : 0)
    }
    codigo.push(linha)
  }
  return codigo
}

function matrizToString(matriz) {
  var txt = ""
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (j >= 10) {
        txt += matriz[i][j].toString() + '\n'
      } else {
        txt += matriz[i][j].toString()
      }
    }
  }
  console.log(txt)
  // return txt
}

class Malware {

  constructor(codigoMalware) {
    this.codigoMalware = codigoMalware
  }
}

class Anticorpo {
  constructor() {
    this.afinidade = parseFloat(Math.random().toFixed(2)); // A afinidade é gerada aleatoriamente
  }

  clonar() {
    const novoAnticorpo = new Anticorpo();
    novoAnticorpo.afinidade = this.afinidade;
    return novoAnticorpo;
  }

  hipermutar() {
    // Chance de sofrer hipermutação inversamente proporcional à afinidade
    const chanceHipermutacao = this.afinidade;
    console.log('chanceHipermutacao', chanceHipermutacao);

    // Aplicar hipermutação se a chance sorteada for compatível
    if (Math.random() > chanceHipermutacao) {
      // Realizar a mutação (pode ser uma mutação específica conforme necessário)
      console.log(`Anticorpo com afinidade ${this.afinidade} sofreu hipermutação.`);
      console.log('definir hipermutação')
    }
  }
}

class SistemaImunologico {
  constructor(tamanhoPopulacional) {
    this.populacaoAnticorpos = [];

    // Geração aleatória da população inicial de anticorpos
    for (let i = 0; i < tamanhoPopulacional; i++) {
      this.populacaoAnticorpos.push(new Anticorpo());
    }
  }

  selecionarAnticorposMaisAfinidade() {
    // Seleção dos anticorpos com maior afinidade
    return this.populacaoAnticorpos.sort((a, b) => b.afinidade - a.afinidade);
  }

  clonarAnticorposMaisPromissores(quantidade) {
    const selecionados = this.selecionarAnticorposMaisAfinidade().slice(0, qtdClonesSelecionados);
    console.log('Selecionados: ', selecionados)

    const totalAfinidades = selecionados.reduce((sum, anticorpo) => sum + anticorpo.afinidade, 0);
    console.log('totalAfinidades', totalAfinidades);

    for (let i = 0; i < selecionados.length; i++) {
      console.log(`Afinidade do selecionado: ${selecionados[i].afinidade}`)
      console.log(`Sua proporção:`)
      console.log(`QCIK: AFik: ${selecionados[i].afinidade}, Σ nk=1 AFik: ${totalAfinidades}, Cl: ${quantidade}`)
      console.log(`Resultado: `, parseFloat(((selecionados[i].afinidade / totalAfinidades) * quantidade).toFixed(2)))
    }

    const proporcoes = selecionados.map((anticorpo) => (parseFloat(((anticorpo.afinidade / totalAfinidades) * quantidade).toFixed(2))));
    console.log('proporcoes', proporcoes);

    const clones = [];
    let quantidadeClonesCriados = 0;

    // Clonagem proporcional à afinidade
    while (quantidadeClonesCriados < quantidade) {
      for (let i = 0; i < selecionados.length; i++) {
        const proporcaoClones = proporcoes[i];
        const quantidadeClonesParaCriar = Math.round((proporcaoClones * quantidade) / quantidade);

        console.log('Clone: ', i)
        console.log('quantidadeClonesParaCriar: ', quantidadeClonesParaCriar)
        for (let j = 0; j < quantidadeClonesParaCriar; j++) {
          console.log(`Clonando: ${JSON.stringify(selecionados[i])}`)
          clones.push(selecionados[i].clonar());
          quantidadeClonesCriados++;
          if (quantidadeClonesCriados >= quantidade) {
            break;
          }
        }

        if (quantidadeClonesCriados >= quantidade) {
          break;
        }
      }
    }

    return clones;
  }


  hipermutarAnticorpos(anticorpos) {
    // Hipermutação dos anticorpos
    for (const anticorpo of anticorpos) {
      anticorpo.hipermutar();
    }
  }

  simularGeracao() {
    const clones = this.clonarAnticorposMaisPromissores(qtdClonesParaGerar);
    this.hipermutarAnticorpos(clones);
    this.populacaoAnticorpos.push(...clones);
  }

  exibirEstado() {
    // Exibir o estado atual do sistema
    console.log("Estado do Sistema Imunológico:");
    for (let i = 0; i < this.populacaoAnticorpos.length; i++) {
      console.log(`Anticorpo ${i + 1}: Afinidade ${this.populacaoAnticorpos[i].afinidade}`);
    }
  }
}

// // Exemplo de uso
// const sistemaImunologico = new SistemaImunologico(tamanhoPopulacaoInicial);
// // sistemaImunologico.exibirEstado();

// // Simular geração
// console.log("--------------------------------------------------------------\n\n\n\n");
// console.log('Simular NOVA Geração:')
// sistemaImunologico.exibirEstado();
// sistemaImunologico.simularGeracao();
// sistemaImunologico.exibirEstado();


const test = new Malware(gerarCodigoMalwareAleatorio())
matrizToString(test.codigoMalware)
console.log('estatico: ')
matrizToString(codigoMalwareEstatico)

// gerarCodigoMalwareAleatorio()
// gerarCodigoMalwareAleatorio()
// gerarCodigoMalwareAleatorio()
// gerarCodigoMalwareAleatorio()