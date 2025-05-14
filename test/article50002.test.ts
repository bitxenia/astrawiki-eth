import hre from "hardhat";
import { generateLoremIpsum } from "./utils";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Article 5000 bytes", () => {
  const ARTICLE_NAME = "Article5000";

  async function deployArticuloFactory() {
    const ArticuloFactory =
      await hre.ethers.getContractFactory("ArticuloFactory");
    return await ArticuloFactory.deploy();
  }

  it("measure time for newArticle with 5000 bytes", async function () {
    const articuloFactory = await loadFixture(deployArticuloFactory);
    const largeContent = generateLoremIpsum(5000);
    await articuloFactory.crearArticulo(ARTICLE_NAME, [largeContent]);
  });

  it("measure time for newArticle with 5000 bytes2", async function () {
    const articuloFactory = await loadFixture(deployArticuloFactory);
    const largeContent = generateLoremIpsum(5000);
    await articuloFactory.crearArticulo(ARTICLE_NAME, [largeContent]);
  });
});
