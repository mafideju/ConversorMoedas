const axios = require('axios');

// const taxaConversao = (from, to) => {
//   return axios.get('http://data.fixer.io/api/latest?access_key=85ec9ef5f2a0314746001157d4bca4e8').then(res => {
//     const euro = 1 / res.data.rates[from];
//     const rate = euro * res.data.rates[to];
//     return rate;
//   });
// };
const periodo = '2018-12-23';
// latest para periodo mais recente
const taxaConversao = async (from, to) => {
  try {
    const res = await axios.get(`http://data.fixer.io/api/${periodo}?access_key=85ec9ef5f2a0314746001157d4bca4e8`);
    const euro = 1 / res.data.rates[from];
    // console.log('rates by alpha3', res.data.rates)
    // console.log('origem', from, 'destino', to)
    const rate = euro * res.data.rates[to];

    if (isNaN(rate)) {
      throw new Error();
    }

    // console.log('Rate', rate, to, from);
    return rate;
  } catch (e) {
    throw new Error(`${e} Estamos com problema para converter ${from} para ${to}.`);
  }
};

const buscaPaises = async (codigoPais) => {
  try {
    const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${codigoPais}`);
    // console.log("Codigo Pais", codigoPais)
    let name = res.data.map(pais => pais.name);
    // name = name[0];
    // console.log('Nome do Pais', name);
    const moneyName = res.data.map(pais => pais.currencies[0].name);
    // console.log('Nome do Dinheiro', moneyName[0])
    const currencies = res.data.map(pais => pais.currencies[0].symbol);
    // console.log(currencies)

    return [
      name,
      currencies,
      moneyName
    ]
  } catch (e) {
    throw new Error(`${e} Servidor com problemas para encontrar o país relativo ao código ${codigoPais}.`);
  }
};

// const buscaSymbol = async (codigoPais) => {
//   try {
//     const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${codigoPais}`);
//     const currencies = res.data.map(pais => pais.currencies[0].symbol);
//     console.log(currencies)

//     return symbol;
//   } catch (e) {
//     throw new Error(`Servidor com problemas para encontrar o Simbolo Monetário do País relativo ao código ${codigoPais}.`);
//   }
// }

const conversorMoedas = async (from, to, quantia) => {
  // console.log('CP', codigoPais)
  try {
    const taxa = await taxaConversao(from, to);
    const paisOrigem = await buscaPaises(from);
    const paisDestino = await buscaPaises(to);
    const symbolOrigem = await buscaPaises(from);
    const symbolDestino = await buscaPaises(to);
    const cashNameOrigin = await buscaPaises(from);
    const cashNameDestino = await buscaPaises(to);

    // console.log('SO', paisOrigem)

    const quantiaConvertida = (taxa * quantia).toFixed(2);

    return `Em ${periodo}, a quantia de ${symbolOrigem[1][0]}${quantia} ${cashNameOrigin[2][0]}, moeda aceita no ${paisOrigem[0].join(', ')}, vale ${symbolDestino[1][0]}${quantiaConvertida} ${cashNameDestino[2][0]}, que é a moeda aceita no ${paisDestino[0].join(', ')}.`;
  } catch (e) {
    throw new Error(`Problemas na conversão final.`);
  }
};

// taxaConversao('USD', 'BRL').then(rate => {
//   console.log(`Um dólar custa atualmente R$${rate.toFixed(2)}.`)
// });

// buscaPaises('BRL').then(nome => {
//   console.log('busca pais', nome)
// })

conversorMoedas('BRL', 'UYU', 10).then(data => {
  console.log(data);
});