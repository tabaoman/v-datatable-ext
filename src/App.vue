<template>
  <v-app>
    <DataTableExt :setting="settings"/>
  </v-app>
</template>

<script>
import DataTableExt from './components/DataTableExt'

export default {
  name: 'App',
  components: {
    DataTableExt
  },
  data () {
    return {
      settings: {
        headers: [
          { text: 'ID',         value: 'id', },
          { text: 'Name',       value: 'name',       format: 'color',  color: { prop: 'type', '2': '#FF0000'} },
          { text: 'Icon',       value: 'icon',       format: 'avatar', sortable: false },
          { text: 'Quaulified', value: 'quaulified', format: 'tick' },
        ],
        showRow: true,
        selectable: true,
        selectEvents: {
          delete: 'Delete some',
          actions: [
            { always:true, text:'Export', color:'light-green lighten-1', event:'evtExport' }
          ]
        },
        pagination: { page:1, rowsPerPage:10, totalItems:0 },
        rowsPerPageItems: [25, 50, 100],
        filterList: [
          { hint: 'Gender', items: [{ id:0, name:'Female' }, { id:1, name:'Male' }, { id:2, name:'Need backend to filter' }] },
          { hint: 'Level',  items: [{ id:0, name:'Engineer' }, { id:1, name:'Manager' }, { id:2, name:'Need backend to filter' }] },
        ],
        buttons: {
          new:  { text:'New Member', event: 'evtNewMember' },
          edit: { text:'Change', event: 'evtChange' },
          delete: true,
          actions: [
            { text:'deleted?Restore:Delete', icon:'deleted?fa-redo:fa-times', event:'evtSwitch' },
            { text:'DoIt', icon:'fa-user', event:'openDetail', lazyLoad: { url:'/member/detail', retKey:'member' } }
          ]
        },
        url: '/data.json',
        urlToDelete: '/delete',

        debug: true
      }
    };
  },
  mounted() {
    Bus.$on('evtNewMember', () => {
      alert('Action to create a new member');
    });
    Bus.$on('evtChange', (member) => {
      alert('Action to change [' + member.name + ']');
    });
    Bus.$on('evtSwitch', (member) => {
      alert('Custom action to [' + member.name + ']');
    });
    Bus.$on('openDetail', (member) => {
      alert('Custom action to [' + member.name + "]\nHere is to open for detail as an example.");
    });
    Bus.$on('evtExport', (members, evt) => {
      alert('Custom action to export [' + members.length + "] members.");
    });
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
