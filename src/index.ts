import EthEcosystem from "./ethEcosystem";
import TransactionMetrics from "./transactionMetrics";

/**
 * Creates an instance of EthImplNode.
 *
 * The node is started by default.
 *
 * @function createEthImplNode
 * @param {EthImplInit} init Options used to create an EthImpl
 * @instance
 */
export async function createEthImplNode(): Promise<EthImpl> {
  const node = new EthEcosystem();
  await node.start();
  return node;
}

/**
 * The API presented by a Node
 */
export interface EthImpl {
  /**
   * Starts the Node
   */

  start(): Promise<void>;

  /**
   * Gets an existing article
   */
  getArticle(
    articleName: string,
    articleVersionID?: string,
  ): Promise<ArticleInfo>;

  /**
   * Creates a new article
   */
  newArticle(articleName: string, articleContent: string): Promise<void>;

  /**
   * Edits an existing article
   */
  editArticle(articleName: string, newArticleContent: string): Promise<void>;

  /**
   * Gets the list of articles in the wiki
   */
  getArticleList(): Promise<string[]>;

  /**
   * Retrieves the metrics of the transactions
   */
  getMetrics(): TransactionMetrics;

  /**
   * Stops the Node
   */
  stop(): Promise<void>;
}

export type ArticleInfo = {
  name: string;
  content: string;
  versionsInfo: VersionInfo[];
};

export type VersionInfo = {
  id: string;
  date: string;
  parent: string | null;
  mainBranch: boolean;
};
