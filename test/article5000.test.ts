import { createEthImplNode, EthImpl } from "../src";
import { generateLoremIpsum, saveMetrics } from "./utils";

describe("Article 5000 bytes", () => {
  let node: EthImpl;

  beforeAll(async () => {
    node = await createEthImplNode();
  });

  const FIVE_MINUTES_TIMEOUT = 1000 * 60 * 5;
  const ARTICLE_NAME = "Article5000";

  test("measure time for newArticle with 5000 bytes", async () => {
    const largeContent = generateLoremIpsum(5000);
    const start = performance.now();
    await node.newArticle(ARTICLE_NAME, largeContent);
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken to newArticle (5000 bytes): ${duration}ms`);
    expect(duration).toBeGreaterThan(0);
  });

  test("measure time for getArticle with 5000 bytes", async () => {
    const start = performance.now();
    const article = await node.getArticle(ARTICLE_NAME);
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken to getArticle (5000 bytes): ${duration}ms`);
    expect(article.name).toBe(ARTICLE_NAME);
    expect(article.content.length).toBe(5000);
    expect(duration).toBeGreaterThan(0);
  });

  test(
    "measure 1000 samples of time for getArticle with 5000 bytes",
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
          expect(article.content.length).toBe(5000);
        } catch (error) {
          console.error(`Error in sample ${i + 1}:`, error);
        }
      }
      saveMetrics(durations, "getArticle5000");
      expect(durations.length).toBe(1000);
    },
    FIVE_MINUTES_TIMEOUT, // 5 minutes timeout
  );
});
