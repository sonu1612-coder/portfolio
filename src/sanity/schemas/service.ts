import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'num', title: 'Number (e.g. 01)', type: 'string' }),
    defineField({ name: 'name', title: 'Service Name', type: 'string' }),
    defineField({ name: 'desc', title: 'Description', type: 'text' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'num' },
  },
})
