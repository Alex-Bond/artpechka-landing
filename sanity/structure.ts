import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * All three lists are drag-to-reorder. Project order decides the grid order on
 * the site, category order decides the order of the filter buttons, and service
 * order decides the order of the tags on a card.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'category',
        title: 'Categories',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'service',
        title: 'Services',
        S,
        context,
      }),
    ])
