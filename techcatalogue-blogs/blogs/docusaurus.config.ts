import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Tech Catalogue Blogs',
  tagline: 'Learn about the latest news and updates from Tech Catalogue',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/blogs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'thetechcatalogue', // Usually your GitHub org/user name.
  projectName: 'techcatalogue-blogs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  markdown:{
    mermaid: true,

    // rehypePlugins: [
    //   require('rehype-slug'),
    //   require('rehype-autolink-headings'),
    //   require('rehype-external-links'),
    // ],
    // remarkPlugins: [
    //   require('remark-autolink-headings'),
    //   require('remark-external-links'),
    // ],
  },  
  themes: [
    [require.resolve("@easyops-cn/docusaurus-search-local"), ({indexBlog: false, docsRouteBasePath: "/"})],
    // [require.resolve("@docusaurus/theme-mermaid"), {}],
    ['@docusaurus/theme-live-codeblock',{}]
  ],

  scripts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/9.2.2/mermaid.min.js',
      async: true,
    },
  ],
  plugins: [
    '@docusaurus/theme-mermaid'
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Tech Catalogue Blogs',
      logo: {
        alt: 'Tech Catalogue Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'learn',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/thetechcatalogue/blogs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'learning',
              to: 'docs/category/learn',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/thetechcatalogue',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TechCatalogue, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
