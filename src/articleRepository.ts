import { Web3Singleton } from "./web3";
import articuloFactoryContractABI from "../contracts/out/ArticuloFactory.json";
import articuloContractABI from "../contracts/out/Articulo.json";
import articuloFactoryContractAddress from "../contracts/out/deployedAddress.json";
import { Article } from "./article";
import { newVersion, Version } from "@bitxenia/wiki-version-manager";
import Web3 from "web3";

export class ArticleRepository {
  factoryInstance: any;
  web3: Web3;

  constructor() {
    this.web3 = Web3Singleton.instance;
    this.factoryInstance = new this.web3.eth.Contract(
      articuloFactoryContractABI,
      articuloFactoryContractAddress,
    );
  }

  async getArticle(articleName: string): Promise<Article> {
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(articleName)
      .call();

    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new this.web3.eth.Contract(
      articuloContractABI,
      articuloAddress,
    );

    const contenido: string[] = await articuloInstance.methods
      .getContenido()
      .call();

    const versions: Version[] = contenido.map((version) => JSON.parse(version));
    return new Article(articleName, versions);
  }

  async newArticle(articleName: string, articleContent: string): Promise<void> {
    const version = newVersion("", articleContent);
    const accounts = await this.web3.eth.getAccounts();
    const contenido = [JSON.stringify(version)];
    await this.factoryInstance.methods
      .crearArticulo(articleName, contenido)
      .send({
        from: accounts[0],
      });
  }

  async addVersion(
    articleName: string,
    newArticleContent: string,
    lastVersionFetched?: string,
  ): Promise<void> {
    const articuloAddress: string = await this.factoryInstance.methods
      .tituloToAddress(articleName)
      .call();

    if (!articuloAddress) {
      return Promise.reject("Article not found");
    }

    const articuloInstance = new this.web3.eth.Contract(
      articuloContractABI,
      articuloAddress,
    );

    const article = await this.getArticle(articleName);
    const newVersion = article.newContent(
      newArticleContent,
      lastVersionFetched,
    );

    const accounts = await this.web3.eth.getAccounts();
    await articuloInstance.methods
      .addContenido(JSON.stringify(newVersion))
      .send({ from: accounts[0] });
  }

  async getArticleList(): Promise<string[]> {
    return this.factoryInstance.methods.getTitulos().call();
  }
}
