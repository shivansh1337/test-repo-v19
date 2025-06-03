/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Test Title',
  author: process.env.NEXT_PUBLIC_AUTHOR || 'Test Author',
  headerTitle: process.env.NEXT_PUBLIC_HEADER_TITLE || 'Test Header Title',
  descriptionTitle: process.env.NEXT_PUBLIC_DESCRIPTION_TITLE || 'Test Description Title',
  description: process.env.NEXT_PUBLIC_DESCRIPTION || 'Test Description',
  language: process.env.NEXT_PUBLIC_LANGUAGE || 'en-us',
  theme: process.env.NEXT_PUBLIC_THEME || 'system', // system, dark or light
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.test.com',
  mainSiteUrl: process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.test.com', // URL for the main company website
  siteRepo: process.env.NEXT_PUBLIC_SITE_REPO || 'https://github.com/',
  siteLogo: `${process.env.BASE_PATH || ''}${process.env.NEXT_PUBLIC_SITE_LOGO || '/static/images/logo.png'}`,
  socialBanner: `${process.env.BASE_PATH || ''}${process.env.NEXT_PUBLIC_SOCIAL_BANNER || '/static/images/twitter-card.png'}`,
  mastodon: process.env.NEXT_PUBLIC_MASTODON || 'https://mastodon.social/@test',
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@test.com',
  logo_light: process.env.NEXT_PUBLIC_LOGO_LIGHT || `${process.env.BASE_PATH}/static/favicons/logo.png`, 
  logo_dark: process.env.NEXT_PUBLIC_LOGO_DARK || `${process.env.BASE_PATH}/static/favicons/logo-light.png`,
  // github: 'https://github.com',
  // x: process.env.NEXT_PUBLIC_X || 'https://twitter.com/test/',
  // twitter: 'https://twitter.com/Twitter',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  // linkedin: 'https://www.linkedin.com',
  // threads: 'https://www.threads.net',
  // instagram: process.env.NEXT_PUBLIC_INSTAGRAM || 'https://www.instagram.com/test',
  // medium: 'https://medium.com',
  // bluesky: 'https://bsky.app/',
  locale: process.env.NEXT_PUBLIC_LOCALE || 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: process.env.NEXT_PUBLIC_STICKY_NAV === 'true',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '9c033916-e659-4018-b4f5-f1728b34a477',
      src: process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://miny-analytics.pikapod.net/script.js'
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    googleAnalytics: {
      googleAnalyticsId: '', // e.g. G-XXXXXXX
    },
  },
  newsletter: {
    provider: 'resend',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
