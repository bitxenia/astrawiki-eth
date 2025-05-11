import { createEthImplNode, EthImpl } from "../src";
import { generateLoremIpsum, saveMetrics } from "./utils";

describe("Article 10000 bytes", () => {
  let node: EthImpl;

  beforeAll(async () => {
    node = await createEthImplNode();
  });

  const FIVE_MINUTES_TIMEOUT = 1000 * 60 * 5;
  const ARTICLE_NAME = "Article10000";

  test("measure time for newArticle with 10000 bytes", async () => {
    const largeContent = generateLoremIpsum(10000);
    const start = performance.now();
    await node.newArticle(ARTICLE_NAME, largeContent);
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken to newArticle (10000 bytes): ${duration}ms`);
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
      saveMetrics(durations, "getArticle10000");
      expect(durations.length).toBe(1000);
    },
    FIVE_MINUTES_TIMEOUT, // 5 minutes timeout
  );
});
