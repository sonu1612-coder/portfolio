import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'num', title: 'Number (e.g. 01)', type: 'string' }),
    defineField({ name: 'name', title: 'Project Name', type: 'string' }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'link', title: 'Project Link', type: 'url' }),
    defineField({ name: 'img1', title: 'Image 1 (Left Top)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'img2', title: 'Image 2 (Left Bottom)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'img3', title: 'Image 3 (Right Large)', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
})
