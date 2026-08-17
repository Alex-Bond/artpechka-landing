import { defineType, defineField } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Shown on the portfolio filter buttons.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    orderRankField({ type: 'category' }),
  ],
})
