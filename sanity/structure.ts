import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * Every list is drag-to-reorder. Project order decides the grid order on the
 * site, category order the filter buttons, service order the tags on a card,
 * and client order the logo strip on the home page.
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
      orderableDocumentListDeskItem({
        type: 'client',
        title: 'Clients',
        S,
        context,
      }),
    ])
