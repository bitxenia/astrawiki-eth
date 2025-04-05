import web3 from "./web3";
import { ArticleInfo, EthImpl, VersionInfo } from ".";
import articuloFactoryContractABI from "./contracts/out/ArticuloFactory.json";
import articuloContractABI from "./contracts/out/Articulo.json";
import articuloFactoryContractAddress from "./contracts/out/deployedAddress.json";
import {
  VersionManager,
  compileTextFromVersions,
  Version,
  newVersion,
  VersionID,
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
  }

  async getArticle(
    articleName: string,
    articleVersionID?: string
  ): Promise<ArticleInfo> {
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
    const contenido: string[] = await articuloInstance.methods
      .getContenido()
      .call();
    const versions: Version[] = contenido.map((version) => JSON.parse(version));
    console.log("versionsGET", versions);
    const versionManager = new VersionManager(versions);

    let branch: Version[] = [];
    if (articleVersionID) {
      branch = versionManager.getBranch(articleVersionID);
    } else {
      branch = versionManager.getMainBranch();
    }
    // Returns the text until the last version and the ID of the last version
    const articleContent = compileTextFromVersions(branch);
    const articleVersions = this.getVersions(versionManager);
    return {
      name: articleName,
      content: articleContent,
      versionsInfo: articleVersions,
    };
  }

  private getVersions(versionManager: VersionManager) {
    const mainBranch = new Set(
      versionManager.getMainBranch().map((version) => version.id)
    );
    console.log("getAllVersions", versionManager.getAllVersions());

    return versionManager.getAllVersions().map((version: Version) => {
      return {
        id: version.id,
        date: version.date,
        parent: version.parent,
        mainBranch: mainBranch.has(version.id),
      };
    });
  }

  async newArticle(articleName: string, articleContent: string): Promise<void> {
    const version = newVersion("", articleContent);
    const accounts = await web3.eth.getAccounts();
    const contenido = [JSON.stringify(version)];
    await this.factoryInstance.methods
      .crearArticulo(articleName, contenido)
      .send({
        from: accounts[0],
      });
  }

  async editArticle(
    articleName: string,
    newArticleContent: string
  ): Promise<void> {
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
    const contenido: string[] = await articuloInstance.methods
      .getContenido()
      .call();
    const versions: Version[] = contenido.map((version) => JSON.parse(version));
    console.log("versions", versions);
    const versionManager = new VersionManager(versions);
    const articleParentVersionID = this.getCurrentVersionID(versionManager);
    let version: Version;
    if (!articleParentVersionID) {
      // It means this is the first version
      version = newVersion(
        "",
        newArticleContent,
        articleParentVersionID ?? null
      );
    } else {
      const changesUntilVersion = versionManager.getBranch(
        articleParentVersionID
      );
      const oldText = compileTextFromVersions(changesUntilVersion);
      version = newVersion(oldText, newArticleContent, articleParentVersionID);
    }

    versionManager.addVersion(version);

    const accounts = await web3.eth.getAccounts();
    await articuloInstance.methods
      .addContenido(JSON.stringify(version))
      .send({ from: accounts[0] });
  }

  public getCurrentVersionID(versionManager: VersionManager) {
    const mainBranch = versionManager.getMainBranch();
    if (mainBranch.length === 0) {
      throw new Error("No versions found");
    }
    return mainBranch[mainBranch.length - 1].id;
  }

  async getArticleList(): Promise<string[]> {
    return this.factoryInstance.methods.getTitulos().call();
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
