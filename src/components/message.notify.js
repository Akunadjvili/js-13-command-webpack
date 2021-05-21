
import AWN from "awesome-notifications"
let notifier = new AWN({ position: "top-right", durations: { success: 1000 } })

const messages = function () {
  return {
    showSuccess({ code = "unknown", message = "empty" } = {}) {
      notifier.success(`${message}`, {
        labels: {
          success: `${code}`
        }, icons: {
          success: "check-double"
        }
      })
    },
    showInfo({ code = "unknown", message = "empty" } = {}) {
      notifier.info(`${message}`, {
        labels: {
          success: `${code}`
        }, icons: {
          success: "check-double"
        }
      })
    },
    showError({ code = "unknown", message = "empty" } = {}) {
      notifier.alert(`${message}`, {
        labels: {
          alert: `${code}`
        }
      })
    }
  }
}



export default messages();