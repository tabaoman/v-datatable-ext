<template>
    <v-layout row>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <v-btn v-if="typeof tabSetting.buttons.new == 'object'"
                           class="mr-1"
                           small
                           v-html="tabSetting.buttons.new.text"
                           @click="newItem()"
                    >
                    </v-btn>
                    <v-btn
                            v-if="tabSetting.selectable && tabSetting.selectEvents.delete"
                            class="mr-1"
                            small color="#ff5252"
                            style="color:white;"
                            :disabled="selected.length === 0"
                            @click="deleteItems">
                        {{ (typeof tabSetting.selectEvents.delete) == 'string' ? tabSetting.selectEvents.delete : '批量删除' }}
                    </v-btn>
                    <template v-if="tabSetting.selectEvents.actions">
                        <template v-for="act in tabSetting.selectEvents.actions">
                            <v-btn
                                    small :color="act.color"
                                    :disabled="(act.hasOwnProperty('always') ? (act.always ? false : selected.length === 0) : selected.length === 0)"
                                    @click="(e) => actionItems(act, e)"
                            >{{ act.text }}</v-btn>
                        </template>
                    </template>
                    <v-spacer></v-spacer>
                    <template v-for="(f, i) in tabSetting.filterList">
                        <v-combobox
                                v-if="f.hasOwnProperty('items') && f.items.length !== 0"
                                v-model="filter[i]"
                                :items="f.items"
                                :item-text="f.text || 'name'"
                                :item-value="f.value || 'id'"
                                :label="f.hint"
                                clearable
                                @change="performLoad"
                        ></v-combobox>
                        <DateTimePicker
                                v-else-if="f.hasOwnProperty('type') && f.type === 'datetime'"
                                v-model="filter[i]"
                                :label="f.hint"
                                @input="performLoad"
                        ></DateTimePicker>
                    </template>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="搜索"
                            single-line
                            hide-details
                            class="mb-3"
                            @change="performLoad">
                    </v-text-field>
                </v-card-title>
                <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :show-select="tabSetting.selectable"
                        :options.sync="pagination"
                        :footer-props="{
                            itemsPerPageText: '每页行数',
                            itemsPerPageOptions: tabSetting.hasOwnProperty('rowsPerPageItems') ? tabSetting.rowsPerPageItems: [10,15,25]
                        }"
                        :server-items-length="total"
                        :items="data"
                        :loading="loading"
                        class="elevation-1"
                >
                    <template v-slot:body="{ items }">
                        <tbody>
                        <tr v-for="(item, row) in items"
                            :style="item.deleted ? 'background-color:#fcbba6;' : 'background-color:transparent;'"
                        >
                            <td v-if="tabSetting.selectable">
                                <v-checkbox v-model="selected" primary hide-details class="mt-0 pt-0" :value="item"></v-checkbox>
                            </td>
                            <td
                                v-for="head in headers"
                                v-if="head.hasOwnProperty('value')"
                                v-html="toVal(item, head)"
                                @click="clickCell(item, head)"
                            ></td>
                            <td v-else-if="head.rowNum">{{ row + 1 }}</td>
                            <td v-else>
                                <v-icon
                                    v-if="typeof tabSetting.buttons.edit.event == 'string' && tabSetting.buttons.edit.event.length > 0"
                                    small class="mr-2 btn-action"
                                    @click="(e) => { editItem(item, e); }"
                                    style="cursor:pointer;"
                                >edit</v-icon>
                                <v-icon
                                    v-if="tabSetting.buttons.delete"
                                    small class="mr-2 btn-action"
                                    @click="(e) => { deleteItem(item, e); }"
                                >delete</v-icon>
                                <template v-if="tabSetting.buttons.actions">
                                    <template v-for="btn in tabSetting.buttons.actions">
                                        <template v-if="actionVisible(item, btn)">
                                            <template v-if="btn.href">
                                                <a :href="btn.href + item.id" class="v-icon">
                                                    <v-icon v-if="btn.icon" small class="mr-2 btn-action">
                                                        {{ toAct(item, btn.icon) }}
                                                    </v-icon>
                                                    <span v-else-if="btn.text" class="mr-2 btn-action">
                                                        {{ toAct(item, btn.text) }}
                                                    </span>
                                                </a>
                                            </template>
                                            <template v-else>
                                                <v-icon v-if="btn.icon"
                                                        small class="mr-2 btn-action"
                                                        @click="(e) => { actionItem(item, btn, e); }"
                                                >
                                                    {{ toAct(item, btn.icon) }}
                                                </v-icon>
                                                <span v-else-if="btn.text"
                                                      class="mr-2 btn-action" style="cursor:pointer;"
                                                      @click="(e) => { actionItem(item, btn, e); }">
                                                {{ toAct(item, btn.text) }}
                                                </span>
                                            </template>
                                        </template>
                                    </template>
                                </template>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                    <template v-slot:no-result>
                        <v-alert :value="true" icon="warning">没有找到结果</v-alert>
                    </template>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
  import DateTimePicker from './DateTimePicker';

  export default {
    props: ['setting'],
    components: { DateTimePicker },
    data () {
      return {
        tabSetting: this.setting,
        data: [],
        total: 0,
        sorted: true,
        loading: true,
        search: '',
        selected: [],
        headers: [],
        pagination: this.setting.pagination,
        //
        filter: [],
      }
    },
    created () {
        this.init(this.tabSetting);
        Bus.$on('dtChangeRow', (item, props) => {
            let index = this.data.findIndex((oriItem) => {
                return oriItem.id == item.id;
            });
            if (index >= 0) {
                if (props == undefined || props == null) {
                    Vue.set(this.data, index, item);
                } else {
                    let copy = this.data[index];
                    for (let p in props)
                        copy[props[p]] = item[props[p]];
                    Vue.set(this.data, index, copy);
                }
            } else {
                this.performLoad(true);
            }
        });
        Bus.$on('dtReload', () => { this.performLoad(true); });
    },
    watch: {
        key () { this.load(); },
        pagination: { deep: true, handler() { this.load(); }},
    },
    methods: {
        init: function(setting) {
            this.tabSetting = setting;
            if (setting.hasOwnProperty('rowsPerPageItems')) {
                let rpp = setting.rowsPerPageItems.find(r => { return r == this.pagination.rowsPerPage; });
                if (rpp == undefined)
                    this.pagination.itemsPerPage = setting.rowsPerPageItems[0];
            }
            this.headers = setting.headers;
            if (setting.buttons.edit || setting.buttons.delete || setting.buttons.actions)
                setting.headers.push({ sortable: false });
            if (!setting.hasOwnProperty('showRow') || setting.showRow == true)
                setting.headers.splice(0, 0, { text: '#', sortable: false, rowNum: true });
            this.filter = new Array(setting.filterList.length).fill('');
            for (let i in setting.filterList)
                for (let j in setting.filterList[i].items)
                    if (setting.filterList[i].items[j].used) this.filter[i] = setting.filterList[i].items[j];
        },
        index: function (obj, i) {
            if (obj == null || !obj.hasOwnProperty(i))
                return '';
            return obj[i];
        },
        toVal: function (obj, head) {
            let val = head.value.split('.').reduce(this.index, obj);
            let ret = val;
            if (val == true && head.format == 'tick')
                ret = '<i class="fas fa-check"></i>';
            if (val == false && head.format == 'tick')
                ret = '<i class="fas fa-times"></i>';
            if (head.format == 'avatar') {
                if (val == null)
                    ret = '-';
                else
                    ret = `<img src="${val}" style="width:50px;vertical-align:middle;">`;
            }
            if (head.format == 'color') {
                if (head.color.hasOwnProperty('prop')) {
                    if (head.color.hasOwnProperty(obj[head.color.prop]))
                        ret = '<span style="color:'+head.color[obj[head.color.prop]]+'">' + ret + '</span>';
                } else if (typeof head.color == 'string') {
                    ret = '<span style="color:'+head.color+'">' + ret + '</span>';
                }
            }

            if (head.hasOwnProperty('click'))
                ret = '<span style="cursor:pointer;color:#1976D2">' + ret + '</span>';

            if (head.hasOwnProperty('tip')) {
                let tip = head.tip;
                if (head.tip.hasOwnProperty('value')) tip = obj[head.tip.value] || '';
                if (tip.length > 0)
                    ret = '<span title="'+tip+'" style="text-decoration-line:underline;text-decoration-style:dashed;">' + ret + '</span>';
            }
            return ret;
        },
        toAct: function (obj, text) {
            let q = text.indexOf('?');
            let c = text.indexOf(':');
            if (q < 0 || c < 0 || q > c)
                return text;
            let epr = text.split(/[\?:]+/);
            let val = epr[0].split('.').reduce(this.index, obj);
            if (val) return epr[1];
            return epr[2];
        },
        clickCell (obj, head) {
            if (!head.hasOwnProperty('click')) return;
            if (head.click.hasOwnProperty('href')) {
                let to = head.click.href;
                if (head.click.hasOwnProperty('value'))
                    to = to + obj[head.click.value];
                location.href = to;
                return;
            } else if (head.click.hasOwnProperty('event')) {
                this.actionItem(obj, head.click);
            }
        },
        performLoad (force = false) {
            this.load(force);
        },
        newItem () {
            Bus.$emit(this.tabSetting.buttons.new.event);
        },
        editItem (item, evt) {
            if (this.tabSetting.buttons.edit.lazyLoad) {
                let url = this.tabSetting.buttons.edit.lazyLoad.url + item.id;
                let key = 'item';
                if (this.tabSetting.buttons.edit.lazyLoad.retKey)
                    key = this.tabSetting.buttons.edit.lazyLoad.retKey;
                let cls = evt.target.getAttribute('class');
                evt.target.innerHTML = '';
                evt.target.setAttribute('class', 'v-icon fas fa-circle-notch fa-spin mr-2');
                axios.get(url).then(res => {
                    let item = res.data[key];
                    Bus.$emit(this.tabSetting.buttons.edit.event, item);
                }).catch(
                    err => console.log(err.response.data)
                ).finally(() => {
                    evt.target.setAttribute('class', cls);
                    evt.target.innerHTML = 'edit';
                });
            } else {
                Bus.$emit(this.tabSetting.buttons.edit.event, item);
            }
        },
        deleteItem (item, evt) {
            let name = item.name || '此记录';
            let del = confirm('确认删除 ' + name + ' ?');
            if (!del) return;
            let ids = [ item.id ];
            if (this.tabSetting.debug) {
                alert('[Debug] Perform request to ' + this.tabSetting.urlToDelete);
                return;
            }
            this.performItems(this.tabSetting.urlToDelete, ids);
        },
        actionItem (item, act, evt) {
            if (act.lazyLoad) {

                let url = act.lazyLoad.url;
                if (act.lazyLoad.hasOwnProperty('value'))
                    url += item[act.lazyLoad.value];
                else url += item.id;
                let key = 'item';
                if (act.lazyLoad.retKey)
                    key = act.lazyLoad.retKey;
                let cls = '';
                let html = '';
                if (evt) {
                    cls = evt.target.getAttribute('class');
                    html = evt.target.innerHTML;
                    evt.target.innerHTML = '';
                    evt.target.setAttribute('class', 'v-icon fas fa-circle-notch fa-spin mr-2');
                }
                if (this.tabSetting.debug) {
                    alert('[Debug] Perform request to [' + act.lazyLoad.url + "]\nIt should return a json including [" + key + "]");
                    Bus.$emit(act.event, item);
                    evt.target.setAttribute('class', cls);
                    evt.target.innerHTML = html;
                    return;
                }
                axios.get(url).then(res => {
                    let newItem = res.data[key];
                    Bus.$emit(act.event, newItem);
                }).catch(
                    err => console.log(err.response.data)
                ).finally(() => {
                    if (evt) {
                        evt.target.setAttribute('class', cls);
                        evt.target.innerHTML = html;
                    }
                });
            } else if (act.event) {
                Bus.$emit(act.event, item);
            }
        },
        actionVisible (item, act) {
            if (!act.visible) return true;
            if (!act.visible.when) return false;
            let val = act.visible.when.split('.').reduce(this.index, item);
            if (act.visible.in != undefined && Array.isArray(act.visible.in)) return act.visible.in.indexOf(val) > -1;
            else if (act.visible.equals != undefined) return val == act.visible.equals;
            return false;
        },
        actionItems (act, evt) {
            Bus.$emit(act.event, this.selected, evt);
        },
        deleteItems () {
            let toDel = [];
            for (let i = 0; i < this.selected.length; i++)
                toDel.push(this.selected[i].id);
            if (toDel.length === 0) return;
            let confirmText = '确认删除这些 ?';
            if (toDel.length === 1)
                confirmText = '确认删除 [' + this.selected[0].name + '] ?';
            let del = confirm(confirmText);
            if (!del) return;
            if (this.tabSetting.debug) {
                alert('[Debug] Delete [' + this.selected.length + '] records.');
                return;
            }
            this.performItems(this.tabSetting.urlToDelete, toDel);
        },
        performItems (url, ids) {
            axios.put(url, { ids: ids })
                .then(res => { this.selected = []; this.load(true); });
        },
        load (force = false) {
            this.loading = true;
            let url = this.tabSetting.url;
            if (url.indexOf('?') < 0) url += '?';
            else url += '&';
            url += 'page=' + this.pagination.page + '&row=' + this.pagination.itemsPerPage;
            if (this.pagination.sortBy)
                url += '&sortBy=' + this.pagination.sortBy[0];
            if (this.pagination.sortDesc)
                url += '&direction=' + this.pagination.sortDesc[0];
            if (this.search.length > 0)
                url += '&query=' + this.search;
            for (let i = 0; i < this.filter.length; i++) {
                let type = typeof this.filter[i];
                if (this.filter[i] == null || this.filter[i] === undefined)
                    continue;
                if (type === 'string') {
                    if (this.filter[i].length === 0) continue;
                    url += '&filter' + i + '=' + this.filter[i];
                } else if (type === 'object') {
                    let value = 'id';
                    if (this.tabSetting.filterList[i].hasOwnProperty('value')) value = this.tabSetting.filterList[i].value;
                    url += '&filter' + i + '=' + this.filter[i][value];
                }
            }
            if (this.lastUrl === undefined)
                this.lastUrl = '';
            if (this.lastUrl === url && !force) {
                this.loading = false;
                return;
            } else {
                this.lastUrl = url;
            }
            this.data = [];
            axios.get(url).then(res => {
                let ret = (typeof res.data) == 'string' ? eval('('+res.data+')') : res.data;
                if (ret.hasOwnProperty('setting')) {
                    this.init(ret.setting);
                }
                this.data = ret.data;
                this.total = ret.total;
            }).catch(err => console.log(err.response.data)).finally(() => { this.loading = false; });
        }
    }
  };
</script>

<style scoped>
    .btn-action:hover { color:blue; }
</style>
