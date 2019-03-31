const button = document.querySelector('.ripple-button');
mdc.ripple.MDCRipple.attachTo(button);

var app = new Vue({
  el: '#app',
  data: {
    name: "",
    logs: [],
    showForm: false,
    showEditForm: false,
    editLog: null,
  },
  created() {
    this.getLogs();
  },
  methods: {
    getDateString(time) {
      let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      };
      return (new Date(time)).toLocaleDateString("en-US", options);
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
    },
    updateSelected(index) {
      this.editLog = this.logs[index];
      this.toggleEditForm();
    },
    async getLogs() {
      try {
        let response = await axios.get("/api/logs");
        console.log(response);
        this.logs = response.data;
        return true
      } catch (error) {
        console.log(error);
      }
    },
    async addLog() {
      let newLog = {
        name: this.name,
        date: (new Date().getTime())
      }
      let response = await axios.post('/api/logs', newLog);
      this.logs.push(response.data);
      this.toggleForm();
      this.name = "";
    },
    async deleteLog() {
      try {
        let response = await axios.delete("/api/logs/" + this.editLog._id);
        this.getLogs();
        this.toggleEditForm();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async updateLog() {
      try {
        let response = await axios.put("/api/logs/" + this.editLog._id, {
          name: this.editLog.name
        });
        this.getLogs();
        this.toggleEditForm();
        return true;
      } catch (error) {
        console.log(error);
      }
    }
  }
});