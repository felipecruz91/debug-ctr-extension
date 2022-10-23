import React, { useEffect } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import { Grid, Tooltip, Typography } from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import {
  DataGrid,
  GridValueGetterParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

const columns = [
  {
    field: "id",
    headerName: "Container ID",
    width: 130,
    valueGetter: (params: GridValueGetterParams) => `${params.row.Id || ""}`,
    hide: true,
  },
  {
    field: "name",
    headerName: "Container name",
    width: 130,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.Names[0].substring(1) || ""}`,
  },
  {
    field: "image",
    headerName: "Image",
    width: 130,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.Image || ""}`,
  },
  {
    field: "state",
    headerName: "state",
    width: 130,
    valueGetter: (params: GridValueGetterParams) => `${params.row.State || ""}`,
  },
  {
    field: "status",
    headerName: "Status",
    width: 256,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.Status || ""}`,
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    minWidth: 32,
    sortable: false,
    flex: 1,
    getActions: (params) => {
      return [
        <GridActionsCellItem
          key={"action_debug_container_" + params.row.id}
          icon={
            <Tooltip title="Debug container">
              <TerminalIcon>Debug container</TerminalIcon>
            </Tooltip>
          }
          label="Debug container"
          onClick={fetchAndDisplayResponse(params.row.Id)}
          showInMenu={false}
        />,
      ];
    },
  },
];

const fetchAndDisplayResponse = (containerId) => async () => {
  const ddClient = useDockerDesktopClient();
  const result = await ddClient.extension.host.cli.exec("/debug-ctr", [
    "debug",
    "--image=busybox:latest",
    `--target=${containerId}`,
  ]);
  console.log(result);
  // setResponse(JSON.stringify(result));
};

export function App() {
  const [response, setResponse] = React.useState<string>();
  const [containers, setContainers] = React.useState([]);
  const ddClient = useDockerDesktopClient();

  useEffect(() => {
    const intervalId = setInterval(() => {
      listContainers();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const listContainers = async () => {
    const containers = await ddClient.docker.listContainers({ all: true });
    console.log(containers);
    setContainers(containers as any[]);
  };

  return (
    <>
      <Typography variant="h3">Debug Container</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This extension provides interactive troubleshooting when a container has
        crashed or a container image doesn't include debugging utilities, such
        as distroless images. Heavily inspired by kubectl debug, but for
        containers instead of Pods.
      </Typography>
      <Grid container flex={1} mt={2} height="calc(100vh - 134px)">
        <DataGrid
          getRowId={(row: any) => row.Id}
          rows={containers || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Grid>
    </>
  );
}
