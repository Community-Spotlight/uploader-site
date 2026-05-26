/**
 * Emit and handle custom events.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Events {
  static eventCache = new Map();

  /**
   * Emits a custom event and run their listeners
   *
   * @param {String} eventName name identifier of the event
   * @param {*} optData optional event data recieved by listeners
   */
  static emit(eventName, ...optData) {
    const listeners = this.eventCache.get(String(eventName));
    if (listeners) {
      listeners.forEach((func) => func(...optData));
    }
  }

  /**
   * Append a listener to a custom event.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} func function that runs when emitted
   */
  static on(eventName, func) {
    if (typeof func !== "function") {
      throw new Error("Events.on -- Parameter 2 must be a function!");
    }

    const name = String(eventName);
    if (this.eventCache.has(name)) {
      this.eventCache.get(name).push(func);
    } else {
      this.eventCache.set(name, [func]);
    }
  }

  /**
   * Append a listener to a custom event. Will run before all other listeners.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} func function that runs when emitted
   */
  static before(eventName, func) {
    if (typeof func !== "function") {
      throw new Error("Events.before -- Parameter 2 must be a function!");
    }

    const name = String(eventName);
    if (this.eventCache.has(name)) {
      this.eventCache.get(name).unshift(func);
    } else {
      this.eventCache.set(name, [func]);
    }
  }

  /**
   * Appends a listener to a custom event. Runs once.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} func function that runs when emitted
   */
  static once(eventName, func) {
    if (typeof func !== "function") {
      throw new Error("Events.once -- Parameter 2 must be a function!");
    }

    const name = String(eventName);
    const wrapper = (data) => {
      // Remove this listener after it fires
      this.off(name, wrapper);
      func(data);
    };

    this.on(name, wrapper);
  }

  /**
   * Remove a listener(s) from a custom event. Will remove all listeners if
   * second parameter is not provided.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} optFunc specific function to remove
   */
  static off(eventName, optFunc) {
    const name = String(eventName);
    const funcs = this.eventCache.get(name);
    if (!funcs) return;

    if (typeof optFunc === "function") {
      const filtered = funcs.filter((f) => f !== optFunc);
      this.eventCache.set(name, filtered);
    } else {
      // No function provided, remove all listeners
      this.eventCache.delete(name);
    }
  }

  /**
   * Removes all listeners and custom events.
   */
  static flush() {
    this.eventCache.clear();
  }
}

window.Events = Events;
