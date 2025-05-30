import { createEthImplNode, EthImpl } from "../src";
import { generateLoremIpsum, saveMetrics } from "./utils";

describe("Article bytes limit", () => {
  let node: EthImpl;

  beforeAll(async () => {
    node = await createEthImplNode();
  });

  const FIVE_MINUTES_TIMEOUT = 1000 * 60 * 5;

  test(
    "find limit of articles incrementing byte size until it fails - limit of 100000 bytes",
    async () => {
      const durations: number[] = [];
      let i = 0;
      let bytes = 0;
      await node.newArticle("Article", ""); // Warmp up to ensure the node is ready
      while (bytes <= 100_000) {
        try {
          bytes = i * 1000;
          const content = generateLoremIpsum(bytes);
          let totalDuration = 0;
          const attempts = 10;
          for (let attempt = 1; attempt <= attempts; attempt++) {
            const start = performance.now();
            await node.newArticle(`${attempt}_Article${bytes}`, content);
            const end = performance.now();
            totalDuration += end - start;
          }
          const averageDuration = totalDuration / attempts;
          durations.push(averageDuration);
          i++;
        } catch (error) {
          console.error(`Error in sample ${i + 1}:`, error);
          break; // Exit loop on error
        }
      }
      saveMetrics(durations, "newArticle_limit_time");
      expect(durations.length).toBeGreaterThan(0);

      const metrics = node.getMetrics();
      const results = metrics.getResults();
      saveMetrics(results.gasUsed, "newArticle_limit_gasUsed");
    },
    FIVE_MINUTES_TIMEOUT,
  );
});
