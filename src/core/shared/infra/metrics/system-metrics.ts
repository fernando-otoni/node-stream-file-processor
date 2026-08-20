import { Injectable } from "@nestjs/common";
import { SystemMetricsProvider } from "../../application/system-metrics.provider";
import * as os from 'node:os';

const toMb = (n: number) => n / 1024 / 1024

@Injectable()
export class SystemMetricsImpl implements SystemMetricsProvider {
  get system_memory_metrics() {
    const systemTotal = os.totalmem()
    const systemFree = os.freemem()
    const systemUsed = systemTotal - systemFree
    const usedPercentage = (systemUsed / systemTotal) * 100

    return {
      total_ram: this.formatValues(systemTotal),
      free_ram: this.formatValues(systemFree),
      used_ram: this.formatValues(systemUsed),
      used_ram_percentage: usedPercentage.toFixed(2) + '%'
    }
  }

  get process_memory_metrics() {
    const processMemory = process.memoryUsage()
    const heapPercentage = (processMemory.heapUsed / processMemory.heapTotal) * 100

    return {
      heap_rss: this.formatValues(processMemory.rss),
      heap_total: this.formatValues(processMemory.heapTotal),
      heap_used: this.formatValues(processMemory.heapUsed),
      external: this.formatValues(processMemory.external),
      array_buffers: this.formatValues(processMemory.arrayBuffers),
      heap_used_percentage: heapPercentage.toFixed(2) + '%'
    }
  }

  get all_metrics() {
    return {
      system: this.system_memory_metrics,
      process: this.process_memory_metrics
    }
  }
  
  private formatValues(bytes: number) {
    const fixedValue = 2
    if(bytes < 1024) {
      return `${bytes.toFixed(fixedValue)} B`
    }

    if(bytes < 1024 ** 2) {
      return `${(bytes / 1024).toFixed(fixedValue)} KB`
    }

    if (bytes < 1024 ** 3) {
      return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
    }
  
    if (bytes < 1024 ** 4) {
      return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    }
  
    return `${(bytes / 1024 ** 4).toFixed(2)} TB`;
  }
} 