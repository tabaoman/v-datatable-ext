/*
 * MIT License
 *
 * Copyright (C) 2019 tabaoman
 *
 */


import DataTableExt from './components/DataTableExt';
import DateTimePicker from './components/DateTimePicker';

const install = Vue => {
    Vue.component('v-datetime-picker', DateTimePicker);
    Vue.component('v-datatable-ext', DataTableExt);
};

export default install;
