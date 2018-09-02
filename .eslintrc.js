module.exports = {
    "env": {
      "node": true,
      "browser": true,
      "jest": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "ecmaVersion": 6
      },
    "rules": {
      "no-console": "off",
      "indent": [
            "error",
            2,
            {"SwitchCase": 1}
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            1,
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
    }
};
