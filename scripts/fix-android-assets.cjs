const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const splashIconSource = path.join(projectRoot, "assets/splash-icon.png");
const splashIconTarget = path.join(
  projectRoot,
  "android/app/src/main/res/drawable/splash_icon.png",
);
const adaptiveIconFiles = [
  "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml",
  "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml",
];

fs.copyFileSync(splashIconSource, splashIconTarget);

for (const relativePath of adaptiveIconFiles) {
  const filePath = path.join(projectRoot, relativePath);
  const xml = fs.readFileSync(filePath, "utf8");
  const nextXml = xml
    .replace(
      /<background>\s*<inset android:drawable="(@mipmap\/ic_launcher_background)" android:inset="16\.7%" \/>\s*<\/background>/,
      '<background android:drawable="$1" />',
    )
    .replace(
      /<foreground>\s*<inset android:drawable="(@mipmap\/ic_launcher_foreground)" android:inset="16\.7%" \/>\s*<\/foreground>/,
      '<foreground android:drawable="$1" />',
    );

  fs.writeFileSync(filePath, nextXml);
}
