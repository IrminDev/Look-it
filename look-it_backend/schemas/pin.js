export default {
    name: 'pin',
    tittle: 'Pin',
    type: 'document',
    fields: [
        {
            name: 'tittle',
            tittle: 'Tittle',
            type: 'string'
        },
        {
            name: 'about',
            tittle: 'About',
            type: 'string'
        },
        {
            name: 'destination',
            tittle: 'Destination',
            type: 'url'
        },
        {
            name: 'category',
            tittle: 'Category',
            type: 'string'
        },
        {
            name: 'image',
            tittle: 'Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'userId',
            tittle: 'UserId',
            type: 'string'
        },
        {
            name: 'postedBy',
            tittle: 'PostedBy',
            type: 'postedBy'
        },
        {
            name: 'save',
            tittle: 'Save',
            type: 'array',
            of: [{ type: 'save'}]
        },
        {
            name: 'comments',
            tittle: 'Comments',
            type: 'array',
            of: [{ type: 'comment'}]
        },
    ]
}