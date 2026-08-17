import { defineType, defineField } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * Brands and broadcasters shown in the Clients strip on the home page.
 *
 * Deliberately NOT connected to `project.client`: this strip is a curated
 * roster, while the project field is a per-project fact. Keeping them separate
 * means tagging a one-off client on a project never silently adds a logo to the
 * home page.
 */
export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'Shown as the label, and used instead of the logo until one is uploaded.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      description:
        'SVG or transparent PNG, ideally a single-colour white version — the strip sits on a dark background. Without a logo the name is shown as text instead, so a client is never missing.',
    }),
    defineField({
      name: 'invertLogo',
      title: 'Logo is dark — brighten it',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on if the logo is black or dark and disappears against the dark background.',
    }),
    defineField({
      name: 'website',
      type: 'url',
      description: 'Optional. Makes the logo a link.',
      validation: (r) => r.uri({ scheme: ['https', 'http'] }),
    }),
    orderRankField({ type: 'client' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
