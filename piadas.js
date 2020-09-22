/*

O código a seguir executa a seguinte rotina:
- Acessa o site www.piadas.com.br
- Pesquisa pela palavra chave desejada
- Acessa a primeira piada do resultado da busca
- Imprime a mesma no console

Com base no mesmo, crie uma nova rotina que:
- Acessa o site www.piadas.com.br
- Entra na seção de "melhores piadas"
- Retorna um array com os autores das 5 melhores piadas

*/

const puppeteer = require('puppeteer');

//Cria uma instância do navegador Chromium
exports.getAuthorBestFiveJokes = async (keyword) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = (await browser.pages())[0];
  page.setViewport({ width: 1280, height: 720 });

  await page.goto('https://www.piadas.com.br/');

  await page.click('#menu-4009-1');

  await page.waitForSelector('.node-piadas');

  const bestJokesHtml = await page.content();
  const bestJokesUrl = getFirstAuthorJokesUrl({ html: bestJokesHtml, number: 5 });
  const authorName = [];

  for (joke of bestJokesUrl) {
    await page.goto(joke);
    await page.waitForSelector('.username');

    const jokeHtml = await page.content();
    const regexResult = jokeHtml.match(/class="username"[\s\S]+?(.+?)</i);
    authorName.push(regexResult[1]);
  }
  await browser.close();
  return authorName;
}

const getFirstAuthorJokesUrl = ({ html, number }) => {
  const regex = /class="ds-1col node node-piadas node-teaser node-piadas node-teaser view-mode-teaser texto_branco clearfix"[\s\S]+?href="(.+?)"/gi;

  let matches = [];
  const firstFiveMatchesInSecondGroup = [];
  let i = 0;

  while (matches = regex.exec(html)) {
    if (number != undefined && i > number - 1) break;

    if (matches[1].startsWith('/piadas')) {
      firstFiveMatchesInSecondGroup.push(`https://www.piadas.com.br${matches[1]}`);
      i++;
    }
  }
  return firstFiveMatchesInSecondGroup;
}

this.getAuthorBestFiveJokes();

