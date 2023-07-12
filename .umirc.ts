import { defineConfig } from 'umi';
import px2rem from 'postcss-plugin-px2rem';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  chainWebpack(memo) {
    memo.module.rule('js-in-node_modules').include.clear();
    return memo;
  },
  extraPostCSSPlugins: [
    px2rem({
      rootValue: 100, // 结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
      exclude: /antd|antd-mobile/i,
    }),
  ],
  headScripts: [`document.querySelector('html').style.fontSize = '50px'`],
  scripts: [
    `https://davidjbradshaw.github.io/iframe-resizer-react/js/iframeResizer.contentWindow.min.js`,
  ],
});
