import { expect } from "chai";
import { createEthImplNode, EthImpl } from "../src";
import { generateLoremIpsum, saveMetrics } from "./utils";

describe("Article 5000 bytes", () => {
  let node: EthImpl;

  before(async () => {
    node = await createEthImplNode();
  });

  const FIVE_MINUTES_TIMEOUT = 1000 * 60 * 5;
  const ARTICLE_NAME = "Article5000";

  it("measure 1000 samples of time for newArticle with 5000 bytes", async function () {
    this.timeout(FIVE_MINUTES_TIMEOUT);
    const durations: number[] = [];
    for (let i = 0; i < 1000; i++) {
      try {
        const largeContent = generateLoremIpsum(5000);
        const start = performance.now();
        await node.newArticle(`${ARTICLE_NAME}${i + 1}`, largeContent);
        const end = performance.now();
        const duration = end - start;
        durations.push(duration);
      } catch (error) {
        console.error(`Error in sample ${i + 1}:`, error);
      }
    }
    saveMetrics(durations, "newArticle5000_time");
    expect(durations.length).to.equal(1000);

    const metrics = node.getMetrics();
    const results = metrics.getResults();
    saveMetrics(results.gasUsed, "newArticle5000_gasUsed");
  });
});
