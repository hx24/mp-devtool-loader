<template>
  <section class="component-mp-devtool-netword">
    <div class="action">
      <button class="delete" @click="handleDelete">×</button>
      <input v-model="keyword" class="filter-input" type="text" placeholder="搜索" />
      <checkbox-group @change="filterMonitorChange">
        <label><checkbox value="filterMonitor" :checked="filterMonitor" class="filter-monitor-checkbox" />过滤埋点</label>
      </checkbox-group>
    </div>
    <ul class="network-list">
      <li class="network-row">
        <div class="network-row-overview">
          <div class="overview-column overview-name">Name</div>
          <div class="overview-column overview-method">Method</div>
          <div class="overview-column overview-status">Status</div>
          <div class="overview-column overview-time">Time</div>
        </div>
      </li>
      <li class="network-row" v-for="record in filteredRecords" :key="record.id" >
        <div class="network-row-overview" @click="toggleRecordDetail(record)">
          <div class="overview-column overview-name">{{ record.url }}</div>
          <div class="overview-column overview-method">{{ record.method }}</div>
          <div class="overview-column overview-status">{{ record.status }}</div>
          <div class="overview-column overview-time">
            <template v-if="record.time">{{ record.time }}ms</template>
            <template v-else>pending</template>
          </div>
        </div>
        <div class="network-row-detail" v-if="exposeData[record.id]" v-html="syntaxHighlightDetail(record.id)" @longpress="copyDetail(record.id)"></div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'mp-devtool-monitor',
  components: {},
  props: {},
  data () {
    return {
      records: this.$recorder.getAll(),
      keyword: '',
      details: {},
      filterMonitor: true,
      exposeData: {}
    }
  },
  created () {
    this.$recorder.bus.$on('update', (records) => {
      this.records = records
    })
  },
  methods: {
    filterMonitorChange (e) {
      this.filterMonitor = !!e.detail.value.length
    },
    handleDelete () {
      this.$recorder.clear()
    },
    isString (v) {
      return typeof v === 'string'
    },
    copyDetail (id) {
      uni.setClipboardData({
        data: JSON.stringify(this.details[id])
      })
    },
    toggleRecordDetail (record) {
      const { exposeData } = this
      const { id } = record
      exposeData[id] = !exposeData[id]
      if (exposeData[id]) {
        const response = this.$recorder.getResponse(id)
        this.details[id] = {
          request: record,
          response
        }
      } else {
        delete this.details[id] // TODO 考虑空间和时间的取舍
      }
      this.$forceUpdate()
    },
    syntaxHighlightDetail (id) {
      let json = this.details[id]
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        var color = 'darkorange' // number类型
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            color = 'red' // key
          } else {
            color = 'green' // string类型
          }
        } else if (/true|false/.test(match)) {
          color = 'blue' // boolean类型
        } else if (/null/.test(match)) {
          color = 'magenta' // null类型
        }
        return `<span style="color: ${color}; ">${match}</span>`
      })
      return `<pre style="word-break: break-all; white-space: pre-wrap;">${json}</pre>`
    }
  },
  computed: {
    filteredRecords () {
      const { keyword, records, filterMonitor } = this
      if (!keyword && !filterMonitor) return records
      return (records || []).filter((record) => {
        return record.url.includes(keyword) && (!filterMonitor || !record.url.includes('trackh5.guahao'))
      })
    }
  }
}
</script>

<style scoped>
.component-mp-devtool-netword {
  height: 100%;
  color: #232833;
  font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.action {
  display: flex;
  padding: 10px;
  background: #fff;
}

.delete {
  margin-right: 10px;
  padding: 4px 6px;
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  color: #888;
}

.filter-input {
  flex: 1;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  padding-left: 10px;
}

.filter-monitor-checkbox {
  transform: scale(0.7);
}

.network-list {
  border-top: 1px solid #cdcdcd;
  overflow: auto;
  padding-bottom: 30px;
}

.network-row-overview {
  display: flex;
}

.network-row-overview {
  display: flex;
}

.network-row {
  border-bottom: 1px solid #cdcdcd;
}

.overview-column {
  border-right: 1px solid #cdcdcd;
  width: 50px;
  padding: 3px 4px;
  word-break: break-all;
}

.overview-column:last-of-type {
  border: none;
}

.overview-column.overview-name {
  flex-grow: 1;
}

.network-row-detail {
  border-top: 1px solid #cdcdcd;
  padding: 5px;
}
</style>
