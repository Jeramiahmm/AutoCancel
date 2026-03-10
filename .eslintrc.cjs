module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-undef": "off",
    "no-unused-vars": "off",
  },
  ignorePatterns: ["**/dist/**", "**/.next/**", "**/node_modules/**"],
};
