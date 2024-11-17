import { useState } from 'react';

import { CopyButton } from '@@/buttons/CopyButton';
import { Code } from '@@/Code';
import { NavTabs } from '@@/NavTabs';
import { NavContainer } from '@@/NavTabs/NavContainer';

const deployments = [
  {
    id: 'linux',
    label: 'Linux',
    command: `-v "/var/run/docker.sock:/var/run/docker.sock"`,
  },
  {
    id: 'win',
    label: 'Windows',
    command: '-v \\.\\pipe\\docker_engine:\\.\\pipe\\docker_engine',
  },
];

export function DeploymentScripts() {
  const [deployType, setDeployType] = useState(deployments[0].id);

  const options = deployments.map((c) => ({
    id: c.id,
    label: c.label,
    children: <DeployCode code={c.command} />,
  }));

  return (
    <NavContainer>
      <NavTabs
        options={options}
        onSelect={(id: string) => setDeployType(id)}
        selectedId={deployType}
      />
    </NavContainer>
  );
}

interface DeployCodeProps {
  code: string;
}

function DeployCode({ code }: DeployCodeProps) {
  return (
    <>
      <span className="text-muted small">
        使用 socket 时，确保您已经使用以下 Docker 标志启动了 Portainer 容器：
      </span>

      <Code>{code}</Code>
      <div className="mt-2">
        <CopyButton copyText={code}>复制命令</CopyButton>
      </div>
    </>
  );
}
