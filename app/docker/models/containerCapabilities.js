var capDesc = {
  SETPCAP: '修改流程功能。',
  MKNOD: '使用 mknod(2) 创建特殊文件。',
  AUDIT_WRITE: '将记录写入内核审计日志。',
  CHOWN: '对文件 UID 和 GID 进行任意更改（请参阅 chown(2)）。',
  NET_RAW: '使用 RAW 和 PACKET 套接字。',
  DAC_OVERRIDE: '绕过文件读取、写入和执行权限检查。',
  FOWNER: '绕过通常需要进程的文件系统 UID 与文件 UID 匹配的操作的权限检查。',
  FSETID: '修改文件时不要清除 set-user-ID 和 set-group-ID 权限位。',
  KILL: '绕过发送信号的权限检查。',
  SETGID: '对进程 GID 和补充 GID 列表进行任意操作。',
  SETUID: '对进程 UID 进行任意操作。',
  NET_BIND_SERVICE: '将套接字绑定到 Internet 域特权端口（端口号小于 1024）。',
  SYS_CHROOT: '使用 chroot(2)，更改根目录。',
  SETFCAP: '设置文件功能。',
  SYS_MODULE: '加载和卸载内核模块。',
  SYS_RAWIO: '执行 I/O 端口操作（iopl(2) 和 ioperm(2)）。',
  SYS_PACCT: '使用 acct(2)，打开或关闭进程记帐。',
  SYS_ADMIN: '执行一系列系统管理操作。',
  SYS_NICE: '提高进程 nice 值（nice(2)、setpriority(2)）并更改任意进程的 nice 值。',
  SYS_RESOURCE: '覆盖资源限制。',
  SYS_TIME: '设置系统时钟(settimeofday(2), stime(2), adjtimex(2)); 设置实时（硬件）时钟。',
  SYS_TTY_CONFIG: '使用 vhangup(2); 在虚拟终端上使用各种特权 ioctl(2) 操作。',
  AUDIT_CONTROL: '启用和禁用内核审计； 更改审计过滤规则； 检索审计状态和过滤规则。',
  MAC_ADMIN: '允许 MAC 配置或状态更改。 为 Smack LSM 实现。',
  MAC_OVERRIDE: '覆盖强制访问控制 (MAC)。 为 Smack Linux 安全模块 (LSM) 实现。',
  NET_ADMIN: '执行各种与网络相关的操作。',
  SYSLOG: '执行特权 syslog(2) 操作。',
  DAC_READ_SEARCH: '绕过文件读取权限检查和目录读取和执行权限检查。',
  LINUX_IMMUTABLE: '设置 FS_APPEND_FL 和 FS_IMMUTABLE_FL i-node 标志。',
  NET_BROADCAST: '进行套接字广播，并收听多播。',
  IPC_LOCK: '锁定内存（mlock(2)、mlockall(2)、mmap(2)、shmctl(2)）。',
  IPC_OWNER: '绕过对 System V IPC 对象操作的权限检查。',
  SYS_PTRACE: '使用 ptrace(2) 跟踪任意进程。',
  SYS_BOOT: '使用reboot(2) 和kexec_load(2)，重新启动并加载新内核供以后执行。',
  LEASE: '在任意文件上建立租约（请参阅 fcntl(2)）。',
  WAKE_ALARM: '触发一些会唤醒系统的东西。',
  BLOCK_SUSPEND: '使用可以阻止系统挂起的功能。',
};

export function ContainerCapabilities() {
  // all capabilities can be found at https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities
  return [
    new ContainerCapability('SETPCAP', true),
    new ContainerCapability('MKNOD', true),
    new ContainerCapability('AUDIT_WRITE', true),
    new ContainerCapability('CHOWN', true),
    new ContainerCapability('NET_RAW', true),
    new ContainerCapability('DAC_OVERRIDE', true),
    new ContainerCapability('FOWNER', true),
    new ContainerCapability('FSETID', true),
    new ContainerCapability('KILL', true),
    new ContainerCapability('SETGID', true),
    new ContainerCapability('SETUID', true),
    new ContainerCapability('NET_BIND_SERVICE', true),
    new ContainerCapability('SYS_CHROOT', true),
    new ContainerCapability('SETFCAP', true),
    new ContainerCapability('SYS_MODULE', false),
    new ContainerCapability('SYS_RAWIO', false),
    new ContainerCapability('SYS_PACCT', false),
    new ContainerCapability('SYS_ADMIN', false),
    new ContainerCapability('SYS_NICE', false),
    new ContainerCapability('SYS_RESOURCE', false),
    new ContainerCapability('SYS_TIME', false),
    new ContainerCapability('SYS_TTY_CONFIG', false),
    new ContainerCapability('AUDIT_CONTROL', false),
    new ContainerCapability('MAC_ADMIN', false),
    new ContainerCapability('MAC_OVERRIDE', false),
    new ContainerCapability('NET_ADMIN', false),
    new ContainerCapability('SYSLOG', false),
    new ContainerCapability('DAC_READ_SEARCH', false),
    new ContainerCapability('LINUX_IMMUTABLE', false),
    new ContainerCapability('NET_BROADCAST', false),
    new ContainerCapability('IPC_LOCK', false),
    new ContainerCapability('IPC_OWNER', false),
    new ContainerCapability('SYS_PTRACE', false),
    new ContainerCapability('SYS_BOOT', false),
    new ContainerCapability('LEASE', false),
    new ContainerCapability('WAKE_ALARM', false),
    new ContainerCapability('BLOCK_SUSPEND', false),
  ].sort(function (a, b) {
    return a.capability < b.capability ? -1 : 1;
  });
}

export function ContainerCapability(cap, allowed) {
  this.capability = cap;
  this.allowed = allowed;
  this.description = capDesc[cap];
}
