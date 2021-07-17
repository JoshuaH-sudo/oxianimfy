const config = {
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "\\.(css|scss|less)$": "identity-obj-proxy",
    "^@ionic/storage":
      "<rootDir>/node_modules/@ionic/storage/dist/esm/index.d.ts",
  },
};

module.exports = config;
