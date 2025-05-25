import { DEFAULT_RETURN_FORMAT, FormatType, TransactionReceipt } from "web3";

/**
 * TransactionMetrics class to record and calculate metrics related to transactions.
 */
export class TransactionMetrics {
  private gasUsed: number[];

  constructor() {
    this.gasUsed = [];
  }

  async recordTransaction(
    transaction: FormatType<TransactionReceipt, typeof DEFAULT_RETURN_FORMAT>,
  ): Promise<void> {
    const weiValue = transaction.gasUsed * transaction.effectiveGasPrice;
    const ethValue = parseFloat(weiValue.toString()) * 1e-18;
    this.gasUsed.push(ethValue);
  }

  getResults() {
    return {
      gasUsed: this.gasUsed,
    };
  }
}

export default TransactionMetrics;
