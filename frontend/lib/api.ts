export const API = {

  control:
    process.env
      .NEXT_PUBLIC_CONTROL_API,

  sigma:
    process.env
      .NEXT_PUBLIC_SIGMA_API,

  ueba:
    process.env
      .NEXT_PUBLIC_UEBA_API,

  search:
    process.env
      .NEXT_PUBLIC_SEARCH_API,

  correlation:
    process.env
      .NEXT_PUBLIC_CORRELATION_API,

  hunt:
    process.env
      .NEXT_PUBLIC_HUNT_API,
};

export const WS = {

  simulation:
    process.env
      .NEXT_PUBLIC_SIMULATION_WS,

  graph:
    process.env
      .NEXT_PUBLIC_GRAPH_WS,
};
