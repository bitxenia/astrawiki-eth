import * as fs from "fs";

/**
 * Saves the metrics to a file in the metrics directory
 * @param results - the metrics to save
 * @param filename - the name of the file to save the metrics to
 */
export const saveMetrics = (results: number[], filename: string) => {
  const metricsDir = `${__dirname}/../../metrics`;
  if (!fs.existsSync(metricsDir)) {
    fs.mkdirSync(metricsDir);
  }
  const timeStamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\..+/, "");
  const fullFilename = `${metricsDir}/${filename}_${timeStamp}.json`;
  fs.writeFileSync(fullFilename, JSON.stringify(results, null, 2));
  console.log(`Metrics written to ${fullFilename}`);
};
