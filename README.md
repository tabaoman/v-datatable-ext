# v-datatable-ext (with a widget of date time picker)
An Extension of Vuetify [DataTable](https://vuetifyjs.com/en/components/data-tables)
![Preview](http://soulead.com/storage/github/v-datatable-ext2.png)
This component make v-data-table easier and more flexible, such as
  - Remote request for records
  - Customized buttons in table header and the last column (as action column)
  - Customized filtrations in table header
  - Colorized a text of a record even by a condition
  - Tell component which column is for avatar/tick
  - Show row number or not
  - Easy to define rows-per-page-items

## Run the example locally
```sh
git clone https://github.com/tabaoman/v-datatable-ext
cd v-datatable-ext
npm install
npm run dev
```
And then visit http://localhost:8080 in your favorate browser.

## Prop
setting

```php
# php
// Directly use
<DataTableExt :setting="{{ json_encode($settings) }}"/>
// Import as a component. See below
<v-datatable-ext :setting="{{ json_encode($settings) }}"/>
<v-datetime-picker :label="{{ $label }}" />
```
Import as a component
```js
import DataTableExt from 'v-datatable-ext';
Vue.use(DataTableExt);
const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({}),
    components: { DataTableExt }
});
```
## Explain the use of 'setting' prop
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
  //    'type'(string): show a date time picker if its value is 'datetime' (the only value)
  filterList: [
    { hint: 'Gender', items: [{ id:0, name:'Female' }, { id:1, name:'Male' }, { id:2, name:'Need backend to filter' }] },
    { hint: 'Level',  type: 'datetime' },
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
  //      'url'(string): The url to perform GET request for the items with following params appended.
  //         page: the current page number
  //         row: the row number per page
  //         query: the search string
  //         filter[0...n]: the values of filter lists
  //         sortBy: by which column need to sort
  //         direction: sort direction
  //       The returned json object:
  //         'data'(array): the new list of items
  //         'total'(int): the total number of items
  //         'setting'(object): Optional. You can reset the data table with a new setting
  url: '/list',
  //     'urlToDelete': the url send PUT request to. It is supposed to delete item(s)
  urlToDelete: '/delete',
}
```

License
----

MIT


**Free Software, Hell Yeah!**
