import web3 from "./web3";
import { ArticleInfo, EthImpl } from ".";
import articuloFactoryContractABI from "../contracts/out/ArticuloFactory.json";
import articuloContractABI from "../contracts/out/Articulo.json";
import articuloFactoryContractAddress from "../contracts/out/deployedAddress.json";
import {
  VersionManager,
  compileTextFromVersions,
  Version,
  newVersion,
} from "@bitxenia/wiki-version-manager";

export class EthEcosystem implements EthImpl {
  /*
  optIn?: OptIn = {
    createWithContent: true,
    optimizedSearch: false,
  };
    */

  factoryInstance: any;
  versionManager: VersionManager;

  async start(): Promise<void> {
    this.factoryInstance = new web3.eth.Contract(
      articuloFactoryContractABI,
      articuloFactoryContractAddress
    );
    this.versionManager = new VersionManager([]);
  }

  async getArticle(
    articleName: string,
    articleVersionID?: string
  ): Promise<ArticleInfo> {
    throw new Error("Method not implemented.");
    /*
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(articleName)
      .call();
    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new web3.eth.Contract(
      articuloContractABI,
      articuloAddress
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    const patches = JSON.parse(contenido);
    return new Article(name, patches);
    */
  }

  async newArticle(articleName: string, articleContent: string): Promise<void> {
    const version = newVersion("", articleContent);
    const accounts = await web3.eth.getAccounts();
    const contenido = version ? JSON.stringify([version]) : JSON.stringify([]);
    await this.factoryInstance.methods
      .crearArticulo(articleName, contenido)
      .send({
        from: accounts[0],
      });
    this.versionManager.addVersion(version);
  }

  async editArticle(
    articleName: string,
    newArticleContent: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
    /*
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(articleName)
      .call();
    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new web3.eth.Contract(
      articuloContractABI,
      articuloAddress
    );
    const contenido: string = await articuloInstance.methods.contenido().call();
    const patches = JSON.parse(contenido);
    patches.push(version);
    const accounts = await web3.eth.getAccounts();
    await articuloInstance.methods
      .setContenido(JSON.stringify(patches))
      .send({ from: accounts[0] });
      */
  }

  async getArticleList(): Promise<string[]> {
    throw new Error("Method not implemented.");
    /*
    return this.factoryInstance.methods.getTitulos().call();
    */
  }

  async stop(): Promise<void> {
    // No need to stop anything in this implementation
  }

  async searchArticles(
    query: string,
    limit: number,
    offset: number
  ): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
}

export default EthEcosystem;
