import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'
import { fileURLToPath } from 'url'
import { Courses, CurriculumVersions, Faculty } from './collections/Academic'
import { MessageTemplates, PmbApplications, PmbDocuments, PmbTracks, PmbWaves } from './collections/Admissions'
import { Admins } from './collections/Admins'
import { ContentTranslations } from './collections/ContentTranslations'
import { Folders } from './collections/Folders'
import { ContactMessages, Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { McpContentAccounts } from './collections/McpContentAccounts'
import { CareerPaths, Faqs, JobPosts, Partners, Programs, Testimonials } from './collections/OtherContent'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { PostCategories, PostTags } from './collections/PostTaxonomies'
import { QuizAttempts, QuizQuestions, QuizResults } from './collections/Quiz'
import { AnalyticsEvents, AuditLogs, NotFoundLogs, Redirects, Roles } from './collections/System'
import { Tags } from './collections/Tags'
import { v1Endpoints } from './endpoints/v1'
import { seoGroupFields } from './fields'
import { Branding, Navigation, PmbSettings, SiteSettings } from './globals'
import { assertBrandContrast } from './lib/brand/tokens'
import { PROGRAM_NAME } from './lib/brand/identity'
import { pathForDoc, siteUrl } from './lib/preview'
import { readServerEnvironment } from './server/environment'
import { contentMcpConfig } from './server/content-mcp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const runtime = readServerEnvironment()

// Fail fast in development and during builds if the default design tokens break WCAG AA.
assertBrandContrast()

export default buildConfig({
  secret: runtime.secret,
  serverURL: runtime.siteURL,
  db: postgresAdapter({ pool: { connectionString: runtime.databaseURL }, idType: 'uuid', push: false }),
  editor: lexicalEditor(),
  email: process.env.SMTP_HOST && process.env.EMAIL_FROM_ADDRESS
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS,
        defaultFromName: PROGRAM_NAME,
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}),
        },
      })
    : () => ({
        name: 'unconfigured', defaultFromAddress: 'noreply@localhost', defaultFromName: PROGRAM_NAME,
        sendEmail: async () => { throw new Error('Email belum dikonfigurasi.') },
      }),
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    meta: { titleSuffix: ` · CMS ${PROGRAM_NAME}` },
    components: {
      providers: ['/components/admin/AdminTheme#AdminTheme'],
      beforeNavLinks: ['/components/admin/Brand#SidebarBrand'],
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
    },
    livePreview: {
      breakpoints: [
        { label: 'Ponsel', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    dashboard: {
      widgets: [
        { slug: 'siasat-sapa', label: 'Sapaan Siasat', Component: '/components/admin/dashboard/WelcomeWidget#WelcomeWidget', minWidth: 'medium' },
        { slug: 'kpi-mbd', label: 'Ringkasan KPI', Component: '/components/admin/dashboard/KpiWidget#KpiWidget', minWidth: 'medium' },
        { slug: 'perlu-tindakan', label: 'Perlu tindakan', Component: '/components/admin/dashboard/ActionsWidget#ActionsWidget' },
        { slug: 'penanda-isi', label: 'Pelacak penanda [ISI]', Component: '/components/admin/dashboard/PlaceholdersWidget#PlaceholdersWidget' },
        { slug: 'grafik-leads', label: 'Grafik leads', Component: '/components/admin/dashboard/ChartsWidget#ChartsWidget', minWidth: 'medium' },
      ],
      defaultLayout: [
        { widgetSlug: 'siasat-sapa', width: 'full' },
        { widgetSlug: 'kpi-mbd', width: 'full' },
        { widgetSlug: 'grafik-leads', width: 'full' },
        { widgetSlug: 'perlu-tindakan', width: 'medium' },
        { widgetSlug: 'penanda-isi', width: 'medium' },
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ] as never,
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'id',
    supportedLanguages: { id, en },
  },
  collections: [
    // Konten
    Pages,
    ContentTranslations,
    Posts,
    PostCategories,
    PostTags,
    Media,
    Folders,
    Tags,
    Testimonials,
    CareerPaths,
    Partners,
    Programs,
    JobPosts,
    Faqs,
    // Akademik
    CurriculumVersions,
    Courses,
    Faculty,
    // Penerimaan
    PmbApplications,
    Leads,
    ContactMessages,
    PmbWaves,
    PmbTracks,
    MessageTemplates,
    PmbDocuments,
    QuizQuestions,
    QuizResults,
    QuizAttempts,
    // Sistem
    Admins,
    McpContentAccounts,
    Roles,
    Redirects,
    NotFoundLogs,
    AuditLogs,
    AnalyticsEvents,
  ],
  globals: [SiteSettings, Branding, Navigation, PmbSettings],
  endpoints: v1Endpoints,
  jobs: {
    // Runs scheduled publish/unpublish jobs on long-running servers.
    // Serverless deployments should also call `payload jobs:run` on a schedule (see README).
    autoRun: [{ cron: '* * * * *', queue: 'default' }],
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [
    mcpPlugin(contentMcpConfig),
    seoPlugin({
      collections: ['pages', 'posts', 'courses', 'faculty'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `${(doc as Record<string, string>)?.title ?? (doc as Record<string, string>)?.name ?? ''} · MBD ISTTS`,
      generateDescription: ({ doc }) => {
        const d = doc as Record<string, string | undefined>
        return d?.excerpt ?? d?.shortDescription ?? d?.bio ?? ''
      },
      generateURL: ({ doc, collectionConfig }) => `${siteUrl()}${pathForDoc(collectionConfig?.slug ?? '', doc as { slug?: string })}`,
      fields: ({ defaultFields }) => [...defaultFields, ...seoGroupFields()],
    }),
  ],
})
