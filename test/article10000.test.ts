import * as fs from "fs";
import { createEthImplNode, EthImpl } from "../src";

describe("Article 10000 bytes", () => {
  let node: EthImpl;

  beforeAll(async () => {
    node = await createEthImplNode();
  });

  const FIVE_MINUTES_TIMEOUT = 1000 * 60 * 5;
  const ARTICLE_NAME = "Article10000";
  const LOREM_IPSUM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";

  test("measure time for newArticle with 10000 bytes", async () => {
    const largeContent = LOREM_IPSUM.repeat(
      Math.ceil(10000 / LOREM_IPSUM.length),
    ).slice(0, 10000);
    const start = performance.now();
    await node.newArticle(ARTICLE_NAME, largeContent);
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken to newArticle (10000 bytes): ${duration}ms`);
    expect(duration).toBeGreaterThan(0);
  });

  test("measure time for getArticle with 10000 bytes", async () => {
    const start = performance.now();
    const article = await node.getArticle(ARTICLE_NAME);
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken to getArticle (10000 bytes): ${duration}ms`);
    expect(article.name).toBe(ARTICLE_NAME);
    expect(article.content.length).toBe(10000);
    expect(duration).toBeGreaterThan(0);
  });

  test(
    "measure 1000 samples of time for getArticle with 10000 bytes",
    async () => {
      const durations: number[] = [];
      for (let i = 0; i < 1000; i++) {
        try {
          const start = performance.now();
          const article = await node.getArticle(ARTICLE_NAME);
          const end = performance.now();
          const duration = end - start;
          durations.push(duration);
          expect(article.name).toBe(ARTICLE_NAME);
          expect(article.content.length).toBe(10000);
        } catch (error) {
          console.error(`Error in sample ${i + 1}:`, error);
        }
      }
      // Write durations to a file inside the test folder
      const testFolder = __dirname;
      const fileName = `${testFolder}/durations10000_${new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\..+/, "")}.json`;
      fs.writeFileSync(fileName, JSON.stringify(durations, null, 2));
      console.log(`Durations written to ${fileName}`);

      expect(durations.length).toBe(1000);
    },
    FIVE_MINUTES_TIMEOUT, // 5 minutes timeout
  );
});
