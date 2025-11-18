# React + TypeScript + Vite

This template provides a clean and minimal setup for building React applications with **TypeScript** using **Vite**.  
You also get built-in Hot Module Replacement (HMR) and basic ESLint rules to help you write safe and consistent code.

---

## 🚀 Available Official Plugins

### **1. @vitejs/plugin-react**
Uses **Babel** for React Fast Refresh.  
Repo: https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md

### **2. @vitejs/plugin-react-swc**
Uses **SWC** for faster builds and transformations.  
Repo: https://github.com/vitejs/vite-plugin-react-swc

---

## 🧹 Enhancing ESLint for Production

If you're building a real production-grade application, consider enabling **type-aware** linting.  
This allows ESLint to understand and check TypeScript types properly.

---

### Update `parserOptions`

In your ESLint configuration file, update the top-level `parserOptions`:

```js
export default {
  // other existing rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
