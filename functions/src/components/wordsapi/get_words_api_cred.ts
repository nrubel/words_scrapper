import * as puppeteer from 'puppeteer';
import {wordsApi} from "../../utils/endpoints";

interface model {
    when: string,
    encrypted: string
}

const getWordsApiCred: () => Promise<model> = async () => {
    let when: string = '', encrypted: string = ''
    // const {body} = await got.get(wordsApi)
    // log(body)
    // const $ = cheerio.load(body, {xml: true, xmlMode: true})

    // let scripts: DataNode
    // $('script').filter((e, i) => {
    //     log()
    // })
    // $('script').each((i, e) => {
    //     if(e.children.length && e.children[0].type === `text`) {
    //         // log(e.children[0], e.children[0].nodeType)
    //         log(typeof e.children[0], e.children)
    //     }
    //         // scripts = e.children[0]}
    // })

    // log(scripts)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(wordsApi, {waitUntil: "load"})

    const scripts: (string | null)[] = await page.$$eval('script', (els: Element[]) => els.map((e) => e.textContent))
    // @ts-ignore
    scripts
        .filter(e => e !== '')[0]
        .trim()
        .split(` = `)
        .slice(1)
        .join('')
        .split(`'`)
        .forEach((e: string, i: number) => {
            if (i === 1) when = e;
            if (i === 3) encrypted = e;
        })
    await browser.close()

    return {when, encrypted}
}

export default getWordsApiCred