interface SystemMemoryMetricsOutput {
  total_ram: string
  free_ram: string
  used_ram: string
  used_ram_percentage: string
}

interface ProcessHeapMemoryMetricsOutput {
  heap_rss: string
  heap_total: string
  heap_used: string
  external: string
  array_buffers: string
  heap_used_percentage: string
}

export abstract class SystemMetricsProvider {
  system_memory_metrics: SystemMemoryMetricsOutput
  process_memory_metrics: ProcessHeapMemoryMetricsOutput
  all_metrics: {
    system: SystemMemoryMetricsOutput
    process: ProcessHeapMemoryMetricsOutput
  }
}