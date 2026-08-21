import { defineType, defineField } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * The craft terms shown on every card ("Editing", "Color Grading"…). These used
 * to be a hardcoded list in this file, which meant adding one needed an
 * engineer. Documents instead — same reasoning as `category`.
 *
 * Still a closed set from the editor's point of view: projects reference these
 * documents, so "Sound design" and "Sound Design" can't both end up on cards.
 */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Shown as a tag on project cards and pages.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    orderRankField({ type: 'service' }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
