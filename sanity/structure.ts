import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * Both lists are drag-to-reorder. Project order decides the grid order on the
 * site, and category order decides the order of the filter buttons.
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
    ])
