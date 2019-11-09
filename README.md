# v-datatable-ext

An Extension for Vuetify [DataTable](https://vuetifyjs.com/en/components/data-tables)
This component make v-data-table more flexible, such as
  - Remote request for records
  - Customized buttons in table header and the last column (as action column)
  - Customized filtrations in table header
  - Colorized a text of a record even by a condition
  - Tell component which column is for avatar/tick
  - Show row number or not
  - Easy to define rows-per-page-items

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Prop
setting

```php
# php
<DataTableExt :setting="{{ json_encode($settings) }}"/>
```
```js
/* Example for setting prop */
let settings = {
  // 'headers' defines the table columns
  // 'text' is column head name
  // 'value' is the key of json object returned from backend. See 'debug.data' below
  // 'format' indicates the column style:
  //    'color': a more color property is needed. Its value should be the hex color string or an object in which 'prop' defined the key of json object returned from backend and the other key => value pairs indicate the record[key] => color
  //    'avatar': the value is a url to an image
  //    'tick': if the value is 0 then a tick will be shown, otherwise a cross mark will be shown
  headers: [
    { text: 'ID',         value: 'id', },
    { text: 'Name',       value: 'name',       format: 'color',  color: { prop: 'type', '2': '#FF0000'} },
    { text: 'Icon',       value: 'icon',       format: 'avatar', sortable: false },
    { text: 'Quaulified', value: 'quaulified', format: 'tick' },
  ],
  // 'showRow': Whether a row number column should be shown
  showRow: true,
  // 'selectable': Whether a checkbox column should be shown
  selectable: true,
  // 'selectEvents': Defines your custom buttons in table header
  //    'delete'(true|string): a red button with the given text in it. By clicking it, a post request to 'urlToDelete' with the id collection of selected items
  //    'actions'(array): Custom buttons.
  //      'always'(boolean): TRUE - Always be pressable; FALSE - Pressable only when any item is selected
  //      'text'(string): the button text
  //      'color'(string): the button color
  //      'event'(string): the event string emitted once pressed. You need to listen to this event by yourself.
  selectEvents: {
          delete: 'Delete some',
          actions: [
            { always:true, text:'Export', color:'light-green lighten-1', event:'evtExport' }
          ]
        },
    //  'pagination'(object): The built-in prop of v-data-table. If 'rowsPerPage' is not one of 'rowsPerPageItems', it will be ignored.
        pagination: { page:1, rowsPerPage:10, totalItems:0 },
    //  'rowsPerPageItems'(array): The enum numbers indicate kinds of rows-per-page-items
        rowsPerPageItems: [25, 50, 100],
    //  'filterList'(array): Put some dropdown lists in table header
    //    'hint'(string): the list text
    //    'items'(array): id-name pairs. If any item is selected, the id will be sent to backend.
        filterList: [
          { hint: 'Gender', items: [{ id:0, name:'Female' }, { id:1, name:'Male' }, { id:2, name:'Need backend to filter' }] },
          { hint: 'Level',  items: [{ id:0, name:'Engineer' }, { id:1, name:'Manager' }, { id:2, name:'Need backend to filter' }] },
        ],
    //  'buttons'(object): The buttons in the last column (except 'new' due to historic reason)
    //    'new': A button in table header for creating a new item. The only diff from 'selectEvents' is that it can be shown on the left of 'selectEvents.delete' button.
    //     'edit': A pencil-icon button to trigger event. It is supposed to handle item edit.
    //      'delete'(boolean): A trash-icon button to send request to 'urlToDelete' with item id
    //      'actions'(array):
    //        'text' - button text. Use ?: operator to show different texts by an item key;
    //        'icon' - button icon having higher priority to 'text'. Use ?: operator to show different icons by an item key
    //        'event' - the event string to send
    //        'lazyLoad' - fetch from 'url' before triggering the event with the returned json object[retKey]
        buttons: {
          new:  { text:'New Member', event: 'evtNewMember' },
          edit: { text:'Change', event: 'evtChange' },
          delete: true,
          actions: [
            { text:'deleted?Restore:Delete', icon:'deleted?fa-redo:fa-times', event:'evtSwitch' },
            { text:'Do It', icon:'fa-user', event:'openDetail', lazyLoad: { url:'/member/detail', retKey:'member' } }
          ]
        },
//      'url'(string): The url to fetch the items with following params appended.
//         page: the current page number
//         row: the row number per page
//         query: the search string
//         filter[0...n]: the values of filter lists
//         sortBy: by which column need to sort
//         direction: sort direction
        url: '/list',
//     'urlToDelete': the url send post request to. It is supposed to delete item(s)
        urlToDelete: '/delete',
      }
```

License
----

MIT


**Free Software, Hell Yeah!**

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
