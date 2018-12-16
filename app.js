const axios = require('axios');

// const taxaConversao = (from, to) => {
//   return axios.get('http://data.fixer.io/api/latest?access_key=85ec9ef5f2a0314746001157d4bca4e8').then(res => {
//     const euro = 1 / res.data.rates[from];
//     const rate = euro * res.data.rates[to];
//     return rate;
//   });
// };

const taxaConversao = async (from, to) => {
  const res = await axios.get('http://data.fixer.io/api/latest?access_key=85ec9ef5f2a0314746001157d4bca4e8');
  const euro = 1 / res.data.rates[from];
  const rate = euro * res.data.rates[to];

  return rate;
};

const buscaPaises = async (codigoPais) => {
  const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${codigoPais}`);
  const name = res.data.map(pais => pais.name);

  return name;
}

const conversorMoedas = async (from, to, quantia) => {
  const taxa = await taxaConversao(from, to);
  const quantiaConvertida = (taxa * quantia).toFixed(2);
  const paisOrigem = await buscaPaises(from);
  const paisDestino = await buscaPaises(to);

  return `${quantia} ${from}, moeda do ${paisOrigem.join(', ')}, estão valendo ${quantiaConvertida} ${to}, que é a moeda aceita nos seguintes países: ${paisDestino.join(', ')}.`;
}

// taxaConversao('USD', 'BRL').then(rate => {
//   console.log(`Um dólar custa atualmente R$${rate.toFixed(2)}.`)
// });

// buscaPaises('BRL').then(nome => {
//   console.log('busca pais', nome)
// })

conversorMoedas('AED', 'BRL', 10).then(res => {
  console.log(res);
})