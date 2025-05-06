export class Storage {
  private constructor() {}

  private static Instance: Storage;

  static GetInstance() {
    if (!this.Instance) {
      this.Instance = new Storage();
    }

    return this.Instance;
  }

  private RecentAddressKey = "recentAddress";
  private AddressesKey = "addresses";

  loadAddresses() {
    const recentAddress = this.getValue(this.RecentAddressKey, "");
    const addresses = this.getValue(this.AddressesKey, [] as string[]);

    return {
      recentAddress,
      addresses,
    };
  }

  saveRecentAddress(address: string) {
    if (!address.trim()) {
      console.info("The address was not saved because it is empty");
      return;
    }

    this.setValue(this.RecentAddressKey, address);
  }

  saveAddresses(addresses: string[]) {
    this.setValue(this.AddressesKey, addresses);
  }

  private setValue<T>(key: string, value: T) {
    let storageData: string | null = null;
    if (["string", "boolean", "number"].includes(typeof value) || value === null) {
      storageData = String(value);
    } else {
      try {
        storageData = JSON.stringify(value);
      } catch (err) {
        console.error(`Error occurred while in setValue. key: ${key}, value:`, value);
        console.error(err);
      }
    }

    if (storageData) {
      localStorage.setItem(key, storageData);
    } else {
      console.info(`Value was not saved. Key: ${key}`);
    }
  }

  private getValue<T>(key: string, defaultValue: T): T {
    if (defaultValue == null) {
      return defaultValue;
    }

    const rawData = localStorage.getItem(key);
    if (rawData == null) {
      console.log(`Has no data. Key: ${key}`);
      console.info("Default value will be used", defaultValue);
      return defaultValue;
    }

    if (typeof defaultValue !== "object") {
      return this.parsePrimitive(rawData, defaultValue);
    }

    try {
      return JSON.parse(rawData);
    } catch (err) {
      console.error(`Error occurred in getValue. Key: ${key}, Data: ${rawData}`, err);
      console.info("Default value will be used", defaultValue);
      console.info("Item will be removed");
      localStorage.removeItem(key);

      return defaultValue;
    }
  }

  private parsePrimitive<T>(value: string, defaultValue: T): T {
    if (typeof defaultValue === "boolean") {
      return (value === "true") as T;
    }

    if (typeof defaultValue === "number") {
      const num = Number(value);
      return isNaN(num) ? defaultValue : (num as T);
    }

    if (typeof defaultValue === "string") {
      return value as T;
    }

    return defaultValue;
  }
}
