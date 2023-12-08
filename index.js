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

function gerarCodigoGeneticoAleatorio(limite) {
  var codigo = []
  for (i = 0; i < limite; i++) {
    var linha = []
    for (j = 0; j < limite; j++) {
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
      if (j >= matriz.length - 1) {
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
  constructor(codigoGenetico) {
    this.codigoGenetico = codigoGenetico;
    this.afinidade = 0;
  }

  compararAnticorpos(outroAnticorpo) {
    if (this.afinidade > outroAnticorpo.afinidade) {
      return -1;
    }
    if (this.afinidade < outroAnticorpo.afinidade) {
      return 1;
    }
    return 0;
  }
}

class Antivirus {
  constructor(tamanhoPopulacao, tamanhoMalware) {
    this.populacao = tamanhoPopulacao;
    this.malware = new Malware(gerarCodigoGeneticoAleatorio(tamanhoMalware))
    this.anticorpos = this.criarAnticorpos(tamanhoPopulacao, tamanhoMalware)
  }

  criarAnticorpos(quantidade, tamanhoAnticorpo) {
    var tempAnticorpos = []
    for (let i = 0; i < quantidade; i++) {
      tempAnticorpos.push(new Anticorpo(gerarCodigoGeneticoAleatorio(tamanhoAnticorpo)))
    }
    return tempAnticorpos
  }

  definirAfinidades() {
    for (i = 0; i < this.anticorpos.length; i++) {
      this.anticorpos[i].afinidade = this.fitness(this.malware, this.anticorpos[i])
    }

    this.anticorpos.sort((a, b) => b.afinidade - a.afinidade)
    return this.anticorpos
  }

  fitness(umMalware, umAnticorpo) {
    var afinidade = 0;
    for (let i = 0; i < umAnticorpo.codigoGenetico.length; i++) {
      for (let j = 0; j < umAnticorpo.codigoGenetico[i].length; j++) {
        if (umMalware.codigoMalware[i][j] === umAnticorpo.codigoGenetico[i][j]) {
          afinidade += 1
        }
      }
    }
    return afinidade
  }

  selecionarMelhores(melhores, quantidade) {
    var listaMelhores = []
    for (let i = 0; i < quantidade; i++) {
      listaMelhores.push(melhores[i])
    }
    // console.log('listaMelhores', listaMelhores)
    return listaMelhores
  }

  clonagem(melhores, populacaoTotal) {
    var clones = []
    var totalAfinidades = 0;
    var clonagens;
    var contador;
    var totalClonagens;
    var tempAfinidade;

    for (i = 0; i < melhores.length; i++) {
      totalAfinidades += melhores[i].afinidade
    }
    for (i = 0; i < melhores.length; i++) {
      tempAfinidade = melhores[i].afinidade
      totalClonagens = (tempAfinidade / totalAfinidades) * populacaoTotal;
      clonagens = Math.round(totalClonagens)
      contador = 0;
      while (contador < clonagens) {
        clones.push(melhores[i])
        contador += 1
      }
    }
    return clones
  }

  hipermutacao(clones, taxaMutacao) {
    for (let i = 0; i < clones.length; i++) {
      for (let j = 0; j < clones[i].codigoGenetico.length; j++) {
        for (let r = 0; r < clones[i].codigoGenetico[j].length; r++) {
          const chanceDeMutar = ((1 - clones[i].afinidade / 121) * taxaMutacao) * 100
          // console.log('chanceDeMutar', chanceDeMutar);
          if (chanceDeMutar > clones[i].afinidade) {
            clones[i].codigoGenetico[j][r] = clones[i].codigoGenetico[j][r] === 0 ? 1: 0;
          }
        }
      }
    }
    return clones
  }

}

function rodarAntivirus(tamanhoPopulacao, taxaMutacao, qtdGeracoes, qtdMelhores, qtdClones, tamanhoMalware) {
  const antivirus = new Antivirus(tamanhoPopulacao, tamanhoMalware)
  var populacao = []
  var melhores = []
  var clonagem = []
  var hipermutacao = []

  var contador = 0;

  while (contador < qtdGeracoes) {
    // console.log(`Contador = ${contador}`)
    populacao = antivirus.definirAfinidades()
    melhores = antivirus.selecionarMelhores(populacao, qtdMelhores)
    clonagem = antivirus.clonagem(melhores, qtdClones)
    hipermutacao = antivirus.hipermutacao(clonagem, taxaMutacao)
    var novos = antivirus.populacao - hipermutacao.length
    hipermutacao.push(antivirus.criarAnticorpos(novos, tamanhoMalware)[1])
    antivirus.anticorpos = hipermutacao
    contador += 1
  }

  // populacao = antivirus.definirAfinidades()
  // melhores = antivirus.selecionarMelhores(populacao, qtdMelhores)
  console.log('Malware: ')
  matrizToString(antivirus.malware.codigoMalware)
  antivirus.anticorpos.sort((a, b) => b.afinidade - a.afinidade)

  console.log('Melhor afinidade possivel: ', tamanhoMalware * tamanhoMalware)
  console.log('Melhor afinidade encontrada: ', antivirus.anticorpos[1].afinidade)
  console.log('Antivirus: ')
  matrizToString(antivirus.anticorpos[1].codigoGenetico)
}

rodarAntivirus(
  /*tamanhoPopulacao:*/ 100, 
  /*taxaMutacao:*/ 0.1, 
  /*qtdGeracoes:*/ 1000, 
  /*qtdMelhores:*/ 2, 
  /*qtdClones:*/ 50,
  /* tamanhoMalware */ 4
)