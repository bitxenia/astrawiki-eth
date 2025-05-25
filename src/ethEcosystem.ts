import { ArticleInfo, EthImpl } from ".";
import { VersionManager, VersionID } from "@bitxenia/wiki-version-manager";
import { ArticleRepository } from "./articleRepository";
import TransactionMetrics from "./transactionMetrics";

export class EthEcosystem implements EthImpl {
  /*
  optIn?: OptIn = {
    createWithContent: true,
    optimizedSearch: false,
  };
    */

  articleRepository: ArticleRepository;
  lastVersionFetchedByArticle: Map<string, VersionID>;
  versionManager: VersionManager;
  transactionMetrics: TransactionMetrics;

  async start(): Promise<void> {
    this.transactionMetrics = new TransactionMetrics();
    this.articleRepository = new ArticleRepository(this.transactionMetrics);
    this.lastVersionFetchedByArticle = new Map();
  }

  async getArticle(
    articleName: string,
    articleVersionID?: string,
  ): Promise<ArticleInfo> {
    const article = await this.articleRepository.getArticle(articleName);

    // Update the last version fetched.
    this.lastVersionFetchedByArticle.set(
      articleName,
      article.getCurrentVersionID(),
    );
    const articleContent = article.getContent(articleVersionID);
    const articleVersions = article.getVersions();

    return {
      name: articleName,
      content: articleContent,
      versionsInfo: articleVersions,
    };
  }

  async newArticle(articleName: string, articleContent: string): Promise<void> {
    await this.articleRepository.newArticle(articleName, articleContent);
  }

  async editArticle(
    articleName: string,
    newArticleContent: string,
  ): Promise<void> {
    // TODO: See if somehow an edit to a not previously fetched article is possible.
    const lastVersionFetched =
      this.lastVersionFetchedByArticle.get(articleName);

    if (!lastVersionFetched) {
      throw Error(
        `Article ${articleName} was not previously fetched. Fetched articles: ${this.lastVersionFetchedByArticle.keys()}`,
      );
    }

    await this.articleRepository.addVersion(
      articleName,
      newArticleContent,
      lastVersionFetched,
    );
  }

  async getArticleList(): Promise<string[]> {
    return this.articleRepository.getArticleList();
  }

  async stop(): Promise<void> {
    // No need to stop anything in this implementation
  }

  async searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  getMetrics(): TransactionMetrics {
    return this.transactionMetrics;
  }
}

export default EthEcosystem;
