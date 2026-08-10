import { UseCase } from "src/core/shared/application/use-case.interface";
import { SimulacaoFinanciamentoInput as Input } from "./simulacao-financiamento.input";

export class SimulacaoFinanciamentoUseCase implements UseCase<Input, void> {
  async call({
    valor_financiado,
    amortizacao_adicional,
    show_info,
  }: Input) {
    const valorFinanciado = valor_financiado
    const amortizacaoBase = +(valorFinanciado / 420).toFixed(2)
    const amortizacaoAdicional = amortizacao_adicional
    const showInfo = show_info

    const response = this.parcelas({
      amortizacaoAdicional,
      valorFinanciamento: valorFinanciado,
      amortizacaoBase: amortizacaoBase
    })

    const parcelas = response.parcelas

    const toNumber = (n: number) => n.toFixed(2).toString().replace(".", ",")

    console.log(response)
    if(showInfo) {
      console.log("--------------")
      console.log(toNumber(response.totalPago))
      console.log(toNumber(response.totalPago - valorFinanciado))
      console.log(toNumber(response.primeiraParcela))
      console.log(amortizacaoAdicional)
      console.log(toNumber(response.totalPago / valorFinanciado))
      console.log("1225,09")
      
      parcelas.map(p => {
        const value = p.valor.toString().replace(".", ',')
        console.log(value)
      })
    }
  }

  parcelas(data: {
    valorFinanciamento: number
    amortizacaoAdicional: number
    amortizacaoBase: number
  }) {
    const { amortizacaoAdicional, valorFinanciamento, amortizacaoBase } = data
    let valorFinanciado = valorFinanciamento

    const jurosComEncargos = 0.00987

    let valorTotalPago = 0

    let ultimaParcela = 0
    const parcelas: { ano: number, parcela: number, valor: number}[] = []
    let primeiraParcela = 0
    for (let mes = 1; valorFinanciado > 0; mes++) {
      const valorJuros = valorFinanciado * jurosComEncargos
      const amortizacao = amortizacaoBase + amortizacaoAdicional
      const pago = valorJuros + amortizacao

      ultimaParcela = mes

      valorFinanciado -= amortizacao

      const valorFormatado = this.formatNumber(pago)
      if(mes % 30 === 0) {
        parcelas.push({
          ano: mes / 12,
          parcela: mes,
          valor: valorFormatado
        })
      }
      if (mes === 1) {
        console.log(`Primeira parcela: R$ ${valorFormatado}`)
        primeiraParcela = valorFormatado
      }

      valorTotalPago += valorFormatado
    }

    return {
      parcelas,
      totalPago: this.formatNumber(valorTotalPago),
      quantiaParcelas: ultimaParcela,
      emAnos: ultimaParcela / 12,
      primeiraParcela
    }

    console.log(`Total pago: ${this.formatNumber(valorTotalPago)}`)
    console.log(`Total parcelas: ${ultimaParcela}`)
  }

  formatNumber(n: number) {
    return Math.trunc(n * 100) / 100
  }
}
