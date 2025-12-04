import fs from "fs";
import path from "path";
import type { Color } from "../src/alvarobarril";
import { alvarobarrilColors } from "../src/alvarobarril";

Error.stackTraceLimit = 0;

function parseGpl(filePath: string): Color[] {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const colors: Color[] = [];
  const rowPattern = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.+?)\s*$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (
      !line ||
      line.startsWith("#") ||
      line.startsWith("GIMP Palette") ||
      line.startsWith("Name:") ||
      line.startsWith("Columns:")
    ) {
      continue;
    }

    const match = rowPattern.exec(line);
    if (!match) {
      throw new Error(`Unrecognized palette line: "${rawLine}"`);
    }

    const [, r, g, b, name] = match;
    colors.push({ name, r: Number(r), g: Number(g), b: Number(b) });
  }

  return colors;
}

const main = () => {
  const gplColors = parseGpl(
    path.join(__dirname, "..", "src", "vilaralbaro.gpl")
  );

  if (gplColors.length !== alvarobarrilColors.length) {
    throw new Error(
      `Count mismatch: GPL has ${gplColors.length} colors but TypeScript exports ${alvarobarrilColors.length}`
    );
  }

  for (let i = 0; i < gplColors.length; i += 1) {
    const gpl = gplColors[i];
    const ts = alvarobarrilColors[i];
    const same =
      gpl.name === ts.name &&
      gpl.r === ts.r &&
      gpl.g === ts.g &&
      gpl.b === ts.b;
    if (!same) {
      const entryIndex = i + 1;
      const gplLine = `${gpl.r} ${gpl.g} ${gpl.b} ${gpl.name}`;
      const tsLine = `${ts.r} ${ts.g} ${ts.b} ${ts.name}`;
      throw new Error(
        `Mismatch at entry ${entryIndex}: gpl="${gplLine}" ts="${tsLine}"`
      );
    }
  }

  console.log("vilarAlbaroColors matches vilaralbaro.gpl exactly.");
};

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
