/**
 * This script gives the position of a peculiar domain for a specific keyword research on google.
 *  @param: domain: string, keyword: string
 *  @returns: {
 *              rank: -1 not found | 0 first rank | x x + 1 th rank,
 *              size: 0 | x search result array length
 *            }
 */

import puppeteer from "puppeteer";
import { Page } from "puppeteer";
// const puppeteer = require("puppeteer"); // FOR NODEJS SCRIPT ALONE (also get rid of typescript types)

const pagesLimit = 100; // limit of SERP pages, each page contains what is passed to the url "&num" attribute
let currentPage = 1; // current page of the SERPs
let scrollDelay = 1000;

// Selector for going to the next page in infinite scroll
const dataAttributeSelectorNextButton = '[aria-label="Plus de résultats"]';
const excludeStyleSelectorNextButton = ':not([style*="transform: scale(0)"])';
const selectorNextButton =
  dataAttributeSelectorNextButton + excludeStyleSelectorNextButton;

// Selector for retrieving results without undesirable items like buttons
const firstPageSelector = '#search a:not([role="button"]) > h3';
const nextPageSelector = '#botstuff a:not([role="button"]) > h3';
const pageSelectorH3 = firstPageSelector + ", " + nextPageSelector;

// Selector for Accept all modal's button
const selectorAcceptAllButton = "button#L2AGLb";

type ISearchEntry = {
  link: string;
  title: string;
};

let found = false;
let hasNextPage = true;
let myorganicResults = [] as Array<ISearchEntry>;

async function scrollToBottom(page: Page) {
  try {
    let previousHeight;
    previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForFunction(
      `document.body.scrollHeight > ${previousHeight}`
    );
    await page.waitForTimeout(scrollDelay);
    console.log("Scrolled");
  } catch (e) {}
}

async function getPageResults(page: Page) {
  const pageResults = await page.$$eval(pageSelectorH3, (elems) => {
    return elems.map((h3: Element) => {
      const title = (h3 as HTMLElement).innerText;
      const link = h3?.parentElement?.getAttribute("href") as string;
      return { title, link } as ISearchEntry;
    });
  });
  return pageResults;
}

async function clickElement(page: Page, selectorNextButton: string) {
  try {
    const elem = await page.$eval(selectorNextButton, (el: Element) => {
      if (el) {
        (el as HTMLElement).click();
        return true;
      } else return false;
    });
    return elem;
  } catch (error) {
    console.log("Next page not found, finishing research");
    return false;
  }
}

async function searchForResultLoop(page: Page, domain: string) {
  let resLength;
  while (currentPage <= pagesLimit && !found && hasNextPage) {
    console.log(currentPage);
    await page.waitForTimeout(500);
    await scrollToBottom(page);
    resLength = await myorganicResults.push(...(await getPageResults(page)));
    //page.waitForNavigation({ waitUntil: 'networkidle0' }),
    await page.waitForTimeout(500); // 0.5 second delay added here
    if (
      (await myorganicResults.findIndex((resItem) =>
        resItem.link.includes(domain)
      )) !== -1
    ) {
      found = true;
      console.log("found");
    }
    hasNextPage = await clickElement(page, selectorNextButton);
    currentPage++;
    await searchForResultLoop(page, domain);
  }
  return myorganicResults;
}

async function findIndex(
  haystack: ISearchEntry[],
  needle: string
): Promise<number> {
  let result = -999;
  console.log("HAYSTACK LENGHT:" + haystack.length);

  return new Promise((resolve, reject) => {
    result = haystack.findIndex((resItem) => resItem.link.includes(needle));
    if (result.toString() !== undefined) {
      console.log("RESULT:" + result);
      return resolve(result);
    } else {
      return reject();
    }
  });
}

async function getOrganicResults(domain: string, keyword: string) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  // const url = process.env.GOOGLE_SEARCH_URL + encodeURIComponent(keyword);
  const url =
    "https://www.google.com/search?q=" +
    encodeURIComponent(keyword) +
    "&num=100";
  await page.goto(url);

  // Wait for the "Accept All" button to appear and then click it:
  await page.waitForSelector(selectorAcceptAllButton);
  await page.click(selectorAcceptAllButton);

  let organicResults = [];

  organicResults = await searchForResultLoop(page, domain);
  console.log("result received, now closing...");
  await page.close();
  console.log("page closed");
  await browser.close();
  console.log("browser closed");
  let finalRes = -999;
  finalRes = await findIndex(organicResults, domain);
  console.log("&&&&& RANKING SCRIPT &&&&&");
  console.log({ rank: finalRes, size: organicResults.length });
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
  myorganicResults = [];
  return { rank: finalRes, size: organicResults.length };
}

export { getOrganicResults };

//getOrganicResults("github.com", "repository").then((pos) => console.log(pos));
