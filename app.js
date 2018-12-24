const axios = require('axios');

// const taxaConversao = (from, to) => {
//   return axios.get('http://data.fixer.io/api/latest?access_key=85ec9ef5f2a0314746001157d4bca4e8').then(res => {
//     const euro = 1 / res.data.rates[from];
//     const rate = euro * res.data.rates[to];
//     return rate;
//   });
// };
const periodo = '2010-01-01';
// latest para periodo mais recente
const taxaConversao = async (from, to) => {
  try {
    const res = await axios.get(`http://data.fixer.io/api/${periodo}?access_key=85ec9ef5f2a0314746001157d4bca4e8`);
    const euro = 1 / res.data.rates[from];
    console.log('rates by alpha3', res.data.rates)
    console.log('origem', from, 'destino', to)
    const rate = euro * res.data.rates[to];

    if (isNaN(rate)) {
      throw new Error();
    }

    console.log('Rate', rate, to, from);
    return rate;
  } catch (e) {
    throw new Error(`${e} Estamos com problema para converter ${from} para ${to}.`);
  }
};

const buscaPaises = async (codigoPais) => {
  try {
    const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${codigoPais}`);
    console.log("Codigo Pais", codigoPais)
    const name = res.data.map(pais => pais.name);
    console.log('Nome do Pais', name)

    return name;
  } catch (e) {
    throw new Error(`${e} Servidor com problemas para encontrar o país relativo ao código ${codigoPais}.`);
  }
};

const conversorMoedas = async (from, to, quantia) => {
  try {
    const taxa = await taxaConversao(from, to);
    const quantiaConvertida = (taxa * quantia).toFixed(2);
    const paisOrigem = await buscaPaises(from);
    const paisDestino = await buscaPaises(to);

    return `Em ${periodo}, a quantia de ${quantia} ${from}, moeda aceita no ${paisOrigem.join(', ')}, vale ${quantiaConvertida} ${to}, que é a moeda aceita no ${paisDestino.join(', ')}.`;
  } catch (e) {
    throw new Error(`${e} - Problemas na conversão final.`);
  }
};

// taxaConversao('USD', 'BRL').then(rate => {
//   console.log(`Um dólar custa atualmente R$${rate.toFixed(2)}.`)
// });

// buscaPaises('BRL').then(nome => {
//   console.log('busca pais', nome)
// })

conversorMoedas('BRL', 'ARS', 10).then(res => {
  console.log(res);
});