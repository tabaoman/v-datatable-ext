<template>
    <v-menu
        :close-on-content-click="false"
        v-model="menu"
        trasition="v-scale-transition"
        offset-y
        :nudge-left="40"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                :label="label"
                :value="datetime"
                clearable
                readonly
                v-on="on"
            ></v-text-field>
        </template>
        <v-tabs
                grow
                centered
                v-model="selectedTab"
        >
            <v-tab key="0">
                <v-icon>event</v-icon>
            </v-tab>
            <v-tab key="1">
                <v-icon>access_time</v-icon>
            </v-tab>

            <v-tab-item key="0">
                <v-date-picker
                        v-model="dateModel"
                        no-title
                        scrollable
                        actions
                        @input="checkHours">
                </v-date-picker>
            </v-tab-item>
            <v-tab-item key="1">
                <v-time-picker
                        ref="timer"
                        v-model="timeModel"
                        no-title
                        scrollable
                        format="24hr"
                        actions
                        @click:minute="clickMinute"
                        @input="checkMinutes">
                </v-time-picker>
            </v-tab-item>
        </v-tabs>
    </v-menu>
</template>

<script>
    export default {
        name: 'DateTimePicker',
        model: {
            prop: 'datetime',
            event: 'input'
        },
        props: {
            datetime: { type:String, required:true },
            label: { type:String, default:'' }
        },
        data() {
            return {
                dateModel: '',
                timeModel: '',
                menu: false,
                selectedTab: 0
            };
        },
        created() {
            if (this.datetime === undefined) return;
            if (this.datetime.indexOf(' ') < 0) return;
            this.dateModel = this.datetime.split(' ')[0];
            this.timeModel = this.datetime.split(' ')[1];
        },
        watch: {
            menu(val) {
                this.selectedTab = 0;
                if (val) {
                    if (this.datetime.indexOf(' ') < 0) return;
                    this.dateModel = this.datetime.split(' ')[0];
                    this.timeModel = this.datetime.split(' ')[1];
                    if (this.$refs.timer)
                        this.$refs.timer.selectingHour = true;
                }
            },
            selectedTab(val) {
                if (this.$refs.timer)
                    this.$refs.timer.selectingHour = true;
            }
        },
        methods: {
            clickMinute(min) {
                let time = this.timeModel.split(':');
                time[1] = min;
                time = time[0] + ':' + time[1];
                this.checkMinutes(time);
            },
            checkMinutes(val) {
                if (this.$refs.timer.selectingHour === false) {
                    this.timeModel = val + ':00';
                    this.$refs.timer.selectingHour = true;
                    this.selectedTab = 0;
                    this.menu = false;
                    let datetime = this.dateModel + ' ' + this.timeModel;
                    this.$emit('input', datetime);
                }
            },
            checkHours(val) {
                this.dateModel = val;
                this.selectedTab = 1;
            },
        },
    };
</script>

<style scoped>
    .v-menu__content { max-width: 290px !important; min-width: 290px !important; }
</style>
