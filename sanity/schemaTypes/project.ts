import { defineType, defineField, defineArrayMember } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Stills & video' },
    { name: 'meta', title: 'Search & sharing' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      description:
        'The project page address. Changing this breaks every existing link to the page.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'client',
      type: 'string',
      group: 'content',
      description: 'Panasonic, Xiaomi, ICTV… Shown on the card and used for the client strip.',
    }),
    defineField({
      name: 'year',
      type: 'number',
      group: 'content',
      validation: (r) => r.min(2010).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'content',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'One or two sentences. Shown on the card.',
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: 'services',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      description:
        'What you did on this project. Manage the list itself under Services — adding one there makes it available on every project.',
      // Two references to the same service would render a duplicate tag.
      validation: (r) => r.required().min(1).unique(),
    }),
    defineField({
      name: 'body',
      title: 'The full story',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        }),
      ],
      description:
        'Optional, and most projects will not have one. Worth writing only where there is a real story: the brief, the problem, what you did. Credits carry the page on their own.',
    }),
    defineField({
      name: 'credits',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'role', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        }),
      ],
      description:
        'Director, DoP, Production, Agency, Sound… Your own roles come from Services. These appear on the project card and are what let the page be indexed.',
    }),

    defineField({
      name: 'images',
      title: 'Stills',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              description: 'Optional. Describes the frame for screen readers.',
            }),
          ],
        }),
      ],
      description: 'The first still is the card cover — drag your strongest frame to the front.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'videos',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'url',
              type: 'url',
              validation: (r) =>
                r
                  .required()
                  .uri({ scheme: ['https'] })
                  .custom((v) =>
                    !v || /(youtu\.be|youtube\.com|vimeo\.com)/.test(v)
                      ? true
                      : 'Must be a YouTube or Vimeo link',
                  ),
            }),
            defineField({
              name: 'label',
              type: 'string',
              description: 'Only needed when a project has more than one video.',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Play video', subtitle }),
          },
        }),
      ],
      validation: (r) => r.max(3),
    }),

    defineField({
      name: 'featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description:
        'The first featured project supplies the share image used when the home page is posted as a link. Grid order comes from dragging projects in this list, not from this switch.',
    }),
    defineField({
      name: 'publishedToSearch',
      title: 'Let search engines index this page',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description:
        'Turn on once the project has credits filled in. Credits are what make the page worth finding — who directed it, who produced it, which agency. The full story is optional; most projects do not need one.',
      validation: (r) =>
        r.custom((value, context) => {
          const credits = (context.document as { credits?: unknown[] } | undefined)?.credits
          if (value && !credits?.length) {
            return 'Add credits before letting search engines index this page'
          }
          return true
        }),
    }),
    defineField({
      name: 'seo',
      title: 'Search & sharing overrides',
      type: 'object',
      group: 'meta',
      options: { collapsible: true, collapsed: true },
      description: 'Optional. Leave empty and the page uses the title, description and first still.',
      fields: [
        defineField({ name: 'metaTitle', type: 'string', validation: (r) => r.max(60) }),
        defineField({ name: 'metaDescription', type: 'text', rows: 2, validation: (r) => r.max(160) }),
        defineField({
          name: 'shareImage',
          type: 'image',
          description: '1200 × 630. Falls back to the first still.',
        }),
      ],
    }),

    orderRankField({ type: 'project' }),
  ],
  preview: {
    select: { title: 'title', client: 'client', year: 'year', media: 'images.0' },
    prepare: ({ title, client, year, media }) => ({
      title,
      subtitle: [client, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
